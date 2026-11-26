import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Scrollbar, ScrollReveal } from '../dist/machetico-ui/fesm2022/machetico-ui.mjs';

afterEach(() => vi.unstubAllGlobals());

describe('packaged shared scroll ownership', () => {
  it('restores scrollbar markers only after the last idempotent release and on injector destruction', () => {
    const service = TestBed.inject(Scrollbar);
    const target = document.createElement('div');
    target.setAttribute('data-machetico-scrollbar', 'original');
    const first = service.acquire(target);
    const second = service.acquire(target);
    expect(target.getAttribute('data-machetico-scrollbar')).toBe('');
    first();
    first();
    expect(target.getAttribute('data-machetico-scrollbar')).toBe('');
    second();
    expect(target.getAttribute('data-machetico-scrollbar')).toBe('original');
    const fresh = document.createElement('div');
    service.acquire(fresh);
    TestBed.resetTestingModule();
    expect(fresh.hasAttribute('data-machetico-scrollbar')).toBe(false);
    expect(target.style.cssText).toBe('');
  });
  it('does not hide content or animate when intersection observation is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    TestBed.configureTestingModule({ providers: [ScrollReveal] });
    const service = TestBed.inject(ScrollReveal);
    const element = document.createElement('article');
    element.setAttribute('data-reveal', 'pending');
    const reveal = vi.fn();
    const release = service.observe(element, reveal);
    release();
    release();
    expect(reveal).toHaveBeenCalledOnce();
    expect(element.getAttribute('data-reveal')).toBe('visible');
    element.animate = vi.fn();
    const complete = vi.fn();
    service.enter({ target: element, animationComplete: complete }, 0, {
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
    });
    expect(complete).toHaveBeenCalledOnce();
    expect(element.animate).not.toHaveBeenCalled();
  });
  it('reuses one scoped observer, cancels without callback and reveals focused content', () => {
    let intersection;
    const unobserve = vi.fn(),
      disconnect = vi.fn(),
      observe = vi.fn();
    const Observer = vi.fn(function (callback) {
      intersection = callback;
      this.observe = observe;
      this.unobserve = unobserve;
      this.disconnect = disconnect;
    });
    vi.stubGlobal('IntersectionObserver', Observer);
    TestBed.configureTestingModule({ providers: [ScrollReveal] });
    const service = TestBed.inject(ScrollReveal);
    const first = document.createElement('article'),
      second = document.createElement('article'),
      third = document.createElement('article');
    const shown = vi.fn(),
      cancelled = vi.fn(),
      focused = vi.fn();
    service.observe(first, shown);
    const release = service.observe(second, cancelled);
    service.observe(third, focused);
    expect(Observer).toHaveBeenCalledOnce();
    expect(first.getAttribute('data-reveal')).toBe('pending');
    release();
    release();
    expect(cancelled).not.toHaveBeenCalled();
    expect(second.getAttribute('data-reveal')).toBe('visible');
    intersection([{ target: first, isIntersecting: true }]);
    intersection([{ target: first, isIntersecting: true }]);
    expect(shown).toHaveBeenCalledOnce();
    third.dispatchEvent(new Event('focusin'));
    expect(focused).toHaveBeenCalledOnce();
    service.observe(second, cancelled);
    TestBed.resetTestingModule();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(cancelled).not.toHaveBeenCalled();
    expect(second.getAttribute('data-reveal')).toBe('visible');
  });
  it('finishes entering and leaving callbacks exactly once when a view leaves during animation', async () => {
    let intersection;
    const unobserve = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback) {
          intersection = callback;
        }
        observe() {}
        unobserve = unobserve;
        disconnect() {}
      },
    );
    TestBed.configureTestingModule({ providers: [ScrollReveal] });
    const service = TestBed.inject(ScrollReveal);
    const target = document.createElement('article');
    let resolveAnimation;
    const finished = new Promise((resolve) => (resolveAnimation = resolve));
    const cancel = vi.fn();
    target.animate = vi.fn(() => ({ finished, cancel }));
    const enter = vi.fn(),
      leave = vi.fn();
    service.enter({ target, animationComplete: enter }, 2, {
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
    });
    intersection([{ target, isIntersecting: true }]);
    expect(target.animate).toHaveBeenCalledOnce();
    service.leave({ target, animationComplete: leave });
    expect(enter).toHaveBeenCalledOnce();
    expect(leave).toHaveBeenCalledOnce();
    expect(cancel).toHaveBeenCalledOnce();
    resolveAnimation();
    await finished;
    await Promise.resolve();
    expect(enter).toHaveBeenCalledOnce();
    expect(target.getAttribute('data-reveal')).toBe('visible');
  });
});
