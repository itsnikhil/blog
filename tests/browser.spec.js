import { test, expect } from '@playwright/test';
const origin = process.env.BLOG_TEST_ORIGIN || 'http://127.0.0.1:4321';
test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
});
test('home, archive pagination and mobile navigation', async ({ page }) => {
  await page.goto(`${origin}/blog/`);
  await expect(page.locator('h1')).toHaveText('Hi, I’m Nikhil.');
  await page.locator('#navigation-menu').getByRole('link', { name: 'Writings' }).click();
  await expect(page).toHaveURL(/\/blog\/posts\/$/);
  await page.getByRole('link', { name: 'Older →' }).click();
  await expect(page).toHaveURL(/\/blog\/posts\/page\/2\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/blog\/posts\/$/);
  for (const width of [393, 295]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${origin}/blog/`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const menu = page.getByRole('button', { name: 'Open main menu' });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await page.locator('#navigation-menu').getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/blog\/projects\/$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
test('theme persists across navigation', async ({ page }) => {
  await page.goto(`${origin}/blog/`);
  const before = await page.locator('html').getAttribute('data-theme');
  await page.getByRole('switch', { name: 'Dark Theme' }).click();
  const after = await page.locator('html').getAttribute('data-theme');
  expect(after).not.toBe(before);
  await page.locator('#navigation-menu').getByRole('link', { name: 'Writings' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', after);
});
test('Pagefind search opens, closes, and stays under blog base', async ({ page }) => {
  await page.goto(`${origin}/blog/`);
  const trigger = page.locator('pagefind-modal-trigger button');
  await trigger.click();
  const input = page.locator('pagefind-modal input[type="search"]');
  await input.fill('concurrency');
  const result = page.locator('pagefind-modal a').filter({ hasText: 'Understanding concurrency in Go' }).first();
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute('href', /\/blog\/posts\/mastering-concurrency-in-go\//);
  await page.keyboard.press('Escape');
  await expect(input).not.toBeVisible();
  await trigger.click();
  await input.fill('concurrency');
  await result.click();
  await expect(page).toHaveURL(/\/blog\/posts\/mastering-concurrency-in-go\/$/);
});
test('carousel controls and keyboard', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/blog/posts/screen-to-screen-navigation-understanding-with-ai/`);
  const carousel = page.locator('#app-navigation');
  await expect(carousel.locator('.current-slide')).toHaveText('1');
  await carousel.locator('.next').click(); await expect(carousel.locator('.current-slide')).toHaveText('2');
  await carousel.locator('.prev').click(); await expect(carousel.locator('.current-slide')).toHaveText('1');
  await carousel.locator('.indicator').nth(2).click(); await expect(carousel.locator('.current-slide')).toHaveText('3');
  await carousel.focus(); await page.keyboard.press('ArrowRight'); await expect(carousel.locator('.current-slide')).toHaveText('4');
  expect(errors).toEqual([]);
});
test('article metadata and local project images', async ({ page }) => {
  await page.goto(`${origin}/blog/posts/mastering-concurrency-in-go/`);
  await expect(page.locator('h1')).toHaveText('Understanding concurrency in Go');
  await expect(page.locator('time[itemprop="datePublished"]')).toHaveAttribute('datetime', /^2021-08-03/);
  await page.goto(`${origin}/blog/projects/`);
  const covers = page.locator('main img[src^="/blog/"]'); expect(await covers.count()).toBeGreaterThan(0);
  for (const img of await covers.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});
