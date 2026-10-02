import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('tests/artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const base=process.env.TEST_URL || 'http://localhost:8080/';
const report={checks:[],metrics:{}};
try {
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{window.__lcp=0;window.__cls=0;new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lcp=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__cls+=e.value})).observe({type:'layout-shift',buffered:true});});
await page.goto(base,{waitUntil:'networkidle'});
await page.screenshot({path:'tests/artifacts/mobile-home.png',fullPage:true});
for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);}
report.checks.push('No horizontal overflow at 320, 390, 768 and 1440px');
await page.setViewportSize({width:390,height:844});
await page.locator('[data-filter="forest"]').click();assert.equal(await page.locator('.animal-card').count(),3);
await page.locator('.search input').fill('不存在');assert.equal(await page.locator('.empty-results').count(),1);await page.locator('#reset-search').click();assert.equal(await page.locator('.animal-card').count(),6);
report.checks.push('Habitat filters, search, empty state and reset');
await page.locator('.animal-card[data-animal="red-panda"]').click();assert(await page.locator('dialog').evaluate(e=>e.open));assert.equal(await page.locator('#dialog-title').textContent(),'小熊貓');await page.waitForTimeout(500);await page.screenshot({path:'tests/artifacts/mobile-detail.png'});await page.keyboard.press('Escape');assert(!(await page.locator('dialog').evaluate(e=>e.open)));
report.checks.push('Animal sheet, Escape dismissal and discovery tracking');
await page.locator('#start-route').click();await page.locator('#detail-next').click();await page.locator('[data-habitat="forest"]').click();await page.locator('.companion-message button').click();await page.locator('[data-care="0"]').click();assert((await page.locator('.companion-message').textContent()).includes('探索完成'));
report.checks.push('Complete three-stop guide and conservation action');
await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-care="0"]').getAttribute('aria-pressed'),'true');assert((await page.locator('#collection-count').textContent()).includes('1 / 6'));
report.checks.push('Local persistence');
await page.locator('.menu-button').click();assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'true');await page.locator('.desktop-nav a').first().click();assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'false');
await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.panda').evaluate(e=>getComputedStyle(e).animationName),'none');
report.checks.push('Mobile navigation and reduced-motion support');
await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#motion-toggle').click();assert.equal(await page.locator('.panda').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
report.checks.push('Manual animation pause');
await page.locator('#habitats').scrollIntoViewIfNeeded();await page.locator('#conservation').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
assert.deepEqual(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[]);
report.checks.push('All photographs loaded and decoded');await page.locator('video').scrollIntoViewIfNeeded();await page.locator('video').evaluate(v=>v.play());await page.waitForTimeout(700);assert(await page.locator('video').evaluate(v=>v.currentTime>0));await page.locator('video').evaluate(v=>v.pause());report.checks.push('Native video playback');assert.deepEqual(errors,[]);report.checks.push('No JavaScript runtime errors');
await page.setViewportSize({width:1440,height:1000});await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:'tests/artifacts/desktop-home.png',fullPage:true});
const perf=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const cdp=await perf.context().newCDPSession(perf);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
await perf.addInitScript(()=>{window.__lcp=0;window.__cls=0;new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lcp=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__cls+=e.value})).observe({type:'layout-shift',buffered:true});});
await perf.goto(base,{waitUntil:'networkidle'});report.metrics=await perf.evaluate(()=>({lcpMs:Math.round(window.__lcp),cls:window.__cls,transferredBytes:performance.getEntriesByType('resource').reduce((n,e)=>n+e.transferSize,0),conditions:'390px viewport, 4x CPU slowdown, 1.6Mbps / 150ms latency; local static server'}));
await writeFile('tests/artifacts/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}



