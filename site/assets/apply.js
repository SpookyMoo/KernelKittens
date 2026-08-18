function requireElement(root, selector) {
  const element = root.querySelector(selector);
  if (element === null) throw new Error("Ready page is incomplete");
  return element;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSession(value) {
  if (
    !isObject(value) ||
    value.authenticated !== true ||
    !isObject(value.artifact) ||
    typeof value.displayName !== "string" ||
    value.displayName.length < 1 ||
    value.displayName.length > 64 ||
    typeof value.csrf !== "string" ||
    value.csrf.length < 16 ||
    value.csrf.length > 512 ||
    typeof value.downloadAction !== "string" ||
    !/^v1\.[0-9]{13}\.[A-Za-z0-9_-]{43}$/u.test(value.downloadAction) ||
    typeof value.artifact.filename !== "string" ||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,126}\.rar$/u.test(value.artifact.filename) ||
    typeof value.artifact.sha256 !== "string" ||
    !/^[a-f0-9]{64}$/u.test(value.artifact.sha256) ||
    !(value.solvedAtMs === null || Number.isSafeInteger(value.solvedAtMs)) ||
    !(value.firstDownloadAtMs === null || Number.isSafeInteger(value.firstDownloadAtMs)) ||
    !(value.reissueAvailableAtMs === null ||
      Number.isSafeInteger(value.reissueAvailableAtMs))
  ) {
    return null;
  }

  return {
    authenticated: true,
    displayName: value.displayName,
    csrf: value.csrf,
    downloadAction: value.downloadAction,
    artifact: {
      filename: value.artifact.filename,
      sha256: value.artifact.sha256,
    },
    solvedAtMs: value.solvedAtMs,
    firstDownloadAtMs: value.firstDownloadAtMs,
    reissueAvailableAtMs: value.reissueAvailableAtMs,
  };
}

const root = document.querySelector("[data-ready-root]");

