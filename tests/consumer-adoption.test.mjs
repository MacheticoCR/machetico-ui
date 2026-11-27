import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import {
  Button,
  Dialog,
  NativeField,
  NativeTable,
  SearchSelect,
  ViewIds,
} from '../dist/machetico-ui/fesm2022/machetico-ui.mjs';
import { Button as NarrowButton } from '../dist/machetico-ui/fesm2022/machetico-ui-button.mjs';
import { ViewIds as NarrowViewIds } from '../dist/machetico-ui/fesm2022/machetico-ui-core.mjs';

describe('packaged consumer adoption contracts', () => {
  it('retains identical component and injector identities through aggregate and narrow exports', () => {
    expect(Button).toBe(NarrowButton);
    expect(ViewIds).toBe(NarrowViewIds);
    expect(TestBed.inject(ViewIds)).toBe(TestBed.inject(NarrowViewIds));
  });
  it('searches locally without committing a value and respects disabled selection', () => {
    const fixture = TestBed.createComponent(SearchSelect);
    fixture.componentRef.setInput('label', 'Country');
    fixture.componentRef.setInput('options', [
      { value: 'cr', label: 'CR (+506)' },
      { value: 'us', label: 'US (+1)' },
    ]);
    fixture.componentRef.setInput('value', 'cr');
    fixture.detectChanges();
    const changes = [];
    fixture.componentInstance.value.subscribe((value) => changes.push(value));
    fixture.componentInstance.focus();
    fixture.componentInstance.query.set('us');
    expect(fixture.componentInstance.filteredOptions()).toEqual([
      { value: 'us', label: 'US (+1)' },
    ]);
    expect(fixture.componentInstance.value()).toBe('cr');
    fixture.componentInstance.select(['us']);
    expect(fixture.componentInstance.query()).toBe('US (+1)');
    expect(changes).toEqual(['us']);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    fixture.componentInstance.select(['cr']);
    expect(fixture.componentInstance.value()).toBe('us');
    expect(changes).toEqual(['us']);
  });
  it('preserves Angular native validators and marks aria-invalid only after touching', async () => {
    class Host {
      value = '';
    }
    Component({
      imports: [FormsModule, NativeField],
      template:
        '<label>Email<input macheticoField type="email" email required [(ngModel)]="value" /></label>',
    })(Host);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'invalid';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    input.value = 'synthetic@example.test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(fixture.componentInstance.value).toBe('synthetic@example.test');
  });
  it('emits native-table sorting once per activation and blocks it while loading', () => {
    class Host {
      loading = signal(false);
      sort = signal(null);
    }
    Component({
      imports: [NativeTable],
      template:
        '<table macheticoTable #table="macheticoTable" [tableLoading]="loading()" [tableSort]="sort()" (tableSortChanged)="sort.set($event)"><tbody><tr><td><button (click)="table.requestSort(\'name\')">Sort</button></td></tr></tbody></table>',
    })(Host);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(fixture.componentInstance.sort()).toEqual({ key: 'name', direction: 'asc' });
    fixture.detectChanges();
    button.click();
    expect(fixture.componentInstance.sort()).toEqual({ key: 'name', direction: 'desc' });
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    button.click();
    expect(fixture.componentInstance.sort()).toEqual({ key: 'name', direction: 'desc' });
  });
});
