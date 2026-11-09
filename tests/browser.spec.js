import { test, expect } from '@playwright/test';
const origin='http://127.0.0.1:4321';
test.beforeEach(async({page})=>{await page.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());});
test('home navigation and responsive layout',async({page})=>{
 await page.goto(origin+'/blog/');
 await expect(page.locator('h1')).toHaveText('ItsNikhil');
 await page.locator('#nav').getByRole('link',{name:'Writings'}).click();
 await expect(page).toHaveURL(/\/blog\/posts\/$/);
 await page.getByRole('link',{name:'Older →'}).click();
 await expect(page).toHaveURL(/\/blog\/posts\/page\/2\/$/);
 await page.setViewportSize({width:390,height:844});
 await page.goto(origin+'/blog/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('carousel next, previous, indicator and keyboard',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/blog/posts/screen-to-screen-navigation-understanding-with-ai/');
 const carousel=page.locator('#app-navigation');
 await expect(carousel.locator('.current-slide')).toHaveText('1');
 await carousel.locator('.next').click();await expect(carousel.locator('.current-slide')).toHaveText('2');
 await carousel.locator('.prev').click();await expect(carousel.locator('.current-slide')).toHaveText('1');
 await carousel.locator('.indicator').nth(2).click();await expect(carousel.locator('.current-slide')).toHaveText('3');
 await carousel.focus();await page.keyboard.press('ArrowRight');await expect(carousel.locator('.current-slide')).toHaveText('4');
 expect(errors).toEqual([]);
});
test('TOML metadata and project images',async({page})=>{
 await page.goto(origin+'/blog/posts/mastering-concurrency-in-go/');
 await expect(page.locator('h1')).toHaveText('Understanding concurrency in Go');
 await expect(page.locator('article time')).toHaveText('2021-08-03');
 await page.goto(origin+'/blog/projects/');
 const covers=page.locator('.project-preview img');expect(await covers.count()).toBeGreaterThan(0);
 for(const img of await covers.all())expect(await img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
});
