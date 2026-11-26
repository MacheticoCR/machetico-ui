import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
/**
 * Decorative lazy video with a server-rendered poster and browser-owned visibility cleanup.
 * @class BackgroundVideo
 */
@Component({
  selector: 'machetico-background-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './background-video.html',
})
export class BackgroundVideo {
  /**
   * Exact consumer-owned video URL, assigned only when browser policy permits loading.
   * @property src
   */
  public readonly src = input.required<string>();
  /**
   * Static decorative fallback available during SSR and constrained browsing.
   * @property poster
   */
  public readonly poster = input.required<string>();
  /**
   * Whether client video enhancement is enabled.
   * @property enabled
   */
  public readonly enabled = input(true);
  /**
   * Minimum viewport width for video; zero permits all widths.
   * @property minimumWidth
   */
  public readonly minimumWidth = input(0);
  /**
   * Whether a playable frame is visible; consumers may animate this semantic state.
   * @property playing
   */
  public readonly playing = signal(false);
  /**
   * Native video element owned by Angular.
   * @property video
   */
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  /**
   * Document ownership for visibility events.
   * @property document
   */
  private readonly document = inject(DOCUMENT);
  /**
   * Prevents media and observer APIs during server rendering.
   * @property browser
   */
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  /**
   * Installs browser media policy and releases observers, listeners and downloads on destruction.
   * @function constructor
   */
  public constructor() {
    afterRenderEffect((cleanup) => {
      const src = this.src();
      const poster = this.poster();
      const enabled = this.enabled();
      const minimumWidth = this.minimumWidth();
      if (!this.browser) return;
      const video = this.video().nativeElement;
      const win = this.document.defaultView;
      if (!win) return;
      const motion = win.matchMedia('(prefers-reduced-motion: reduce)');
      const width = win.matchMedia('(min-width: ' + minimumWidth + 'px)');
      const connection = Reflect.get(win.navigator, 'connection');
      const saveData =
        typeof connection === 'object' &&
        connection !== null &&
        Reflect.get(connection, 'saveData') === true;
      let near = false;
      let visible = false;
      const update = (): void => {
        const allowed = enabled && !motion.matches && width.matches && !saveData;
        if (allowed && near && !video.getAttribute('src')) {
          video.src = src;
          video.load();
        }
        if (allowed && visible && !this.document.hidden && video.getAttribute('src')) {
          void video
            .play()
            .then(() => this.playing.set(true))
            .catch(() => this.playing.set(false));
        } else {
          video.pause();
          this.playing.set(false);
        }
      };
      const nearObserver =
        typeof IntersectionObserver === 'undefined'
          ? undefined
          : new IntersectionObserver(
              (entries) => {
                near = entries.some((entry) => entry.isIntersecting);
                update();
              },
              { rootMargin: '400px' },
            );
      const visibleObserver =
        typeof IntersectionObserver === 'undefined'
          ? undefined
          : new IntersectionObserver((entries) => {
              visible = entries.some((entry) => entry.isIntersecting);
              update();
            });
      if (nearObserver && visibleObserver) {
        nearObserver.observe(video);
        visibleObserver.observe(video);
      } else {
        near = true;
        visible = true;
      }
      video.poster = poster;
      video.muted = true;
      motion.addEventListener('change', update);
      width.addEventListener('change', update);
      this.document.addEventListener('visibilitychange', update);
      update();
      cleanup(() => {
        nearObserver?.disconnect();
        visibleObserver?.disconnect();
        motion.removeEventListener('change', update);
        width.removeEventListener('change', update);
        this.document.removeEventListener('visibilitychange', update);
        video.pause();
        video.removeAttribute('src');
        video.load();
      });
    });
  }
}
