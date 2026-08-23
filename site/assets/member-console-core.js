const MAXIMUM_RESPONSE_AGE_MS = 45_000;
const MAXIMUM_FUTURE_SKEW_MS = 5_000;

export const MEMBER_DESTINATIONS = Object.freeze({
  intake:
    "https://discord.com/channels/1538643915672920097/1538665438555406336",
  liveOps:
    "https://discord.com/channels/1538643915672920097/1538665440367214642",
  flagLedger:
    "https://discord.com/channels/1538643915672920097/1538665441881489469"
});

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value, expected) {
  const keys = Object.keys(value).sort();
  return (
    keys.length === expected.length &&
    keys.every((key, index) => key === expected[index])
  );
}

export function parseMemberSession(value, nowMs) {
  if (!isObject(value) || !Number.isSafeInteger(nowMs)) return null;
  if (value.authenticated === false) {
    return hasExactKeys(value, ["authenticated"])
      ? Object.freeze({ kind: "signed-out" })
      : null;
  }
  if (
    value.authenticated !== true ||
    !hasExactKeys(value, [
      "authenticated",
      "checkedAtMs",
      "displayName",
      "isCtfMember"
    ]) ||
    typeof value.displayName !== "string" ||
    value.displayName.length < 1 ||
    value.displayName.length > 64 ||
    value.displayName.trim() !== value.displayName ||
    /[\u0000-\u001f\u007f]/u.test(value.displayName) ||
    typeof value.isCtfMember !== "boolean" ||
    !Number.isSafeInteger(value.checkedAtMs) ||
    value.checkedAtMs < nowMs - MAXIMUM_RESPONSE_AGE_MS ||
    value.checkedAtMs > nowMs + MAXIMUM_FUTURE_SKEW_MS
  ) {
    return null;
  }
  return Object.freeze({
    kind: value.isCtfMember ? "member" : "nonmember",
    displayName: value.displayName,
    checkedAtMs: value.checkedAtMs
  });
}

function unavailableState() {
  return Object.freeze({ kind: "unavailable" });
}

export function createMemberGate({
  load,
  now,
  onState,
  openDestination
}) {
  if (
    typeof load !== "function" ||
    typeof now !== "function" ||
    typeof onState !== "function" ||
    typeof openDestination !== "function"
  ) {
    throw new Error("Member gate dependencies are invalid");
  }

  let newestRequest = 0;

  async function refresh() {
    const requestId = ++newestRequest;
    onState(Object.freeze({ kind: "checking" }));
    try {
      const value = await load();
      if (requestId !== newestRequest) {
        return Object.freeze({ kind: "ignored" });
      }
      const state = parseMemberSession(value, now()) ?? unavailableState();
      onState(state);
      return state;
    } catch {
      if (requestId !== newestRequest) {
        return Object.freeze({ kind: "ignored" });
      }
      const state = unavailableState();
      onState(state);
      return state;
    }
  }

  async function authorize(destinationName) {
    if (!Object.hasOwn(MEMBER_DESTINATIONS, destinationName)) return false;
    const state = await refresh();
    if (state.kind !== "member") return false;
    openDestination(MEMBER_DESTINATIONS[destinationName]);
    return true;
  }

  return Object.freeze({ refresh, authorize });
}
