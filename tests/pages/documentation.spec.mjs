import { test, expect } from '@playwright/test';
import { componentCatalog, directiveCatalog } from '../../demo/catalog.generated.js';
import { serviceCatalog } from '../../demo/service-catalog.js';
test('every static documentation view boots without runtime errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  for (const [category, items] of [
    ['components', componentCatalog],
    ['directives', directiveCatalog],
    ['services', serviceCatalog],
  ]) {
    for (const item of items) {
      await page.goto(`./#/${category}/${item.id}`);
      await expect(page.locator('html')).toHaveAttribute('data-bootstrapped', 'true');
      await expect(page.locator('main > * > machetico-page-heading h1')).toBeVisible();
      if (category === 'services' && item.id === 'api') {
        await expect(page.locator('pre[aria-label="Comandos de instalación"]')).toContainText(
          'npm install machetico-ui',
        );
      }
    }
  }
  expect(errors).toEqual([]);
});
test('static Pages artifact supports deep links, controls, assets and refresh under the repository base', async ({
  page,
  request,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('./#/components/select');
  await expect(page.locator('html'))
    .toHaveAttribute('data-bootstrapped', 'true')
    .catch((error) => {
      throw new Error(errors.join('\n') || error.message);
    });
  await expect(page.locator('main h1')).toHaveText('Select');
  const select = page.locator('[data-example="select"] [role="combobox"]');
  await select.click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.reload();
  await expect(page.locator('main h1')).toHaveText('Select');
  await page.getByRole('link', { name: 'Machetico UI', exact: true }).click();
  await expect(page.locator('main h1')).toHaveText('Machetico UI');
  await expect(page.locator('pre[aria-label="Instalar machetico-ui desde npm"]')).toHaveText(
    'npm install machetico-ui',
  );
  await page.getByRole('button', { name: 'Probar acción' }).click();
  await expect(page.getByText('Acciones: 1', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'Estilo de diseño' }).click();
  await page.getByRole('option', { name: 'Material Design', exact: true }).click();
  await expect(page.locator('.docs-app')).toHaveAttribute('data-design', 'material');
  await page.getByRole('link', { name: 'Saltar al contenido' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page).toHaveURL(/machetico-ui\/#\/$/);
  const license = await request.get('license');
  expect(await license.text()).toContain('Copyright (c) 2026 MacheTico');
  expect((await request.get('samples/background.webm')).ok()).toBe(true);
  expect(errors).toEqual([]);
});
