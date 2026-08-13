import { EQUALIZER_BAND_FREQUENCIES } from '@shared/types/settings'

interface AttachedChain {
  source: MediaElementAudioSourceNode
  filters: BiquadFilterNode[]
}

/**
 * Singleton Web Audio graph shared by the equalizer and the visualizer.
 *
 * Each <audio>/<video> element can only ever have `createMediaElementSource`
 * called on it once for its whole lifetime, so each element is attached at
 * most once and kept in `chains` for the lifetime of the app. Both chains
 * feed into the same AnalyserNode -> destination, so whichever element is
 * actually producing sound is what the equalizer/visualizer reacts to.
 */
class AudioGraph {
  private context: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private readonly chains = new WeakMap<HTMLMediaElement, AttachedChain>()
  private currentGains: number[] = EQUALIZER_BAND_FREQUENCIES.map(() => 0)

  private ensureContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext()
      this.analyser = this.context.createAnalyser()
      this.analyser.fftSize = 2048
      this.analyser.smoothingTimeConstant = 0.8
      this.analyser.connect(this.context.destination)
    }
    return this.context
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser
  }

  getAudioContext(): AudioContext | null {
    return this.context
  }

  /** Idempotent: safe to call every render, only wires the element once. */
  attach(element: HTMLMediaElement | null): void {
    if (!element || this.chains.has(element)) return

    const context = this.ensureContext()
    const source = context.createMediaElementSource(element)
    const filters = EQUALIZER_BAND_FREQUENCIES.map((frequency, index) => {
      const filter = context.createBiquadFilter()
      filter.type = index === 0 ? 'lowshelf' : index === EQUALIZER_BAND_FREQUENCIES.length - 1 ? 'highshelf' : 'peaking'
      filter.frequency.value = frequency
      filter.Q.value = 1
      filter.gain.value = this.currentGains[index] ?? 0
      return filter
    })

    let node: AudioNode = source
    for (const filter of filters) {
      node.connect(filter)
      node = filter
    }
    if (this.analyser) node.connect(this.analyser)

    this.chains.set(element, { source, filters })
  }

  setGains(gains: number[]): void {
    this.currentGains = gains
    // WeakMap isn't iterable, so we can't loop attached chains directly;
    // instead each attached element's filters are updated the next time
    // attach() sees a gain change via applyGainsTo(), called by the hook
    // for whichever elements it holds refs to.
  }

  applyGainsTo(element: HTMLMediaElement | null, gains: number[]): void {
    if (!element) return
    const chain = this.chains.get(element)
    if (!chain) return
    chain.filters.forEach((filter, index) => {
      filter.gain.setTargetAtTime(gains[index] ?? 0, this.context?.currentTime ?? 0, 0.05)
    })
  }

  async resume(): Promise<void> {
    if (this.context?.state === 'suspended') {
      await this.context.resume()
    }
  }
}

export const audioGraph = new AudioGraph()
