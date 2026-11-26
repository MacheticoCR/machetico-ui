import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import {
  Button,
  Slider,
  Table,
  Input,
  Select,
  ImageSlider,
  Alert,
} from '../dist/machetico-ui/fesm2022/machetico-ui.mjs';
const render = (type, inputs = {}) => {
  const f = TestBed.createComponent(type);
  for (const [key, value] of Object.entries(inputs)) f.componentRef.setInput(key, value);
  f.detectChanges();
  return f;
};
describe('headless packaged interactions', () => {
  it('retains consumer classes and disables native action while busy', () => {
    class Host {}
    Component({
      imports: [Button],
      template: '<button macheticoButton class="brand-action" [busy]="true">Guardar</button>',
    })(Host);
    const f = render(Host);
    const b = f.nativeElement.querySelector('button');
    expect(b.disabled).toBe(true);
    expect(b.getAttribute('aria-busy')).toBe('true');
    expect(b.className).toBe('brand-action');
  });
  it('emits native range changes once without exposing styling', () => {
    const f = render(Slider, { label: 'Volumen' });
    const values = [];
    f.componentInstance.value.subscribe((v) => values.push(v));
    const input = f.nativeElement.querySelector('input');
    input.value = '42';
    input.dispatchEvent(new Event('input'));
    expect(values).toEqual([42]);
    expect(input.className).toBe('');
  });
  it('keeps model writes separate from user edits and preserves numeric values', () => {
    const f = render(Input, { label: 'Cantidad', type: 'number' });
    const edits = [];
    const control = f.componentInstance;
    control.registerOnChange((v) => edits.push(v));
    control.writeValue(3);
    f.detectChanges();
    expect(edits).toEqual([]);
    const input = f.nativeElement.querySelector('input');
    input.value = '7';
    input.dispatchEvent(new Event('input'));
    expect(edits).toEqual([7]);
    control.setDisabledState(true);
    f.detectChanges();
    expect(input.disabled).toBe(true);
  });
  it('emits immutable sorting intent and shows recoverable failures', () => {
    const f = render(Table, {
      caption: 'Ejemplos',
      rows: [{ id: 1, name: 'A' }],
      columns: [{ key: 'name', label: 'Nombre', sortable: true, value: (r) => r.name }],
      rowKey: (r) => r.id,
    });
    const intents = [];
    f.componentInstance.sortChanged.subscribe((v) => intents.push(v));
    f.nativeElement.querySelector('th button').click();
    expect(intents).toEqual([{ key: 'name', direction: 'asc' }]);
    expect(f.nativeElement.querySelector('td').textContent).toContain('A');
    f.componentRef.setInput('error', 'No disponible');
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role=alert]').textContent).toBe('No disponible');
  });
  it('keeps disabled ARIA selection unchanged', () => {
    const f = render(Select, {
      label: 'Elegir',
      options: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ],
      value: 'a',
      disabled: true,
    });
    f.componentInstance.select(['b']);
    expect(f.componentInstance.value()).toBe('a');
  });
  it('wraps gallery selection and pauses after manual navigation', () => {
    const f = render(ImageSlider, {
      slides: [
        { id: 'a', src: 'a.svg', alt: 'A', caption: 'A' },
        { id: 'b', src: 'b.svg', alt: 'B', caption: 'B' },
      ],
    });
    f.componentInstance.select(-1);
    f.detectChanges();
    expect(f.componentInstance.activeIndex()).toBe(1);
    expect(f.componentInstance.paused()).toBe(true);
    expect(f.nativeElement.querySelector('img').alt).toBe('B');
  });
  it('announces errors assertively and informational messages politely', () => {
    const f = render(Alert, { variant: 'error' });
    expect(f.nativeElement.getAttribute('role')).toBe('alert');
    f.componentRef.setInput('variant', 'info');
    f.detectChanges();
    expect(f.nativeElement.getAttribute('role')).toBe('status');
  });
});
