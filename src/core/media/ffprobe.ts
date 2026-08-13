import ffmpeg from 'fluent-ffmpeg'
import ffprobeStatic from 'ffprobe-static'

ffmpeg.setFfprobePath(ffprobeStatic.path)

export interface ProbeResult {
  format: {
    formatName?: string
    duration?: number
    bitRate?: number
    tags?: Record<string, string>
  }
  videoStream?: {
    codec?: string
    width?: number
    height?: number
    frameRate?: number
  }
  audioStream?: {
    codec?: string
    sampleRate?: number
    channels?: number
    bitRate?: number
  }
}

export function ffprobeFile(filePath: string): Promise<ProbeResult> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const videoStream = data.streams.find((s) => s.codec_type === 'video')
      const audioStream = data.streams.find((s) => s.codec_type === 'audio')

      let frameRate: number | undefined
      if (videoStream?.r_frame_rate) {
        const [num, den] = videoStream.r_frame_rate.split('/').map(Number)
        if (den) frameRate = num / den
      }

      resolve({
        format: {
          formatName: data.format.format_name,
          duration: data.format.duration ? Number(data.format.duration) : undefined,
          bitRate: data.format.bit_rate ? Number(data.format.bit_rate) : undefined,
          tags: data.format.tags as Record<string, string> | undefined
        },
        videoStream: videoStream
          ? {
              codec: videoStream.codec_name,
              width: videoStream.width,
              height: videoStream.height,
              frameRate
            }
          : undefined,
        audioStream: audioStream
          ? {
              codec: audioStream.codec_name,
              sampleRate: audioStream.sample_rate ? Number(audioStream.sample_rate) : undefined,
              channels: audioStream.channels,
              bitRate: audioStream.bit_rate ? Number(audioStream.bit_rate) : undefined
            }
          : undefined
      })
    })
  })
}
