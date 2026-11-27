import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  afterRenderEffect,
  ElementRef,
  viewChildren,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import type { ImageSlide } from 'machetico-ui/core';
import { Icon } from 'machetico-ui/icon';

/**
 * Circular image carousel adapted from Taurus; the consumer owns visual identity and image data.
 *
 * @remarks
 * Angular owns this instance through dependency injection or the component tree. Service cleanup
 * uses DestroyRef; component lifecycle hooks remain on components.
 *
 * @class ImageSlider
 * @functions `ngAfterViewInit` , `ngOnDestroy` , `select` , `settle` , `imageLoaded` ,
 * `imageFailed` , `retry` , `hover` , `focusEntered` , `pause` , `toggle`
 */
@Component({
  selector: 'machetico-image-slider',
  imports: [Icon],
  templateUrl: './image-slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSlider implements AfterViewInit, OnDestroy {
  /**
   * Accessible previous-slide action label.
   * @property previousLabel
   */
  public readonly previousLabel = input('Imagen anterior');

  /**
   * Accessible next-slide action label.
   * @property nextLabel
   */
  public readonly nextLabel = input('Imagen siguiente');

  /**
   * Accessible action for pausing automatic rotation.
   * @property pauseLabel
   */
  public readonly pauseLabel = input('Pausar imágenes');

  /**
   * Accessible action for resuming automatic rotation.
   * @property resumeLabel
   */
  public readonly resumeLabel = input('Reanudar imágenes');

  /**
   * Status announcement while the active media loads.
   * @property loadingLabel
   */
  public readonly loadingLabel = input('Cargando imagen');

  /**
   * Consumer-owned recoverable media failure message.
   * @property failureLabel
   */
  public readonly failureLabel = input('No se pudo cargar esta imagen.');

  /**
   * Consumer-owned retry action label.
   * @property retryLabel
   */
  public readonly retryLabel = input('Reintentar');

  /**
   * Consumer-owned empty collection announcement.
   * @property emptyLabel
   */
  public readonly emptyLabel = input('Sin imágenes.');

  /**
   * Consumer-owned prefix for individual slide action labels.
   * @property viewPrefix
   */
  public readonly viewPrefix = input('Ver');

  /**
   * Consumer-owned localized count separator.
   * @property countSeparator
   */
  public readonly countSeparator = input('de');
  /**
   * Whether the consumer displays the shared current/total count alongside its caption.
   * @property showCount
   */
  public readonly showCount = input(true);

  /**
   * Rendered images checked after hydration when native load events may have already fired.
   * @property images
   */
  private readonly images = viewChildren<ElementRef<HTMLImageElement>>('imageElement');
  /**
   * Guards browser-only effects and timers during server rendering.
   * @property browser
   */
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Intrinsic image width, used to reserve media space consistently during SSR and CSR.
   * @property imageWidth
   */
  public readonly imageWidth = input(1120);

  /**
   * Intrinsic image height; the default follows Taurus's portrait gallery.
   * @property imageHeight
   */
  public readonly imageHeight = input(1400);

  /**
   * Fallback and instant-reset timer owned by this carousel instance.
   *
   * @property snapTimer
   * @remarks
   * Optional: absence is not automatically equivalent to zero, false, or an empty string.
   */
  private snapTimer?: ReturnType<typeof setTimeout>;

  /**
   * Releases motion and document-visibility listeners.
   *
   * @property cleanupView
   * @remarks
   * Optional: absence is not automatically equivalent to zero, false, or an empty string.
   */
  private cleanupView?: () => void;

  /**
   * Injected browser document, allowing tests without relying on a hidden global.
   *
   * @property document
   */
  private readonly document = inject(DOCUMENT);

  /**
   * Instance-owned reactive hidden state consumed by the associated view.
   *
   * @property hidden
   */
  private readonly hidden = signal(false);

  /**
   * Instance-owned reactive hovered state consumed by the associated view.
   *
   * @property hovered
   */
  public readonly hovered = signal(false);

  /**
   * Instance-owned reactive offset state consumed by the associated view.
   *
   * @property offset
   */
  private readonly offset = signal<number | null>(null);

  /**
   * Instance-owned reactive ready state consumed by the associated view.
   *
   * @property ready
   */
  private readonly ready = signal(false);

  /**
   * Instance-owned reactive reduced motion state consumed by the associated view.
   *
   * @property reducedMotion
   */
  public readonly reducedMotion = signal(false);

  /**
   * Immutable consumer-owned image sources and accessible captions.
   *
   * @property slides
   */
  public readonly slides = input.required<readonly ImageSlide[]>();

  /**
   * Visible label, configured or translated according to its source.
   *
   * @property label
   */
  public readonly label = input('Galería de imágenes');

  /**
   * Native responsive image slot sizes supplied to each image.
   *
   * @property sizes
   */
  public readonly sizes = input('(min-width: 1024px) 480px, 90vw');

  /**
   * Automatic rotation delay in milliseconds; zero disables rotation.
   *
   * @property interval
   */
  public readonly interval = input(5000);

  /**
   * Prioritizes the active image when this gallery is important for the first paint.
   *
   * @property priority
   */
  public readonly priority = input(false);

  /**
   * Initial zero-based image selection, clamped to the available slides.
   *
   * @property initialIndex
   */
  public readonly initialIndex = input(0);

  /**
   * Instance-owned reactive paused state consumed by the associated view.
   *
   * @property paused
   */
  public readonly paused = signal(false);

  /**
   * Instance-owned reactive snapping state consumed by the associated view.
   *
   * @property snapping
   */
  public readonly snapping = signal(false);

  /**
   * Instance-owned reactive loaded state consumed by the associated view.
   *
   * @property loaded
   */
  public readonly loaded = signal<ReadonlySet<string>>(new Set());

  /**
   * Instance-owned reactive failed state consumed by the associated view.
   *
   * @property failed
   */
  public readonly failed = signal<ReadonlySet<string>>(new Set());

  /**
   * Derived position value recalculated when its signal dependencies change; it does not persist
   * data.
   *
   * @property position
   */
  public readonly position = computed(() => {
    const count = this.slides().length;

    if (count < 2) return 0;

    return Math.max(
      0,
      Math.min(
        this.offset() ?? Math.max(0, Math.min(this.initialIndex(), count - 1)) + 1,
        count + 1,
      ),
    );
  });

  /**
   * Derived active index value recalculated when its signal dependencies change; it does not persist
   * data.
   *
   * @property activeIndex
   */
  public readonly activeIndex = computed(() =>
    this.slides().length > 1
      ? (this.position() - 1 + this.slides().length) % this.slides().length
      : 0,
  );

  /**
   * Currently selected image metadata, or undefined for an empty gallery.
   *
   * @property active
   */
  public readonly active = computed(() => this.slides()[this.activeIndex()]);

  /**
   * Derived panels value recalculated when its signal dependencies change; it does not persist data.
   *
   * @property panels
   */
  public readonly panels = computed(() => {
    const slides = this.slides();
    const items = slides.map((slide) => ({ ...slide, key: 'slide-' + slide.id }));

    return slides.length > 1
      ? [
          { ...slides[slides.length - 1], key: 'clone-last' },
          ...items,
          { ...slides[0], key: 'clone-first' },
        ]
      : items;
  });

  /**
   * Creates the instance and wires its explicit dependencies.
   *
   * @remarks
   * Effects are registered in this constructor. Resource cleanup follows the owning Angular injection
   * scope.
   *
   * @function constructor
   */
  public constructor() {
    afterRenderEffect(() => {
      if (!this.browser) return;
      for (const image of this.images()) {
        const element = image.nativeElement;
        const id = element.getAttribute('data-slide-id');
        if (id && element.complete && !this.loaded().has(id) && !this.failed().has(id)) {
          if (element.naturalWidth > 0) this.imageLoaded(id);
          else this.imageFailed(id);
        }
      }
    });
    effect((cleanup) => {
      const count = this.slides().length;
      const current = this.activeIndex();
      const active = this.active();

      if (
        !this.ready() ||
        this.paused() ||
        this.hovered() ||
        this.hidden() ||
        this.interval() <= 0 ||
        count < 2 ||
        !active ||
        !this.loaded().has(active.id) ||
        this.failed().has(active.id)
      )
        return;
      const timer = setTimeout(() => this.move(current + 1), Math.max(3000, this.interval()));
      cleanup(() => clearTimeout(timer));
    });
  }

  /**
   * Runs component work that requires an already-created view.
   *
   * @function ngAfterViewInit
   *
   */
  public ngAfterViewInit(): void {
    if (!this.browser) return;
    const media = this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.paused.set(media?.matches ?? false);
    this.reducedMotion.set(media?.matches ?? false);

    /**
     * Pauses rotation and settles the track when the browser requests reduced motion.
     *
     * @function motionChanged
     */
    const motionChanged = (): void => {
      this.reducedMotion.set(media?.matches ?? false);

      if (media?.matches) {
        this.paused.set(true);
        this.settle();
      }
    };

    /**
     * Reflects tab visibility so background galleries cannot continue automatic rotation.
     *
     * @function visibilityChanged
     */
    const visibilityChanged = (): void => this.hidden.set(this.document.hidden);
    visibilityChanged();
    media?.addEventListener('change', motionChanged);
    this.document.addEventListener('visibilitychange', visibilityChanged);
    this.cleanupView = () => {
      media?.removeEventListener('change', motionChanged);
      this.document.removeEventListener('visibilitychange', visibilityChanged);
    };
    this.ready.set(true);
  }

  /**
   * Releases component-owned resources when Angular destroys the view.
   *
   * @remarks
   * Timers, observers, and listeners must not continue updating a view that is no longer active.
   *
   * @function ngOnDestroy
   *
   */
  public ngOnDestroy(): void {
    this.cleanupView?.();
    clearTimeout(this.snapTimer);
  }

  /**
   * Updates the selected value.
   *
   *
   * @function select
   * @param index - Requested zero-based image position.
   *
   */
  public select(index: number): void {
    this.paused.set(true);
    this.move(index);
  }

  /**
   * Moves through the circular track without changing consumer data.
   *
   *
   * @function move
   * @param index - Requested zero-based image position.
   */
  private move(index: number): void {
    const count = this.slides().length;

    if (count < 2) return;
    clearTimeout(this.snapTimer);
    this.snapping.set(false);
    const normalized = ((index % count) + count) % count;
    this.offset.set(
      this.reducedMotion() ? normalized + 1 : Math.max(0, Math.min(index + 1, count + 1)),
    );
    if (this.browser) this.snapTimer = setTimeout(() => this.settle(), 550);
  }

  /**
   * Resets a cloned edge panel to its equivalent real panel without a visible jump.
   *
   *
   * @function settle
   *
   */
  public settle(): void {
    const count = this.slides().length;

    if (count < 2 || (this.position() > 0 && this.position() <= count)) return;
    this.snapping.set(true);
    this.offset.set(this.activeIndex() + 1);
    clearTimeout(this.snapTimer);
    this.snapTimer = setTimeout(() => this.snapping.set(false), 32);
  }

  /**
   * Records a successful image load before permitting automatic rotation.
   *
   *
   * @function imageLoaded
   * @param id - String representation of the entity identifier; it does not create a second identity.
   *
   */
  public imageLoaded(id: string): void {
    this.loaded.update((items) => new Set([...items, id]));
  }

  /**
   * Records a failed image so an explicit retry action is shown.
   *
   *
   * @function imageFailed
   * @param id - String representation of the entity identifier; it does not create a second identity.
   *
   */
  public imageFailed(id: string): void {
    this.failed.update((items) => new Set([...items, id]));
  }

  /**
   * Retries the failed read after an explicit recovery action.
   *
   *
   * @function retry
   * @param id - String representation of the entity identifier; it does not create a second identity.
   *
   */
  public retry(id: string): void {
    this.loaded.update((items) => {
      const next = new Set(items);
      next.delete(id);

      return next;
    });
    this.failed.update((items) => {
      const next = new Set(items);
      next.delete(id);

      return next;
    });
  }

  /**
   * Suspends automatic rotation while the pointer is over the gallery.
   *
   *
   * @function hover
   * @param value - Value to validate or transform under this operation contract.
   *
   */
  public hover(value: boolean): void {
    this.hovered.set(value);
  }

  /**
   * Pauses rotation when focus enters any control other than the rotation toggle.
   *
   *
   * @function focusEntered
   * @param event - Native focus event from a carousel descendant.
   *
   */
  public focusEntered(event: FocusEvent): void {
    if (
      typeof HTMLElement === 'undefined' ||
      !(event.target instanceof HTMLElement) ||
      !event.target.closest('[data-rotation]')
    )
      this.pause();
  }

  /**
   * Pauses automatic rotation without altering the selected image.
   *
   *
   * @function pause
   *
   */
  public pause(): void {
    this.paused.set(true);
  }

  /**
   * Explicitly toggles automatic rotation after a user activation.
   *
   *
   * @function toggle
   *
   */
  public toggle(): void {
    this.paused.update((value) => !value);
  }
}
