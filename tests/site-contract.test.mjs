import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { join } from "node:path";

const root = new URL("../site/", import.meta.url);
const pages = [
  "index.html",
  "apply/index.html",
  "results/index.html",
  "writeups/index.html",
  "accessibility/index.html",
  "404.html",
];
const forbiddenThemeMarkers = [
  'class="site-header',
  'class="brand-link',
  'class="motion-stage',
  'class="result-scorecard',
  'class="nav-list',
  'class="button-link',
  "--cobalt:",
  "--surface-alt:",
];

function read(relative) {
  return readFileSync(new URL(relative, root), "utf8");
}

test("every public page uses only the Ready v3 archive theme", () => {
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /class="ready-archive-page(?:"|\s)/);
    assert.match(html, /class="skip-link"/);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${page} needs one main landmark`);
    assert.match(html, /href="\/"/);
    assert.deepEqual(
      [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) => match[1]),
      ["/assets/theme.css"],
      `${page} must use only the canonical stylesheet`,
    );
    for (const marker of forbiddenThemeMarkers) {
      assert.equal(html.includes(marker), false, `${page} contains retired theme marker ${marker}`);
    }
    assert.doesNotMatch(html, /[\u2013\u2014\u2018\u2019\u201c\u201d]/u);
  }
});

test("the approved homepage and application identity stay intact", () => {
  const home = read("index.html");
  const apply = read("apply/index.html");
  for (const html of [home, apply]) {
    assert.match(html, /<title>stray\.rar \| Kernel Kittens<\/title>/);
    assert.match(html, /<h2[^>]*>stray\.rar<\/h2>/);
    assert.match(html, /data-api-origin="https:\/\/apply\.kernelkittens\.team"/);
    assert.match(html, /<dialog[^>]+data-ready-dialog[^>]+open>/);
    assert.match(html, /<script type="module" src="\/assets\/apply\.js"><\/script>/);
  }
});

test("the canonical stylesheet contains Ready v3 and no retired theme", () => {
  const css = read("assets/theme.css");
  assert.match(css, /\.ready-archive-page\{/);
  assert.match(css, /--page:#060606/);
  assert.match(css, /--link:#ef6a2e/);
  for (const marker of forbiddenThemeMarkers) {
    assert.equal(css.includes(marker), false, `theme.css contains retired marker ${marker}`);
  }
});

test("all local page assets exist", () => {
  for (const page of pages) {
    const html = read(page);
    for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
      const target = match[1].split("#", 1)[0].split("?", 1)[0];
      if (target === "/" || target.endsWith("/")) continue;
      assert.equal(existsSync(join(new URL(root).pathname, target)), true, `${page} references missing ${target}`);
    }
  }
});
