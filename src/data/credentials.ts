export type CredentialKind = "current" | "expired" | "result";

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  kind: CredentialKind;
  statusLabel: string;
  context: string;
}

export const credentials: readonly Credential[] = [
  {
    id: "google-cybersecurity-professional-certificate",
    title: "Google Cybersecurity Professional Certificate",
    issuer: "Google",
    kind: "current",
    statusLabel: "Current credential",
    context: "Held by a Kernel Kittens team member."
  },
  {
    id: "cisco-certified-network-associate",
    title: "Cisco Certified Network Associate",
    issuer: "Cisco",
    kind: "expired",
    statusLabel: "Previous credential - expired",
    context: "Held previously by a Kernel Kittens team member. It is not represented as current."
  },
  {
    id: "comptia-a-plus",
    title: "CompTIA A+",
    issuer: "CompTIA",
    kind: "expired",
    statusLabel: "Previous credential - expired",
    context: "Held previously by a Kernel Kittens team member. It is not represented as current."
  },
  {
    id: "htb-cyber-apocalypse-2026",
    title: "Hack The Box Cyber Apocalypse 2026",
    issuer: "Hack The Box",
    kind: "result",
    statusLabel: "Member competition result",
    context: "Earned with 1337_PwnSp4c3: 12th of 6,744 teams, 136 of 136 challenges, and 69,425 points."
  }
] as const;

