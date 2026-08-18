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
    assert.match(html, /<small>est\. 2026<\/small>/);
    assert.equal(html.includes("root@kk"), false, `${page} still contains the retired logo subtitle`);
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

test("the homepage links to the dedicated application route without loading it", () => {
  const home = read("index.html");
  assert.match(home, /<title>Kernel Kittens \| CTF Team<\/title>/);
  assert.match(home, /href="\/apply\/"/);
  assert.match(home, /aria-current="page"[^>]*>\[home\]<\/a>/);
  assert.doesNotMatch(home, /data-ready-root|data-api-origin|data-ready-dialog|data-ready-form/);
  assert.doesNotMatch(home, /<script type="module" src="\/assets\/apply\.js"><\/script>/);
});

test("the application is a full archive record with the existing API flow", () => {
  const apply = read("apply/index.html");
  assert.match(apply, /<title>stray\.rar \| Kernel Kittens<\/title>/);
  assert.match(apply, /<h1>stray\.rar<\/h1>/);
  assert.match(apply, /data-ready-root/);
  assert.match(apply, /data-api-origin="https:\/\/apply\.kernelkittens\.team"/);
  assert.match(apply, /class="application-record"/);
  assert.match(apply, /<ol class="application-steps">/);
  assert.equal((apply.match(/<li class="application-step"/g) ?? []).length, 3);
  assert.match(apply, /data-ready-login-link/);
  assert.match(apply, /data-ready-download/);
  assert.match(apply, /data-ready-form/);
  assert.match(apply, /data-ready-flag/);
  assert.match(apply, /data-ready-top/);
  assert.match(apply, /<script type="module" src="\/assets\/apply\.js"><\/script>/);
  assert.doesNotMatch(apply, /<dialog|data-ready-dialog|data-ready-open|data-ready-close|data-ready-reopen/);
  assert.equal(apply.includes("/apply/stray.rar"), false);
});

test("the application client has no modal controls", () => {
  const client = read("assets/apply.js");
  assert.doesNotMatch(client, /data-ready-dialog|data-ready-open|data-ready-close|data-ready-reopen|showModal/);
  assert.match(client, /\/v1\/session/);
  assert.match(client, /\/v1\/download/);
  assert.match(client, /\/v1\/submit/);
  assert.match(client, /\/v1\/logout/);
});

test("secondary routes expose their current-page state", () => {
  assert.match(read("results/index.html"), /<a href="\/results\/" aria-current="page">\[results\]<\/a>/);
  assert.match(read("writeups/index.html"), /<a href="\/writeups\/" aria-current="page">\[write-ups\]<\/a>/);
  assert.match(read("accessibility/index.html"), /<a href="\/accessibility\/" aria-current="page">accessibility<\/a>/);
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
