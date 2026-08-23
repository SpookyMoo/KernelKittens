import assert from "node:assert/strict";
import { test } from "node:test";

import {
  MEMBER_DESTINATIONS,
  createMemberGate,
  parseMemberSession
} from "../site/assets/member-console-core.js";

const nowMs = Date.UTC(2026, 7, 23, 15, 30, 0);
const member = {
  authenticated: true,
  displayName: "Kernel Kitten",
  isCtfMember: true,
  checkedAtMs: nowMs - 1000
};

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolveValue, rejectValue) => {
    resolve = resolveValue;
    reject = rejectValue;
  });
  return { promise, resolve, reject };
}

test("strictly parses fresh minimal membership data", () => {
  assert.deepEqual(parseMemberSession(member, nowMs), {
    kind: "member",
    displayName: "Kernel Kitten",
    checkedAtMs: nowMs - 1000
  });
  assert.deepEqual(
    parseMemberSession({ ...member, isCtfMember: false }, nowMs),
    {
      kind: "nonmember",
      displayName: "Kernel Kitten",
      checkedAtMs: nowMs - 1000
    }
  );
  assert.deepEqual(parseMemberSession({ authenticated: false }, nowMs), {
    kind: "signed-out"
  });
});

test("rejects stale, future, malformed, and padded membership data", () => {
  for (const value of [
    { ...member, checkedAtMs: nowMs - 45_001 },
    { ...member, checkedAtMs: nowMs + 5_001 },
    { ...member, isCtfMember: "true" },
    { ...member, displayName: "" },
    { ...member, displayName: " kitten " },
    { ...member, extra: true },
    { authenticated: false, checkedAtMs: nowMs },
    null
  ]) {
    assert.equal(parseMemberSession(value, nowMs), null);
  }
});

test("only the newest request can change the gate state", async () => {
  const first = deferred();
  const second = deferred();
  const loads = [first.promise, second.promise];
  const states = [];
  const gate = createMemberGate({
    load: async () => loads.shift(),
    now: () => nowMs,
    onState: (state) => states.push(state),
    openDestination() {}
  });

  const oldRequest = gate.refresh();
  const newRequest = gate.refresh();
  second.resolve(member);
  await newRequest;
  first.resolve({ ...member, isCtfMember: false });
  await oldRequest;

  assert.equal(states.at(-1)?.kind, "member");
  assert.equal(states.filter((state) => state.kind === "nonmember").length, 0);
});

test("failures and false data lock the gate instead of inventing membership", async () => {
  const states = [];
  const gate = createMemberGate({
    load: async () => ({ ...member, checkedAtMs: nowMs - 60_000 }),
    now: () => nowMs,
    onState: (state) => states.push(state),
    openDestination() {}
  });

  await gate.refresh();
  assert.equal(states.at(-1)?.kind, "unavailable");

  const offline = createMemberGate({
    load: async () => {
      throw new Error("provider detail");
    },
    now: () => nowMs,
    onState: (state) => states.push(state),
    openDestination() {}
  });
  await offline.refresh();
  assert.equal(states.at(-1)?.kind, "unavailable");
});

test("every destination requires a fresh positive check before opening", async () => {
  const opened = [];
  let current = { ...member, isCtfMember: false };
  const gate = createMemberGate({
    load: async () => current,
    now: () => nowMs,
    onState() {},
    openDestination: (url) => opened.push(url)
  });

  assert.equal(await gate.authorize("intake"), false);
  assert.deepEqual(opened, []);
  current = member;
  assert.equal(await gate.authorize("intake"), true);
  assert.deepEqual(opened, [MEMBER_DESTINATIONS.intake]);
  assert.equal(await gate.authorize("invented"), false);
  assert.deepEqual(opened, [MEMBER_DESTINATIONS.intake]);
});
