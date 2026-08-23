import { createMemberGate } from "./member-console-core.js";

function requireElement(root, selector) {
  const element = root.querySelector(selector);
  if (element === null) throw new Error("Member console is incomplete");
  return element;
}

const root = document.querySelector("[data-member-console]");

if (root !== null) {
  const apiOrigin = root.dataset.apiOrigin;
  if (apiOrigin === undefined) throw new Error("Member API is not configured");

  const status = requireElement(root, "[data-member-status]");
  const lockReason = requireElement(root, "[data-member-lock-reason]");
  const destinations = [...root.querySelectorAll("[data-member-destination]")];
  const traces = Object.fromEntries(
    ["session", "guild", "role"].map((name) => {
      const row = requireElement(root, `[data-member-trace="${name}"]`);
      return [name, requireElement(row, "[data-member-trace-value]")];
    })
  );
  if (destinations.length !== 3) throw new Error("Member console is incomplete");

  let activeRequest = null;

  function setTrace(name, value, state) {
    traces[name].textContent = value;
    traces[name].dataset.state = state;
  }

  function lockDestinations(message) {
    for (const destination of destinations) {
      destination.setAttribute("aria-disabled", "true");
    }
    lockReason.textContent = message;
  }

  function renderState(state) {
    root.dataset.memberState = state.kind;
    if (state.kind === "checking") {
      status.textContent = "Checking Discord role...";
      lockDestinations("Fresh verification required.");
      setTrace("session", "CHECKING", "checking");
      setTrace("guild", "WAITING", "checking");
      setTrace("role", "WAITING", "checking");
      return;
    }
    if (state.kind === "signed-out") {
      status.textContent = "Log in with Discord to check your CTF access.";
      lockDestinations("Discord login required.");
      setTrace("session", "SIGNED OUT", "locked");
      setTrace("guild", "NOT CHECKED", "locked");
      setTrace("role", "NOT CHECKED", "locked");
      return;
    }
    if (state.kind === "member") {
      status.textContent = `Verified for ${state.displayName}. Live role check passed.`;
      for (const destination of destinations) {
        destination.setAttribute("aria-disabled", "false");
      }
      lockReason.textContent = "Fresh role check passed. Discord still enforces channel access.";
      setTrace("session", "VERIFIED", "passed");
      setTrace("guild", "CHECKED", "passed");
      setTrace("role", "PRESENT", "passed");
      return;
    }
    if (state.kind === "nonmember") {
      status.textContent = `Signed in as ${state.displayName}. CTF Player role required.`;
      lockDestinations("CTF Player role required.");
      setTrace("session", "VERIFIED", "passed");
      setTrace("guild", "CHECKED", "passed");
      setTrace("role", "MISSING", "locked");
      return;
    }
    status.textContent = "Live role check unavailable. Access stays locked.";
    lockDestinations("Verification failed. Nothing was unlocked.");
    setTrace("session", "UNKNOWN", "locked");
    setTrace("guild", "UNKNOWN", "locked");
    setTrace("role", "UNKNOWN", "locked");
  }

  async function loadMembership() {
    activeRequest?.abort();
    const controller = new AbortController();
    activeRequest = controller;
    try {
      const response = await fetch(`${apiOrigin}/v1/member-session`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { accept: "application/json" },
        signal: controller.signal
      });
      if (response.status === 401) return { authenticated: false };
      if (!response.ok) throw new Error("membership unavailable");
      return await response.json();
    } finally {
      if (activeRequest === controller) activeRequest = null;
    }
  }

  const gate = createMemberGate({
    load: loadMembership,
    now: () => Date.now(),
    onState: renderState,
    openDestination: (url) => window.location.assign(url)
  });

  for (const destination of destinations) {
    destination.addEventListener("click", async () => {
      const destinationName = destination.dataset.memberDestination;
      if (destinationName === undefined) return;
      await gate.authorize(destinationName);
    });
  }

  window.setInterval(() => {
    if (document.visibilityState === "visible") void gate.refresh();
  }, 30_000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void gate.refresh();
  });
  window.addEventListener("focus", () => void gate.refresh());
  window.addEventListener("pagehide", () => activeRequest?.abort(), {
    once: true
  });

  void gate.refresh();
}
