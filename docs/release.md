# Release Process

LinPlayer targets Linux first, packaged as an AppImage and a `.deb` via
[electron-builder](https://www.electron.build/).

## Local packaging

```bash
npm run package          # AppImage + .deb
npm run package:appimage # AppImage only
npm run package:deb      # .deb only
```

Artifacts are written to `release/`.

## Automated releases

Pushing a tag matching `v*.*.*` (e.g. `v0.1.0`) triggers
`.github/workflows/release.yml`, which:

1. Installs dependencies
2. Runs lint, typecheck, and tests
3. Builds the app (`electron-vite build`)
4. Packages the AppImage and `.deb` (`electron-builder`)
5. Creates a GitHub Release for the tag and uploads both artifacts

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Versioning

LinPlayer follows [Semantic Versioning](https://semver.org/). Until 1.0.0,
minor versions may include breaking changes to the local database schema
(handled via additive migrations, not destructive resets) or settings
shape.
