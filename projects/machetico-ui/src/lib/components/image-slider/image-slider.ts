import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';

/**
 * Headless carousel with bounded selection, pause on focus/hover and reduced-motion support.
 * @class ImageSlider
 */
@Component({
  selector: 'machetico-image-slider',
  templateUrl: './image-slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSlider implements OnInit, OnDestroy {
  /**
   * Immutable images supplied by the consumer.
   * @property slides
   */
  public readonly slides = input.required<readonly import('../../interfaces').ImageSlide[]>();

  /**
   * Accessible carousel title supplied by the consumer.
   * @property label
   */
  public readonly label = input('Galería de imágenes');

  /**
   * Minimum automatic rotation delay in milliseconds; zero disables rotation.
   * @property interval
   */
  public readonly interval = input(0);

  /**
   * Explicit user pause state.
   * @property paused
   */
  public readonly paused = signal(false);

  /**
   * Current selected image index, normalized when images change.
   * @property selected
   */
  private readonly selected = signal(0);

  /**
   * Hover state suspends automatic movement.
   * @property hovered
   */
  public readonly hovered = signal(false);

  /**
   * Angular-owned document used for page visibility and motion preferences.
   * @property document
   */
  private readonly document = inject(DOCUMENT);

  /**
   * Application-visible normalized image position.
   * @property activeIndex
   */
  public readonly activeIndex = computed(() =>
    Math.max(0, Math.min(this.selected(), this.slides().length - 1)),
  );

  /**
   * Active image, absent for an empty gallery.
   * @property active
   */
  public readonly active = computed(() => this.slides()[this.activeIndex()]);

  /**
   * Failed image identifiers; retry removes the corresponding failure.
   * @property failed
   */
  public readonly failed = signal<ReadonlySet<string>>(new Set());

  /**
   * Current document visibility, tracked through a document-owned listener.
   * @property hidden
   */
  private readonly hidden = signal(false);

  /**
   * Registers automatic rotation and cleans up document listeners with Angular ownership.
   * @function constructor
   */
  public constructor() {
    effect((cleanup) => {
      if (
        this.interval() <= 0 ||
        this.paused() ||
        this.hovered() ||
        this.hidden() ||
        this.slides().length < 2 ||
        this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      )
        return;
      const next = (this.activeIndex() + 1) % this.slides().length;
      const timer = setTimeout(() => this.selected.set(next), Math.max(3000, this.interval()));
      cleanup(() => clearTimeout(timer));
    });
  }

  /**
   * Records document visibility for rotation decisions.
   * @property visibilityChanged
   */
  private readonly visibilityChanged = (): void => this.hidden.set(this.document.hidden);

  /**
   * Starts view-related visibility tracking after Angular initializes inputs.
   * @function ngOnInit
   */
  public ngOnInit(): void {
    this.visibilityChanged();
    this.document.addEventListener('visibilitychange', this.visibilityChanged);
  }

  /**
   * Releases this component's visibility listener.
   * @function ngOnDestroy
   */
  public ngOnDestroy(): void {
    this.document.removeEventListener('visibilitychange', this.visibilityChanged);
  }

  /**
   * Selects a wrapped image index and pauses automatic rotation after user navigation.
   * @function select
   * @param index - Requested image position.
   */
  public select(index: number): void {
    const count = this.slides().length;
    if (!count) return;
    this.paused.set(true);
    this.selected.set(((index % count) + count) % count);
  }

  /**
   * Marks an image as unavailable so the retry action becomes visible.
   * @function imageFailed
   * @param id - Consumer-provided image identity.
   */
  public imageFailed(id: string): void {
    this.failed.update((items) => new Set([...items, id]));
  }

  /**
   * Recreates a failed image element to retry its browser load.
   * @function retry
   * @param id - Failed image identity.
   */
  public retry(id: string): void {
    this.failed.update((items) => new Set([...items].filter((item) => item !== id)));
  }
}
