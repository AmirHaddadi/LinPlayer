# خلاصه کار — LinPlayer (v0.1.0)

این فایل توضیح می‌دهد که در این نشست چه کاری روی پروژه **LinPlayer** انجام شد، ساختار پروژه چیست، و هر بخش چه نقشی دارد.

مخزن: https://github.com/AmirHaddadi/LinPlayer (برنچ `main`, ۶ کامیت)

## چه چیزی ساخته شد؟

یک اپلیکیشن دسکتاپ پلیر مدیا برای لینوکس با پشته Electron + React + TypeScript + SQLite، از صفر، شامل:

- پخش صوت و ویدیو (mp3, wav, flac, aac, m4a, ogg, opus, aiff, wma, mp4, mkv, webm, mov, avi, m4v, mpeg, ts, flv)
- کتابخانه رسانه با اسکن پوشه به‌صورت async (بدون فریز شدن UI)
- استخراج متادیتا (عنوان، هنرمند، آلبوم، مدت، کدک، بیت‌ریت، رزولوشن، آرت‌ورک) با ffprobe + music-metadata
- پلی‌لیست‌ها (ساخت/تغییرنام/حذف/افزودن/حذف آیتم/ری‌اوردر با درگ)
- علاقه‌مندی‌ها (Favorites) و تاریخچه پخش (History)
- جستجوی全域 (title/artist/album/genre/filename)
- تنظیمات (تم، پخش، کتابخانه، عمومی)
- کنترل کامل پخش: play/pause/seek/volume/mute/shuffle/repeat/speed/fullscreen/queue
- شورتکات‌های کیبورد و Drag & Drop فایل/پوشه
- طراحی UI تیره و اختصاصی (نه یک دمو ژنریک shadcn)
- امنیت Electron: contextIsolation، sandbox، بدون دسترسی مستقیم Node به رندرر، IPC تایپ‌شده
- بسته‌بندی لینوکس: AppImage و .deb (هر دو با موفقیت build و اجرا شدند)
- تست‌های واحد و یکپارچگی (۲۱ تست، همه پاس)
- GitHub Actions: CI، بیلد لینوکس، ریلیز خودکار روی تگ

## ساختار پروژه (چی کجاست؟)

```
src/
├── main/            پردازش اصلی Electron
│   ├── index.ts       نقطه ورود: bootstrap، چرخه حیات پنجره
│   ├── window/         ساخت BrowserWindow (frameless، امن)
│   ├── ipc/             تمام IPC handlerها (media/library/playlists/history/settings/window)
│   └── services/        appServices (تزریق وابستگی)، mediaProtocol (پروتکل امن پخش فایل)
│
├── preload/          پل امن contextBridge → فقط window.linplayer را expose می‌کند
│
├── renderer/src/     اپ React (Vite)
│   ├── app/            App.tsx (بوت‌استرپ استورها)، AppShell، ScreenRouter
│   ├── components/     common (Button, Modal, Toast, ...)، layout (Sidebar, TopBar)، media، player
│   ├── features/       صفحات: home, library (music/videos)، playlists، favorites، history، settings، player
│   ├── stores/          ۵ استور Zustand مجزا: player, library, playlist, settings, ui
│   └── hooks/            usePlayMedia, useKeyboardShortcuts, useDragAndDropImport
│
├── core/             منطق دامنه، مستقل از Electron (قابل تست جدا)
│   ├── database/        اسکیمای SQLite + migration runner + repositoryها
│   ├── media/            MediaEngine، ffprobe wrapper، music-metadata tags، artwork cache، LibraryScanner
│   ├── filesystem/        اسکنر بازگشتی async پوشه‌ها
│   ├── playlists/         PlaylistService (اعتبارسنجی روی repository)
│   ├── settings/           SettingsService
│   └── logging/            لاگر ساختاریافته (debug/info/warn/error)
│
└── shared/           تایپ‌ها و ثابت‌های مشترک بین main/preload/renderer (بدون وابستگی به Node/Electron)

tests/
├── unit/             توابع خالص + سرویس‌های mock‌شده
└── integration/       دیتابیس واقعی SQLite روی فایل موقت

.github/workflows/    ci.yml, build-linux.yml, release.yml
docs/                 architecture.md, development.md, media-support.md, release.md
```

