import { test, expect } from '@playwright/test';
import { componentCatalog, directiveCatalog } from '../demo/catalog.generated.js';
import { serviceCatalog } from '../demo/service-catalog.js';
import { DEMO_DESIGNS } from '../demo/appearance.js';

for (const mode of ['ssr', 'csr']) {
  test(`${mode}: all component examples are interactive and navigation remains SPA`, async ({
    page,
  }) => {
    const errors = [];
    const documentRequests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('request', (request) => {
      if (request.resourceType() === 'document') documentRequests.push(request.url());
    });
    await page.addInitScript(() => {
      window.__spaToken = 'same-document';
      const observer = new MutationObserver(() => {
        const heading = document.querySelector('docs-components > machetico-page-heading h1');
        if (heading) {
          window.__initialHeading = heading;
          observer.disconnect();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    });
    await page.goto(`/components${mode === 'csr' ? '?render=csr' : ''}`);
    await expect(page.locator('html')).toHaveAttribute('data-bootstrapped', 'true');
    await expect(page.locator('[data-example]')).toHaveCount(0);
    await expect(page.locator('.catalogue-grid a')).toHaveCount(componentCatalog.length);
    if (mode === 'ssr')
      expect(
        await page.evaluate(
          () =>
            window.__initialHeading ===
            document.querySelector('docs-components > machetico-page-heading h1'),
        ),
      ).toBe(true);
    await page.locator('.docs-index').getByRole('link', { name: 'Slider', exact: true }).click();
    await expect(page).toHaveURL(/\/components\/slider$/);
    await expect(page.locator('[data-example]')).toHaveCount(1);
    const range = page.locator('[data-example=slider] input').first();
    await range.focus();
    await range.press('ArrowRight');
    await expect(range).toHaveValue('31');
    await page.locator('.docs-index').getByRole('link', { name: 'Select', exact: true }).click();
    const combo = page.locator('[data-example=select]').getByRole('combobox');
    await combo.focus();
    await combo.press('ArrowDown');
    await page.getByRole('option', { name: 'Segunda opción', exact: true }).click();
    await expect(combo).toContainText('Segunda opción');
    await combo.press('ArrowDown');
    await combo.press('Escape');
    await expect(combo).toBeFocused();
    await page.locator('.docs-index').getByRole('link', { name: 'Dialog', exact: true }).click();
    const opener = page.locator('#open-dialog');
    await opener.click();
    const modal = page.getByRole('dialog', { name: 'Confirmación' });
    await expect(modal).toBeVisible();
    await modal.getByLabel('Simular acción pendiente').check();
    await expect(modal.getByRole('button', { name: 'Cerrar', exact: true })).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(modal).toBeVisible();
    await modal.getByLabel('Simular acción pendiente').uncheck();
    await expect(modal.getByRole('button', { name: 'Cerrar', exact: true })).toBeEnabled();
    await page.keyboard.press('Escape');
    await expect(modal).toHaveCount(0);
    await expect(opener).toBeFocused();
    await page.locator('.docs-index').getByRole('link', { name: 'Sidebar', exact: true }).click();
    const sidebar = page.locator('#open-sidebar');
    await sidebar.click();
    await expect(page.getByRole('dialog', { name: 'Navegación', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(sidebar).toBeFocused();
    await page
      .locator('.docs-index')
      .getByRole('link', { name: 'ImageSlider', exact: true })
      .click();
    const gallery = page.locator('[data-example=image-slider]');
    await gallery.getByRole('button', { name: 'Imagen siguiente' }).click();
    await expect(gallery.locator('[data-active=true] img[alt="Ejemplo verde"]')).toBeVisible();
    await page.locator('.docs-index').getByRole('link', { name: 'Table', exact: true }).click();
    const table = page.locator('[data-example=table]');
    await table.getByRole('button', { name: 'Nombre', exact: true }).click();
    await expect(table.getByRole('columnheader', { name: 'Nombre' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await table.getByRole('option', { name: 'Error', exact: true }).click();
    await expect(table.getByRole('alert')).toContainText('Error sintético');
    await table.getByRole('button', { name: 'Reintentar' }).click();
    await expect(table.getByRole('cell', { name: 'Ejemplo A', exact: true })).toBeVisible();
    await page.locator('.category-link').filter({ hasText: 'Servicios' }).click();
    await page
      .locator('.docs-index')
      .getByRole('link', { name: 'Ver servicios', exact: true })
      .click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(
      page.locator('main').getByRole('heading', { name: 'Servicios', exact: true }),
    ).toBeVisible();
    await page.locator('.docs-index').getByRole('link', { name: 'Api', exact: true }).click();
    await expect(page).toHaveURL(/\/services\/api$/);
    await page.getByText('Comandos explícitos sin reintentos automáticos', { exact: true }).click();
    await expect(page.getByLabel('Comando API', { exact: true })).toContainText('this.api.request');
    await page.locator('.category-link').filter({ hasText: 'Directivas' }).click();
    await page
      .locator('.docs-index')
      .getByRole('link', { name: 'Ver directivas', exact: true })
      .click();
    await expect(page).toHaveURL(/\/directives$/);
    await expect(page.locator('[data-example]')).toHaveCount(0);
    await expect(page.locator('.catalogue-grid a')).toHaveCount(directiveCatalog.length);
    await page.locator('.docs-index').getByRole('link', { name: 'Button', exact: true }).click();
    await expect(page.locator('[data-example]')).toHaveCount(1);
    const button = page.getByRole('button', { name: 'Acción 0', exact: true });
    await button.click();
    await page.getByLabel('Simular pendiente').check();
    await expect(page.getByRole('button', { name: 'Acción 1', exact: true })).toBeDisabled();
    expect(await page.evaluate(() => window.__spaToken)).toBe('same-document');
    expect(documentRequests).toHaveLength(1);
    expect(errors).toEqual([]);
  });
}

test('SSR delivers every component without browser JavaScript and isolates repeated requests', async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/components');
  await expect(
    page.locator('main').getByRole('heading', { name: 'Componentes', exact: true }),
  ).toBeVisible();
  await expect(page.locator('[data-example]')).toHaveCount(0);
  for (const [category, entries] of [
    ['components', componentCatalog],
    ['directives', directiveCatalog],
  ]) {
    for (const entry of entries) {
      await page.goto('/' + category + '/' + entry.id);
      await expect(page.locator('[data-example]')).toHaveCount(1);
      await expect(page.locator('[data-example]')).toHaveAttribute('data-example', entry.id);
      await expect(page.locator('main h1').first()).toHaveText(entry.name);
    }
  }
  await page.goto('/components/input');
  await expect(page.locator('[data-example=input] input')).toHaveValue('Alex Ejemplo');
  for (const route of ['services', 'directives']) {
    await page.goto('/' + route);
    await expect(
      page.locator('main').getByRole('heading', {
        name: route === 'services' ? 'Servicios' : 'Directivas',
        exact: true,
      }),
    ).toBeVisible();
  }
  const responses = await Promise.all([request.get('/components'), request.get('/components')]);
  for (const response of responses) {
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('ngh=');
  }
  await context.close();
});

test('mobile documentation uses the library sidebar and retains horizontal overflow locally', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/components');
  await page.getByRole('button', { name: 'Menú', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Documentación', exact: true });
  await drawer.getByRole('button', { name: 'Directivas', exact: true }).click();
  await drawer.getByRole('link', { name: 'Ver directivas', exact: true }).click();
  await expect(
    page.locator('main').getByRole('heading', { name: 'Directivas', exact: true }),
  ).toBeVisible();
  await expect(drawer).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: 'test-results/documentation-mobile.png', fullPage: true });
});

test('mobile submenus close other groups and select an individual service', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/components/select');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  await page.getByRole('button', { name: 'Menú', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Documentación', exact: true });
  await expect(drawer.getByRole('button', { name: 'Componentes', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await drawer.getByRole('button', { name: 'Servicios', exact: true }).click();
  await expect(drawer.getByRole('button', { name: 'Componentes', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await drawer.getByRole('link', { name: 'Scrollbar', exact: true }).click();
  await expect(page).toHaveURL(/\/services\/scrollbar$/);
  await expect(drawer).toHaveCount(0);
  await page.getByRole('button', { name: 'Menú', exact: true }).click();
  await expect(drawer.getByRole('button', { name: 'Servicios', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(drawer.locator('button[aria-expanded=true]')).toHaveCount(1);
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('a dialog rendered open on the server becomes a native modal after hydration', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('/components/dialog?dialog=open');
  expect(await response.text()).toContain('data-ssr-dialog');
  await expect(page.locator('html')).toHaveAttribute('data-bootstrapped', 'true');
  const modal = page.getByRole('dialog', { name: 'Confirmación' });
  await expect(modal).toBeVisible();
  await expect(modal).not.toHaveAttribute('data-ssr-dialog');
  await expect(page.locator('dialog:modal')).toHaveCount(1);
  await modal.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(modal).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('select overlays content without shifting layout and closes on outside pointer', async ({
  page,
}) => {
  await page.goto('/components/select');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  const example = page.locator('[data-example=select]');
  await example.scrollIntoViewIfNeeded();
  const value = example.locator('p').last();
  const before = await value.boundingBox();
  const trigger = example.getByRole('combobox');
  await trigger.click();
  const option = page.getByRole('option', { name: 'Segunda opción', exact: true });
  await expect(option).toBeVisible();
  const after = await value.boundingBox();
  expect(Math.abs(before.y - after.y)).toBeLessThan(1);
  const popup = page.getByRole('listbox', { name: 'Seleccionar opción', exact: true });
  await expect(popup).toHaveCSS('position', 'fixed');
  await expect(popup).toHaveAttribute('popover', 'manual');
  await option.click();
  await expect(trigger).toContainText('Segunda opción');
  await trigger.click();
  await expect(popup).toBeVisible();
  await page.locator('docs-components > machetico-page-heading').click();
  await expect(popup).toHaveCount(0);
});

test('documentation examples use formatted multiline Angular markup', async ({ page }) => {
  await page.goto('/components/icon');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  await page.locator('#icon').getByText('Código de Icon', { exact: true }).click();
  const code = await page.getByLabel('Código de Icon', { exact: true }).textContent();
  expect(code.split('\n').length).toBeGreaterThan(5);
  expect(code).toContain('@for');
  expect(code).toMatch(/\n\s+<figure>/);
});

test('direct routes document one control and SPA changes do not retain previous examples', async ({
  page,
}) => {
  await page.goto('/components/slider');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  await expect(page.locator('[data-example]')).toHaveCount(1);
  await expect(
    page.locator('main').getByRole('heading', { name: 'Cuándo y cómo usarlo', exact: true }),
  ).toBeVisible();
  await page.locator('.docs-index').getByRole('link', { name: 'Select', exact: true }).click();
  await expect(page.locator('[data-example]')).toHaveCount(1);
  await expect(page.locator('[data-example=slider]')).toHaveCount(0);
  await page.goBack();
  await expect(page.locator('[data-example=slider]')).toBeVisible();
  await page.goto('/components/unknown');
  await expect(
    page.getByText('Este componente no existe en el catálogo.', { exact: true }),
  ).toBeVisible();
});

test('circular Taurus gallery wraps both ways, pauses and reserves its portrait frame', async ({
  page,
}) => {
  await page.goto('/components/image-slider');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  const gallery = page.locator('[data-example=image-slider]');
  const active = gallery.locator('[data-active=true]');
  await expect(active.locator('img')).toHaveAttribute('alt', 'Ejemplo azul');
  await gallery.getByRole('button', { name: 'Imagen anterior', exact: true }).click();
  await expect(active.locator('img')).toHaveAttribute('alt', 'Ejemplo violeta');
  await expect(
    gallery.getByRole('button', { name: 'Reanudar imágenes', exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(600);
  await gallery.getByRole('button', { name: 'Imagen siguiente', exact: true }).click();
  await expect(active.locator('img')).toHaveAttribute('alt', 'Ejemplo azul');
  const frame = await gallery.locator('[data-part=viewport]').boundingBox();
  expect(frame.height / frame.width).toBeCloseTo(1.25, 1);
});

test('home attributes free use to MacheTico and serves the actual MIT terms', async ({
  page,
  request,
}) => {
  const response = await page.goto('/');
  expect(await response.text()).toContain('De libre uso, desarrollada por MacheTico.');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  await expect(
    page.locator('main').getByRole('heading', { name: 'Machetico UI', exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator('main')
      .getByRole('heading', { name: 'Quién está detrás: MacheTico', exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/Cada negocio activa y combina los módulos/)).toBeVisible();
  const license = await request.get('/license');
  expect(license.ok()).toBe(true);
  expect(await license.text()).toContain('Copyright (c) 2026 MacheTico');
  expect(await license.text()).toContain('Permission is hereby granted, free of charge');
  await page.getByRole('link', { name: 'Explorar componentes', exact: true }).click();
  await expect(page).toHaveURL(/\/components$/);
  await expect(page.locator('[data-example]')).toHaveCount(0);
  await page.screenshot({ path: 'test-results/component-catalogue.png', fullPage: true });
});

test('landing primitives retain native interaction and reduced-motion video keeps its poster', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/components/background-video');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  const video = page.locator('[data-example] video');
  await expect(video).not.toHaveAttribute('src');
  await expect(page.locator('[data-example] img')).toBeVisible();
  await page.locator('.docs-index').getByRole('link', { name: 'Consent', exact: true }).click();
  const checkbox = page.locator('[data-example] input');
  await expect(checkbox).not.toBeChecked();
  await checkbox.focus();
  await checkbox.press('Space');
  await expect(checkbox).toBeChecked();
  await page.locator('.docs-index').getByRole('link', { name: 'Stepper', exact: true }).click();
  const first = page.getByRole('tab', { name: '1. Configurar', exact: true });
  await first.focus();
  await first.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('tab', { name: '2. Personalizar', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.locator('.docs-index').getByRole('link', { name: 'SiteHeader', exact: true }).click();
  const example = page.locator('[data-example]');
  await expect(example.getByRole('navigation')).toBeHidden();
  await example.getByRole('button', { name: 'Mostrar navegación', exact: true }).click();
  await expect(example.getByRole('navigation')).toBeVisible();
});

for (const mode of ['ssr', 'csr']) {
  test(`${mode}: every individual example bootstraps without browser errors`, async ({ page }) => {
    test.setTimeout(90000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const [category, entries] of [
      ['components', componentCatalog],
      ['directives', directiveCatalog],
    ]) {
      for (const entry of entries) {
        await page.goto('/' + category + '/' + entry.id + (mode === 'csr' ? '?render=csr' : ''));
        await page.locator('html[data-bootstrapped="true"]').waitFor();
        await expect(page.locator('[data-example]')).toHaveCount(1);
        await expect(page.locator('[data-example]')).toHaveAttribute('data-example', entry.id);
        await expect(page).toHaveTitle(entry.name + ' | Machetico UI');
      }
    }
    expect(errors).toEqual([]);
  });
}

test('decorative local video plays only while the view is visible', async ({ page }) => {
  await page.goto('/components/background-video');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  const media = page.locator('[data-example] video');
  await media.scrollIntoViewIfNeeded();
  await expect(media).toHaveAttribute('src', '/samples/background.webm');
  await expect(page.locator('[data-example] [data-playing]')).toHaveAttribute(
    'data-playing',
    'true',
  );
  await page.locator('.docs-index').getByRole('link', { name: 'Input', exact: true }).click();
  await expect(page.locator('video')).toHaveCount(0);
});

for (const mode of ['ssr', 'csr']) {
  test(`${mode}: category submenus follow routes, manual disclosure and history`, async ({
    page,
  }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/components/select' + (mode === 'csr' ? '?render=csr' : ''));
    await page.locator('html[data-bootstrapped="true"]').waitFor();
    const nav = page.locator('.docs-sidebar');
    await expect(nav.getByRole('button', { name: 'Componentes', exact: true })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(nav.getByRole('button', { name: 'Servicios', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(nav.getByRole('button', { name: 'Directivas', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(nav.getByRole('link', { name: 'Select', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await nav.getByRole('button', { name: 'Servicios', exact: true }).click();
    await expect(nav.getByRole('button', { name: 'Componentes', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await nav.getByRole('link', { name: 'Scrollbar', exact: true }).click();
    await expect(page).toHaveURL(/\/services\/scrollbar$/);
    await expect(nav.getByRole('button', { name: 'Servicios', exact: true })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(page.locator('[data-service-example]')).toHaveCount(1);
    await page.goBack();
    await expect(page).toHaveURL(/\/components\/select/);
    await expect(nav.getByRole('button', { name: 'Componentes', exact: true })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(nav.getByRole('button', { name: 'Servicios', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    const directives = nav.getByRole('button', { name: 'Directivas', exact: true });
    await directives.focus();
    await directives.press('Space');
    await expect(directives).toHaveAttribute('aria-expanded', 'true');
    await nav.getByRole('link', { name: 'Button', exact: true }).click();
    await expect(page).toHaveURL(/\/directives\/button$/);
    await expect(nav.locator('button[aria-expanded=true]')).toHaveCount(1);
    await expect(nav.getByRole('button', { name: 'Componentes', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(errors).toEqual([]);
  });
}

test('each service has its own SSR deep link and responsibility documentation', async ({
  page,
  request,
}) => {
  for (const service of serviceCatalog) {
    const response = await request.get('/services/' + service.id);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain(service.name);
    expect(html).toContain('ngh=');
    await page.goto('/services/' + service.id);
    await page.locator('html[data-bootstrapped="true"]').waitFor();
    await expect(page).toHaveTitle(service.name + ' | Machetico UI');
    await expect(page.locator('main h1')).toHaveText(service.name);
    const nav = page.locator('.docs-sidebar');
    await expect(nav.locator('button[aria-expanded=true]')).toHaveCount(1);
    await expect(nav.getByRole('button', { name: 'Servicios', exact: true })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  }
  await page.goto('/services/unknown');
  await expect(
    page.getByText('Este servicio no existe en el catálogo.', { exact: true }),
  ).toBeVisible();
});

test('shared scrollbar styling is reversible and keeps native keyboard scrolling', async ({
  page,
}) => {
  await page.goto('/services/scrollbar');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  const area = page.getByRole('region', { name: 'Registros sintéticos con scroll', exact: true });
  await expect(area).toHaveAttribute('data-machetico-scrollbar', '');
  await expect(area).toHaveCSS('scrollbar-width', 'thin');
  await area.focus();
  await area.press('PageDown');
  await expect.poll(() => area.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Restaurar barra original', exact: true }).click();
  await expect(area).not.toHaveAttribute('data-machetico-scrollbar');
  await expect(area).toHaveCSS('scrollbar-width', 'auto');
  await page.getByRole('button', { name: 'Aplicar estilo de barra', exact: true }).click();
  await expect(area).toHaveAttribute('data-machetico-scrollbar', '');
});

test('scoped scroll reveal completes native animation callbacks and respects reduced motion', async ({
  page,
}) => {
  await page.goto('/services/scroll-reveal');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  await page.getByRole('button', { name: 'Repetir entrada de tarjetas', exact: true }).click();
  const demo = page.locator('[data-service-example=scroll-reveal]');
  await expect(demo.locator('article')).toHaveCount(3);
  await expect(demo.getByRole('status')).toContainText('Entrada completada: sí');
  await expect(demo.locator('[data-reveal=pending]')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Repetir entrada de tarjetas', exact: true }).click();
  await expect(demo.locator('[data-reveal=pending]')).toHaveCount(0);
  await expect(demo.locator('article').first()).toHaveCSS('opacity', '1');
});

test('abstract consumer styles change appearance without changing behavior or SPA selection', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  const shell = page.locator('.docs-app');
  const selector = page.getByRole('combobox', { name: 'Estilo de diseño', exact: true });
  await expect(shell).toHaveAttribute('data-design', 'flat-material');
  await page.getByRole('button', { name: 'Probar acción', exact: true }).click();
  const range = page.getByRole('slider', { name: /^Nivel de ejemplo/ });
  await range.focus();
  await range.press('ArrowRight');
  await expect(range).toHaveValue('41');
  const surfaces = [];
  for (const { value: id, label: name } of DEMO_DESIGNS) {
    await selector.click();
    await page.getByRole('option', { name, exact: true }).click();
    await expect(shell).toHaveAttribute('data-design', id);
    await expect(selector).toContainText(name);
    await expect(page.getByRole('status').filter({ hasText: 'Acciones: 1' })).toBeVisible();
    await expect(range).toHaveValue('41');
    surfaces.push(
      await page.locator('.design-sample').evaluate((element) => {
        const css = getComputedStyle(element);
        return [css.background, css.borderRadius, css.boxShadow, css.backdropFilter].join('|');
      }),
    );
  }
  expect(new Set(surfaces).size).toBe(DEMO_DESIGNS.length);
  await selector.click();
  await page.getByRole('option', { name: 'Liquid Glass', exact: true }).click();
  await page.getByRole('link', { name: 'Explorar componentes', exact: true }).click();
  await page.locator('.docs-index').getByRole('link', { name: 'Select', exact: true }).click();
  await expect(shell).toHaveAttribute('data-design', 'liquid-glass');
  await page.locator('[data-example=select]').getByRole('combobox').click();
  await page.getByRole('option', { name: 'Segunda opción', exact: true }).click();
  await expect(page.locator('[data-example=select]').getByRole('combobox')).toContainText(
    'Segunda opción',
  );
  expect(errors).toEqual([]);
});

test('design selector stays usable on mobile and the home explains the consumer styling boundary', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('html[data-bootstrapped="true"]').waitFor();
  const selector = page.getByRole('combobox', { name: 'Estilo de diseño', exact: true });
  await selector.click();
  await page.getByRole('option', { name: 'Aero', exact: true }).click();
  await expect(page.locator('.docs-app')).toHaveAttribute('data-design', 'aero');
  await expect(
    page.getByText('Los estilos los proporciona la aplicación donde se instala la biblioteca.', {
      exact: true,
    }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Menú', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Documentación', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
});
