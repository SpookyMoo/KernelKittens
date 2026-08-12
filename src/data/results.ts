interface ResultBase {
  id: string;
  event: string;
  year: number;
  creditedTeam: string;
  attribution: string;
}

export interface VerifiedCompetitionResult extends ResultBase {
  status: "verified";
  placement: number;
  placementLabel: string;
  fieldSize: number;
  solved: number;
  totalChallenges: number;
  score: number;
}

export interface PendingCompetitionResult extends ResultBase {
  status: "pending";
  placement: null;
  placementLabel: null;
  fieldSize: null;
  solved: null;
  totalChallenges: null;
  score: null;
}

export type CompetitionResult = VerifiedCompetitionResult | PendingCompetitionResult;

export const competitionResults = [
  {
    id: "cyber-apocalypse-2026",
    event: "Cyber Apocalypse",
    year: 2026,
    status: "verified",
    placement: 12,
    placementLabel: "12th",
    fieldSize: 6744,
    solved: 136,
    totalChallenges: 136,
    score: 69425,
    creditedTeam: "1337_PwnSp4c3",
    attribution: "Member result with a prior team"
  },
  {
    id: "bushbash-2026",
    event: "BushBash CTF",
    year: 2026,
    status: "pending",
    placement: null,
    placementLabel: null,
    fieldSize: null,
    solved: null,
    totalChallenges: null,
    score: null,
    creditedTeam: "Kernel Kittens",
    attribution: "Kernel Kittens entry"
  }
] as const satisfies readonly CompetitionResult[];

export const verifiedResults = competitionResults.filter(
  (result): result is (typeof competitionResults)[number] & VerifiedCompetitionResult =>
    result.status === "verified"
);
