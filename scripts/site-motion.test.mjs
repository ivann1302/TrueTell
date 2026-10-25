import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { initSiteMotion } from '../src/components/site-motion/site-motion.ts';

function setup(t, { reduced = false, observerSupported = true, html } = {}) {
  const dom = new JSDOM(html ?? `<main>
    <h1 data-reveal>Visible heading</h1>
    <section id="products"><div data-reveal><a href="#products">Product</a></div></section>
    <section id="faq"><div data-reveal>Answers</div></section>
  </main>`, { url: 'https://example.test/' });
  const { window } = dom;
  const targets = [...window.document.querySelectorAll('[data-reveal], main h2, main figure')];
  targets.forEach((target, index) => {
    const rect = { top: index ? 1500 + index * 500 : 80, bottom: index ? 1800 + index * 500 : 180, height: 100 };
    target.getBoundingClientRect = () => rect;
    target.getClientRects = () => [rect];
  });
  const media = new window.EventTarget();
  media.matches = reduced;
  window.matchMedia = () => media;
  let intersection;
  const observed = new Set();
  window.IntersectionObserver = observerSupported ? class {
    constructor(callback) { intersection = callback; }
    observe(target) { observed.add(target); }
    unobserve(target) { observed.delete(target); }
    disconnect() { observed.clear(); }
  } : undefined;
  const originalWindow = globalThis.window;
  globalThis.window = window;
  t.after(() => {
    window.dispatchEvent(new window.Event('pagehide'));
    dom.window.close();
    globalThis.window = originalWindow;
  });
  return {
    window, targets, media, observed,
    start: () => initSiteMotion(window.document.body),
    enter: (target) => intersection([{ target, isIntersecting: true }]),
  };
}

test('viewport content stays visible; below-fold content reveals once on entry', (t) => {
  const fixture = setup(t);
  fixture.start();
  const [heading, card] = fixture.targets;
  assert.equal(heading.dataset.revealState, undefined);
  assert.equal(card.dataset.revealState, 'pending');
  fixture.enter(card);
  assert.equal(card.dataset.revealState, 'revealed');
  assert(!fixture.observed.has(card), 'Revealed content must not replay on another scroll');
});

test('keyboard focus exposes a pending group immediately without a delayed fade', (t) => {
  const fixture = setup(t);
  fixture.start();
  fixture.targets[1].querySelector('a').focus();
  assert.equal(fixture.targets[1].dataset.revealState, 'instant');
  assert(!fixture.observed.has(fixture.targets[1]));
});

test('direct anchor and subsequent anchor navigation expose the whole target section', (t) => {
  const fixture = setup(t);
  fixture.window.history.replaceState(null, '', '#products');
  fixture.start();
  assert.equal(fixture.targets[1].dataset.revealState, 'instant');
  fixture.window.history.replaceState(null, '', '#faq');
  fixture.window.dispatchEvent(new fixture.window.HashChangeEvent('hashchange'));
  assert.equal(fixture.targets[2].dataset.revealState, 'instant');
});

test('enabling reduced motion reveals all pending content and releases the observer', (t) => {
  const fixture = setup(t);
  fixture.start();
  fixture.media.matches = true;
  fixture.media.dispatchEvent(new fixture.window.Event('change'));
  assert(fixture.targets.every((target) => target.dataset.revealState !== 'pending'));
  assert.equal(fixture.observed.size, 0);
});

test('reduced motion or missing observer never hides content', (t) => {
  for (const options of [{ reduced: true }, { observerSupported: false }]) {
    const fixture = setup(t, options);
    fixture.start();
    assert(fixture.targets.every((target) => target.dataset.revealState === undefined));
    assert.equal(fixture.observed.size, 0);
  }
});

test('leaving the page exposes pending content for back-forward restoration', (t) => {
  const fixture = setup(t);
  fixture.start();
  fixture.window.dispatchEvent(new fixture.window.Event('pagehide'));
  assert(fixture.targets.every((target) => target.dataset.revealState !== 'pending'));
  assert.equal(fixture.observed.size, 0);
});

test('article headings and figures reveal without hiding the article body or paragraphs', (t) => {
  const fixture = setup(t, { html: `<main><article>
    <h2>Visible section</h2><p>Always readable body</p>
    <h2>Later section</h2><figure><img alt="Useful screenshot"></figure>
  </article></main>` });
  fixture.start();
  assert.equal(fixture.targets[1].dataset.revealState, 'pending');
  assert.equal(fixture.targets[2].dataset.revealState, 'pending');
  assert.equal(fixture.window.document.querySelector('article').dataset.revealState, undefined);
  assert.equal(fixture.window.document.querySelector('p').dataset.revealState, undefined);
});

test('nested headings and figures do not animate twice inside an explicit reveal group', (t) => {
  const fixture = setup(t, { html: `<main>
    <h2>Visible heading</h2>
    <div data-reveal><h2>Card heading</h2><figure>Card image</figure></div>
  </main>` });
  fixture.start();
  const [, group, heading, figure] = fixture.targets;
  assert.equal(group.dataset.revealState, 'pending');
  assert.equal(heading.dataset.revealState, undefined);
  assert.equal(figure.dataset.revealState, undefined);
});

test('closing CTA outside main participates while forms and dialogs remain immediately usable', (t) => {
  const fixture = setup(t, { html: `<main>
    <h2>Visible heading</h2><form><h2>Form instructions</h2></form>
  </main>
  <section><div data-reveal><h2>Closing CTA</h2><a href="#contact">Contact</a></div></section>
  <dialog><div data-reveal><h2>Dialog title</h2></div></dialog>` });
  fixture.start();
  const [, formHeading, cta, dialogGroup] = fixture.targets;
  assert.equal(formHeading.dataset.revealState, undefined);
  assert.equal(cta.dataset.revealState, 'pending');
  assert.equal(dialogGroup.dataset.revealState, undefined);
});

test('an explicit marker cannot hide H1 or images inside a carousel', (t) => {
  const fixture = setup(t, { html: `<main>
    <div data-reveal>Visible introduction</div><h1 data-reveal>Page heading</h1>
    <div data-carousel-track><figure>Slide preview</figure></div>
  </main>` });
  fixture.start();
  assert.equal(fixture.targets[1].dataset.revealState, undefined);
  assert.equal(fixture.targets[2].dataset.revealState, undefined);
});
