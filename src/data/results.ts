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
  solved: number | null;
  totalChallenges: number | null;
  score: number | null;
  division: string | null;
}

export interface PendingCompetitionResult extends ResultBase {
  status: "pending";
  placement: null;
  placementLabel: null;
  fieldSize: null;
  solved: null;
  totalChallenges: null;
  score: null;
  division: null;
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
    division: null,
    creditedTeam: "1337_PwnSp4c3",
    attribution: "Member result with a prior team"
  },
  {
    id: "bushbash-2026",
    event: "BushBash CTF",
    year: 2026,
    status: "verified",
    placement: 1,
    placementLabel: "1st",
    fieldSize: 994,
    solved: null,
    totalChallenges: null,
    score: null,
    division: "Global",
    creditedTeam: "1337_PwnSp4c3",
    attribution: "Member result with a prior team"
  }
] as const satisfies readonly CompetitionResult[];

export const verifiedResults = competitionResults.filter(
  (result): result is (typeof competitionResults)[number] & VerifiedCompetitionResult =>
    result.status === "verified"
);