if (root !== null) {
  const apiOrigin = root.dataset.apiOrigin;
  if (apiOrigin === undefined) throw new Error("Ready API is not configured");

  const status = requireElement(root, "[data-ready-status]");
  const login = requireElement(root, "[data-ready-login]");
  const loginLink = requireElement(root, "[data-ready-login-link]");
  const assignmentSections = [...root.querySelectorAll("[data-ready-assignment]")];
  if (assignmentSections.length !== 2) throw new Error("Ready page is incomplete");
  const displayName = requireElement(root, "[data-ready-display-name]");
  const download = requireElement(root, "[data-ready-download]");
  const sha = requireElement(root, "[data-ready-sha]");
  const form = requireElement(root, "[data-ready-form]");
  const flag = requireElement(root, "[data-ready-flag]");
  const topTokens = requireElement(root, "[data-ready-top]");
  const submit = requireElement(root, "[data-ready-submit]");
  const result = requireElement(root, "[data-ready-result]");
  const logout = requireElement(root, "[data-ready-logout]");
  const reissuePanel = requireElement(root, "[data-ready-reissue-panel]");
  const reissueStatus = requireElement(root, "[data-ready-reissue-status]");
  const reissue = requireElement(root, "[data-ready-reissue]");
  let session = null;
  let reissueTimer = null;

  loginLink.href = `${apiOrigin}/auth/discord/start`;
  download.href = `${apiOrigin}/v1/download`;

  function showLoggedOut(message = "Discord assigns your file.") {
    if (reissueTimer !== null) window.clearInterval(reissueTimer);
    reissueTimer = null;
    session = null;
    status.textContent = message;
    login.hidden = false;
    for (const section of assignmentSections) section.hidden = true;
    reissuePanel.hidden = true;
  }

  function updateReissueCountdown() {
    if (session === null || session.reissueAvailableAtMs === null) return;
    const remainingMs = Math.max(0, session.reissueAvailableAtMs - Date.now());
    if (remainingMs === 0) {
      reissueStatus.textContent = "A new archive is available.";
      reissue.disabled = false;
      if (reissueTimer !== null) window.clearInterval(reissueTimer);
      reissueTimer = null;
      return;
    }
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    reissueStatus.textContent = `Available in ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.`;
    reissue.disabled = true;
  }

  function startReissueCountdown() {
    if (reissueTimer !== null) window.clearInterval(reissueTimer);
    updateReissueCountdown();
    if (reissue.disabled) reissueTimer = window.setInterval(updateReissueCountdown, 1000);
  }

  function showAssignment(value, clearProof = false) {
    session = value;
    if (clearProof) {
      flag.value = "";
      topTokens.value = "";
    }
    form.hidden = false;
    flag.disabled = false;
    topTokens.disabled = false;
    submit.hidden = false;
    submit.disabled = false;
    result.textContent = "";
    status.textContent = "Assignment recovered.";
    login.hidden = true;
    for (const section of assignmentSections) section.hidden = false;
    displayName.textContent = `Signed in as ${value.displayName}`;
    download.textContent = `Download ${value.artifact.filename}`;
    const downloadUrl = new URL("/v1/download", apiOrigin);
    downloadUrl.searchParams.set("action", value.downloadAction);
    download.href = downloadUrl.toString();
    sha.textContent = value.artifact.sha256;
    reissuePanel.hidden = value.firstDownloadAtMs === null;
    if (!reissuePanel.hidden) startReissueCountdown();
    else {
      if (reissueTimer !== null) window.clearInterval(reissueTimer);
      reissueTimer = null;
      reissueStatus.textContent = "";
      reissue.disabled = true;
    }
    if (value.solvedAtMs !== null) {
      form.hidden = true;
      result.textContent = "received.";
    }
  }

  async function loadSession(keepCurrentOnError = false, clearProof = false) {
    try {
      const response = await fetch(`${apiOrigin}/v1/session`, {
        method: "GET",
        credentials: "include",
        headers: { accept: "application/json" },
      });
      if (!response.ok) throw new Error("session unavailable");
      const value = await response.json();
      if (isObject(value) && value.authenticated === false) {
        showLoggedOut();
        return;
      }
      const parsed = parseSession(value);
      if (parsed === null) throw new Error("invalid session");
      showAssignment(parsed, clearProof);
    } catch {
      if (!keepCurrentOnError) {
        showLoggedOut("Challenge service unavailable. Try again.");
      }
    }
  }

  download.addEventListener("click", () => {
    for (const delayMs of [750, 2000, 5000]) {
      window.setTimeout(() => loadSession(true), delayMs);
    }
  });

  reissue.addEventListener("click", async () => {
    if (session === null || reissue.disabled) return;
    if (reissueTimer !== null) window.clearInterval(reissueTimer);
    reissueTimer = null;
    reissue.disabled = true;
    reissueStatus.textContent = "Requesting a new archive...";
    try {
      const response = await fetch(`${apiOrigin}/v1/reissue`, {
        method: "POST",
        credentials: "include",
        headers: { accept: "application/json", "content-type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ csrf: session.csrf }),
      });
      const value = await response.json();
      const responseStatus = isObject(value) ? value.status : undefined;
      if (response.ok && responseStatus === "issued") {
        await loadSession(false, true);
        return;
      }
      if (response.status === 429 && responseStatus === "cooldown") {
        reissueStatus.textContent = "The one-hour cooldown is still running.";
        startReissueCountdown();
      } else if (response.status === 409 && responseStatus === "download_required") {
        reissueStatus.textContent = "Download this archive before requesting another one.";
      } else if (response.status === 403) {
        reissueStatus.textContent = "Session expired. Sign in again.";
      } else {
        reissueStatus.textContent = "Archive service unavailable. Try again.";
      }
    } catch {
      reissueStatus.textContent = "Archive service unavailable. Try again.";
      if (session?.reissueAvailableAtMs !== null && Date.now() >= session.reissueAvailableAtMs) reissue.disabled = false;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (session === null || !form.reportValidity()) return;

    submit.disabled = true;
    result.textContent = "Checking...";
    try {
      const response = await fetch(`${apiOrigin}/v1/submit`, {
        method: "POST",
        credentials: "include",
        headers: { accept: "application/json", "content-type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ csrf: session.csrf, flag: flag.value, topTokens: topTokens.value }),
      });
      const value = await response.json();
      const responseStatus = isObject(value) ? value.status : undefined;
      if (response.ok && responseStatus === "received") {
        result.textContent = "received.";
        flag.disabled = true;
        topTokens.disabled = true;
        submit.hidden = true;
        return;
      }
      if (response.status === 409 && responseStatus === "download_required") result.textContent = "Download your archive before submitting.";
      else if (response.status === 429) result.textContent = "Slow down. Try again in a minute.";
      else if (response.status === 400 && responseStatus === "invalid") result.textContent = "Nope.";
      else if (response.status === 403) result.textContent = "Session expired. Sign in again.";
      else result.textContent = "Submission service unavailable. Try again.";
    } catch {
      result.textContent = "Submission service unavailable. Try again.";
    } finally {
      if (!submit.hidden) submit.disabled = false;
    }
  });

  logout.addEventListener("click", async () => {
    if (session === null) return;
    logout.disabled = true;
    try {
      await fetch(`${apiOrigin}/v1/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ csrf: session.csrf }),
      });
    } finally {
      window.location.reload();
    }
  });

  loadSession();
}
