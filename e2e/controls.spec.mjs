import { test, expect } from '@playwright/test';
test('headless controls keep behavior across consumer identities', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Machetico UI', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Acción 0' }).click();
  await expect(page.getByRole('button', { name: 'Acción 1' })).toBeVisible();
  await page.getByLabel('Simular pendiente').check();
  await expect(page.getByRole('button', { name: 'Acción 1' })).toBeDisabled();
  await page.getByLabel('Simular pendiente').uncheck();
  const range = page.getByRole('slider');
  await range.focus();
  await range.press('ArrowRight');
  await expect(range).toHaveValue('31');
  const combo = page.getByRole('combobox', { name: 'Seleccionar opción' });
  await combo.focus();
  await combo.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'Segunda opción' })).toBeVisible();
  await page.getByRole('option', { name: 'Segunda opción' }).click();
  await expect(combo).toContainText('Segunda opción');
  await combo.press('ArrowDown');
  await combo.press('Escape');
  await expect(combo).toBeFocused();
  const sidebar = page.getByRole('button', { name: 'Abrir sidebar' });
  await sidebar.click();
  await expect(page.getByRole('dialog', { name: 'Navegación' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(sidebar).toBeFocused();
  const dialog = page.getByRole('button', { name: 'Abrir diálogo' });
  await dialog.click();
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(dialog).toBeFocused();
  await page.getByRole('button', { name: 'Imagen siguiente' }).click();
  await expect(page.getByAltText('Ejemplo verde')).toBeVisible();
  await page.getByRole('button', { name: 'Nombre', exact: true }).click();
  await expect(page.getByRole('columnheader', { name: 'Nombre' })).toHaveAttribute(
    'aria-sort',
    'ascending',
  );
  for (const theme of ['taurus', 'megaphone', 'folio']) {
    await page.getByLabel('Identidad de ejemplo').selectOption(theme);
    await expect(page.locator('main')).toHaveAttribute('data-theme', theme);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('combobox', { name: 'Seleccionar opción' })).toBeVisible();
  await page.screenshot({ path: 'test-results/playground-mobile.png', fullPage: true });
  expect(errors).toEqual([]);
});