### جهت وابستگی معماری (رعایت شده)

```
UI (React) → استورهای Zustand → window.linplayer (IPC) → core/* (main process) → SQLite / ffprobe / fs
```
هیچ کامپوننت Reactای مستقیم به SQLite، fs، child_process یا ffmpeg دسترسی ندارد.

## چه چیزی واقعاً تست و تأیید شد

| مرحله | نتیجه |
|---|---|
| `npm install` | ✅ موفق |
| `npm run typecheck` | ✅ بدون خطا |
| `npm run lint` | ✅ بدون خطا |
| `npm run test` | ✅ ۲۱/۲۱ تست پاس |
| `npm run build` | ✅ موفق (main/preload/renderer) |
| اجرای واقعی اپ (Electron headless، بدون دیسپلی) | ✅ بوت شد، دیتابیس SQLite ساخته شد، تمام جدول‌ها ایجاد شدند، بدون کرش |
| `npm run package` | ✅ هم AppImage و هم .deb ساخته شدند |
| اجرای AppImage نهایی | ✅ بوت موفق، دیتابیس/artwork cache ساخته شد |

فایل‌های خروجی (لوکال، در `.gitignore` هستند و در گیت نیستند):
- `release/LinPlayer-0.1.0.AppImage` (~198MB)
- `release/linplayer_0.1.0_amd64.deb` (~131MB)

⚠️ **مهم:** چون این محیط بدون دیسپلی گرافیکی (X11) است، اپ فقط به‌صورت headless اجرا و تأیید شد (بوت، دیتابیس، عدم کرش). UI به‌صورت بصری روی یک دسکتاپ واقعی لینوکس تست نشده — پیشنهاد می‌شود قبل از استفاده روزمره، خودتان `npm run dev` را روی سیستم خودتان اجرا و ظاهر/رفتار UI را چک کنید.

## کامیت‌ها (۶ عدد، معنادار و مرحله‌به‌مرحله)

1. `chore: initialize LinPlayer project foundation` — تنظیمات build/tooling
2. `feat: add domain core — SQLite persistence and media engine` — src/core و src/shared
3. `feat: add secure Electron main process and preload IPC bridge` — src/main و src/preload
4. `feat: add React renderer UI — player, library, playlists, settings` — src/renderer
5. `test: add unit and integration test suite` — tests/
6. `docs: add CI/CD workflows, documentation, and repo quality files` — مستندات و CI

## محدودیت‌های شناخته‌شده (صادقانه)

- **لایسنس هنوز نهایی نشده** — فایل `LICENSE` یک placeholder است؛ باید خودتان لایسنس نهایی (MIT/Apache-2.0/GPL) را انتخاب کنید.
- ایمیل maintainer در `package.json` یک مقدار placeholder است (`linplayer@example.com`) — فقط برای اینکه بیلد `.deb` کار کند لازم بود؛ آن را با ایمیل واقعی جایگزین کنید.
- Resume playback position (ادامه از جایی که قطع شده) هنوز به UI وصل نشده — تنظیمش در Settings هست ولی رفتار "ask/always/never" پیاده نشده.
- بدون زیرنویس، بدون انتخاب چند تراک صوتی، بدون equalizer — معماری برایشان آماده است ولی پیاده نشده‌اند (طبق روندمپ).
- بدون تست E2E خودکار (Playwright/Spectron) — فقط unit/integration.
- ماژول native (`better-sqlite3`) باید بسته به اینکه می‌خواهید تست بزنید یا اپ را اجرا کنید، برای ABI درست (Node یا Electron) rebuild شود — جزئیات در `docs/development.md`.

## قدم بعدی برای شما

```bash
git clone https://github.com/AmirHaddadi/LinPlayer.git
cd LinPlayer
npm install
npm run dev
```

سپس در `Settings → Library` یک پوشه رسانه اضافه کنید تا اسکن شروع شود، یا از صفحه Home دکمه «Open file» / «Scan folder» را بزنید.
