export interface Challenge {
  id: number;
  name: string;
  category: "Web" | "Crypto" | "Rev" | "Pwn" | "Forensics" | "Misc";
  points: number;
  solved: boolean;
  competitionId: string;
}

export interface Competition {
  id: string;
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  competitions: string[]; // Competition IDs
}

export interface RankingEntry {
  position: number;
  team: string;
  score: number;
  competitionId: string;
}