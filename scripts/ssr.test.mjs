import '@angular/platform-server/init';
import '@angular/localize/init';
import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
  withNoHttpTransferCache,
} from '@angular/platform-browser';
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import {
  ImageSlider,
  Dialog,
  Sidebar,
  BackgroundVideo,
  SiteHeader,
  Reveal,
  Scrollbar,
  ScrollReveal,
} from '../dist/machetico-ui/fesm2022/machetico-ui.mjs';
import { Api } from '../dist/machetico-ui/fesm2022/machetico-ui-api.mjs';
const serverProviders = provideServerRendering();
class RenderingFixture {
  slides = [
    { id: 'first', src: '/synthetic-one.svg', alt: 'First synthetic image', caption: 'First' },
    { id: 'second', src: '/synthetic-two.svg', alt: 'Second synthetic image', caption: 'Second' },
  ];
}
Component({
  selector: 'rendering-fixture',
  providers: [ScrollReveal],
  imports: [ImageSlider, Dialog, Sidebar, BackgroundVideo, SiteHeader, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: readFileSync(new URL('../tests/fixtures/ssr-controls.html', import.meta.url), 'utf8'),
})(RenderingFixture);
const render = (verify) =>
  renderApplication(
    async (context) => {
      const app = await bootstrapApplication(
        RenderingFixture,
        {
          providers: [
            serverProviders,
            provideClientHydration(withI18nSupport(), withNoHttpTransferCache()),
          ],
        },
        context,
      );
      if (verify) await verify(app);
      return app;
    },
    {
      document:
        '<!doctype html><html><head></head><body><rendering-fixture></rendering-fixture></body></html>',
      url: 'http://localhost/rendering',
      allowedHosts: ['localhost'],
    },
  );

test(
  'SSR with an autoplay gallery and open panels completes without browser work',
  { timeout: 4000 },
  async () => {
    assert.equal(typeof window, 'undefined');
    const html = await render();
    assert.match(html, /First synthetic image/);
    assert.match(html, /data-reveal="visible"/);
    assert.match(html, /src="\/synthetic-poster.svg"/);
    assert.doesNotMatch(html, /<video[^>]*\ssrc=/);
    assert.match(html, /Server navigation link/);
    assert.match(html, /data-ssr-dialog/);
    assert.match(html, /machetico-dialog-title-0/);
    assert.match(html, /machetico-dialog-title-2/);
    assert.doesNotMatch(html.match(/<body[^>]*>/)?.[0] ?? '', /overflow:\s*hidden/);
    assert.doesNotMatch(html, /position:\s*fixed/);
  },
);

test(
  'parallel SSR injectors restart accessible identifiers without sharing application state',
  { timeout: 5000 },
  async () => {
    const results = await Promise.all([render(), render()]);
    for (const html of results) {
      assert.match(html, /machetico-dialog-title-0/);
      assert.match(html, /machetico-dialog-title-2/);
      assert.doesNotMatch(html, /machetico-dialog-title-3/);
      assert.match(html, /site-navigation-1/);
    }
  },
);

test(
  'SSR refuses explicit commands before creating an HTTP request',
  { timeout: 4000 },
  async () => {
    await render(async (app) => {
      await assert.rejects(
        app.injector.get(Api).request('/synthetic', 'POST', {}, (value) => value),
        /Commands cannot execute during server rendering/,
      );
    });
  },
);

test('shared scroll services preserve server markup and complete without browser APIs', async () => {
  await render((app) => {
    const document = app.injector.get(DOCUMENT);
    const root = document.documentElement;
    const previous = root.getAttribute('data-machetico-scrollbar');
    const release = app.injector.get(Scrollbar).acquire(root);
    assert.equal(root.getAttribute('data-machetico-scrollbar'), previous);
    release();
    release();
    const reveal = app.components[0].injector.get(ScrollReveal);
    const target = document.createElement('article');
    let observed = 0;
    let completed = 0;
    const cancel = reveal.observe(target, () => observed++);
    cancel();
    assert.equal(observed, 1);
    reveal.enter({ target, animationComplete: () => completed++ });
    assert.equal(completed, 1);
    assert.equal(target.getAttribute('data-reveal'), null);
  });
});
