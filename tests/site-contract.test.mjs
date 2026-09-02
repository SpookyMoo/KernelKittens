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

test("every public page uses only the current archive theme", () => {
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

test("the homepage links to Apply and Discord without loading the application client", () => {
  const home = read("index.html");
  assert.match(home, /<title>Kernel Kittens \| CTF Team<\/title>/);
  assert.match(home, /href="\/apply\/"/);
  assert.match(home, /aria-current="page"[^>]*>\[home\]<\/a>/);
  assert.equal((home.match(/href="https:\/\/apply\.kernelkittens\.team\/auth\/discord\/start"/g) ?? []).length, 1);
  assert.match(home, /<span>Log in with Discord<\/span>/);
  assert.equal((home.match(/src="\/brand\/discord-symbol\.svg"/g) ?? []).length, 1);
  assert.match(home, /<img[^>]*src="\/brand\/discord-symbol\.svg"[^>]*alt=""[^>]*>/);
  const discordSymbolPath = new URL("brand/discord-symbol.svg", root);
  assert.equal(existsSync(discordSymbolPath), true, "the official Discord symbol must be self-hosted");
  const discordSymbol = read("brand/discord-symbol.svg");
  assert.match(discordSymbol, /viewBox="0 0 64 48"/);
  assert.match(discordSymbol, /fill="white"/);
  assert.doesNotMatch(home, /data-ready-root|data-api-origin|data-ready-dialog|data-ready-form/);
  assert.doesNotMatch(home, /<script\b/);
});

test("the homepage removes the redundant path and publishes every verified result", () => {
  const home = read("index.html");
  assert.doesNotMatch(home, /<p class="path-label">\/home<\/p>/);
  assert.match(home, /<h2 id="competition-results-title">Competition results<\/h2>/);
  assert.match(home, /Cyber Apocalypse 2026/);
  assert.match(home, /12 \/ 6,744/);
  assert.match(home, /136 \/ 136/);
  assert.match(home, /69,425/);
  assert.match(home, /BushBash CTF 2026/);
  assert.match(home, /1 \/ 994/);
  assert.match(home, /28 \/ 28/);
  assert.match(home, /5,997/);
  assert.match(home, /Kaspersky\{CTF\} 2026/);
  assert.match(home, /3 \/ 361/);
  assert.match(home, /Division: North America/);
  assert.equal((home.match(/RESULT 2026 \/ team result/g) ?? []).length, 1);
  assert.equal((home.match(/RESULT 2026 \/ member result with a prior team/g) ?? []).length, 2);
  assert.doesNotMatch(home, /KK \/ RESULT 2026/);
  assert.equal((home.match(/1337_PwnSp4c3/g) ?? []).length, 2);
  assert.ok(
    home.indexOf("Competition results") < home.indexOf("Recruitment"),
    "results must appear before Recruitment",
  );
});

test("the Results page contains the complete verified competition record", () => {
  const results = read("results/index.html");
  assert.equal((results.match(/class="archive-record"/g) ?? []).length, 3);
  assert.match(results, /Cyber Apocalypse 2026/);
  assert.match(results, /12 \/ 6,744/);
  assert.match(results, /136 \/ 136/);
  assert.match(results, /69,425/);
  assert.match(results, /BushBash CTF 2026/);
  assert.match(results, /1 \/ 994/);
  assert.match(results, /28 \/ 28/);
  assert.match(results, /5,997/);
  assert.match(results, /Open - International/);
  assert.match(results, /Kaspersky\{CTF\} 2026/);
  assert.match(results, /3 \/ 361/);
  assert.match(results, /Division: North America/);
  assert.equal((results.match(/RESULT 2026 \/ team result/g) ?? []).length, 1);
  assert.ok(
    results.indexOf("Kaspersky{CTF} 2026") < results.indexOf("Cyber Apocalypse 2026"),
    "the newest result must appear first",
  );
  assert.equal((results.match(/RESULT 2026 \/ member result with a prior team/g) ?? []).length, 2);
  assert.doesNotMatch(results, /KK \/ RESULT 2026/);
  assert.equal((results.match(/1337_PwnSp4c3/g) ?? []).length, 2);
});

test("the application is a full archive record with the existing API flow", () => {
  const apply = read("apply/index.html");
  assert.match(apply, /<title>stray\.rar \| Kernel Kittens<\/title>/);
  assert.match(apply, /<h1>stray\.rar<\/h1>/);
  assert.match(apply, /<h2>stray\.rar<\/h2>/);
  assert.doesNotMatch(apply, /candidate assignment/);
  assert.doesNotMatch(apply, /READY-V[0-9]/);
  assert.match(apply, /Find three fragments in order, then assemble them with the format below\./);
  assert.match(apply, /This challenge is designed to be solvable in under five minutes\./);
  assert.match(apply, /Every correct solve unlocks the KernelKittens Discord and grants Member\./);
  assert.doesNotMatch(apply, /Parts A \+ B \+ C \+ D|10-15 minutes|repeat this challenge/i);
  assert.match(apply, /data-ready-root/);
  assert.match(apply, /data-api-origin="https:\/\/apply\.kernelkittens\.team"/);
  assert.match(apply, /class="application-record"/);
  assert.match(apply, /<ol class="application-steps">/);
  assert.equal((apply.match(/<li class="application-step"/g) ?? []).length, 3);
  const visibleBeforeLogin = apply.slice(0, apply.indexOf("data-ready-assignment hidden"));
  assert.match(visibleBeforeLogin, /Submit format: <code>KernelFlag\{first_second_third\}<\/code>/);
  assert.match(apply, /data-ready-login-link/);
  assert.match(apply, /data-ready-download/);
  assert.match(apply, /data-ready-form/);
  assert.match(apply, /data-ready-flag/);
  assert.match(apply, /KernelFlag\{first_second_third\}/);
  assert.match(apply, /Submit format: <code>KernelFlag\{first_second_third\}<\/code>/);
  assert.match(apply, /Under 5:00 gets Member plus CTF Player\./);
  assert.match(apply, /5:00 or longer gets Member\./);
  assert.match(apply, /data-ready-discord-join/);
  assert.doesNotMatch(apply, /TOP|topTokens|base64|password|256-password/i);
  assert.match(apply, /<script type="module" src="\/assets\/apply\.js"><\/script>/);
  assert.doesNotMatch(apply, /<dialog|data-ready-dialog|data-ready-open|data-ready-close|data-ready-reopen/);
  assert.equal(apply.includes("/apply/stray.rar"), false);
});

test("the application explains timed scoring and keeps reissue hidden until download", () => {
  const apply = read("apply/index.html");
  assert.match(apply, /Scoring is based on the time from your first download to a correct submission\./);
  assert.doesNotMatch(apply, /You can repeat this challenge as many times as you want\./);
  assert.match(apply, /data-ready-reissue-panel hidden/);
  assert.match(apply, /data-ready-reissue-status[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(apply, /data-ready-reissue/);
  assert.match(apply, />Request a new archive<\/button>/);
  assert.match(apply, /A new archive is available after one hour\./);
  assert.match(apply, /Your original timer does not reset\./);
});

test("the application client has no modal controls", () => {
  const client = read("assets/apply.js");
  assert.doesNotMatch(client, /data-ready-dialog|data-ready-open|data-ready-close|data-ready-reopen|showModal/);
  assert.match(client, /\/v1\/session/);
  assert.match(client, /\/v1\/download/);
  assert.match(client, /\/v1\/submit/);
  assert.match(client, /\/v1\/logout/);
  assert.match(client, /\/v1\/reissue/);
  assert.match(client, /data-ready-reissue-panel/);
  assert.match(client, /firstDownloadAtMs/);
  assert.match(client, /reissueAvailableAtMs/);
  assert.match(client, /setInterval/);
  assert.doesNotMatch(client, /TOP|topTokens|data-ready-top|base64|password|256-password/i);
  assert.match(client, /discordJoinReady/);
  assert.match(client, /discordJoinUrl/);
  assert.match(client, /response\.ok[\s\S]*?responseStatus === "received"[\s\S]*?await loadSession\(true\);/);
  assert.match(client, /reissuePanel\.hidden = value\.solvedAtMs !== null \|\|/);
  assert.match(client, /data-ready-discord-join/);
  assert.match(client, /loadSession\(false, true\)/);
  assert.doesNotMatch(client, /function showAssignment\(value\) \{\s*session = value;\s*flag\.value = ""/);
  assert.match(client, /window\.setTimeout\(\(\) => loadSession\(true\), delayMs\)/);
  assert.match(client, /response\.status === 409 && responseStatus === "download_required"/);
  assert.match(client, /response\.status === 503 && responseStatus === "notification_pending"/);
  assert.match(client, /Flag accepted, but the Discord receipt is still pending\. Try submit again\./);
  assert.match(client, /response\.status === 400 && responseStatus === "wrong_prefix"/);
  assert.match(client, /That prefix is wrong\. Re-read the flag format and try again\./);
  assert.doesNotMatch(
    client,
    /download\.addEventListener\("click",[\s\S]*?reissuePanel\.hidden = false/
  );
});

test("secondary routes expose their current-page state", () => {
  assert.match(read("results/index.html"), /<a href="\/results\/" aria-current="page">\[results\]<\/a>/);
  assert.match(read("writeups/index.html"), /<a href="\/writeups\/" aria-current="page">\[write-ups\]<\/a>/);
  assert.match(read("accessibility/index.html"), /<a href="\/accessibility\/" aria-current="page">accessibility<\/a>/);
});

test("the canonical stylesheet contains the current archive theme", () => {
  const css = read("assets/theme.css");
  assert.match(css, /\.ready-archive-page\{/);
  assert.match(css, /--page:#060606/);
  assert.match(css, /--link:#ef6a2e/);
  assert.match(css, /\.ready-archive-page \.crew-nav a,\.ready-archive-page \.crew-nav button\{[^}]*display:inline-flex/);
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
