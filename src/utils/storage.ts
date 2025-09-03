import { Competition, Challenge, User, RankingEntry } from "@/types";

// Storage keys
const STORAGE_KEYS = {
  USER: 'ctf_user',
  COMPETITIONS: 'ctf_competitions',
  CHALLENGES: 'ctf_challenges',
  RANKING: 'ctf_ranking'
} as const;

// Mock competitions data
const MOCK_COMPETITIONS: Competition[] = [
  {
    id: "cyber-championship-2024",
    name: "Cyber Championship 2024",
    code: "CYBER2024",
    description: "Competição nacional de cibersegurança",
    startDate: "2024-01-15",
    endDate: "2024-01-30",
    isActive: true
  },
  {
    id: "university-ctf",
    name: "University CTF",
    code: "UNICTY",
    description: "CTF universitário - nível iniciante",
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    isActive: true
  },
  {
    id: "pro-hacker-challenge",
    name: "Pro Hacker Challenge",
    code: "PROHACK",
    description: "Desafio avançado para profissionais",
    startDate: "2024-02-10",
    endDate: "2024-02-25",
    isActive: true
  }
];

// Mock challenges data
const MOCK_CHALLENGES: Challenge[] = [
  // Cyber Championship 2024
  { id: 1, name: "SQL Injection 101", category: "Web", points: 150, solved: false, competitionId: "cyber-championship-2024" },
  { id: 2, name: "Buffer Overflow Basic", category: "Pwn", points: 200, solved: true, competitionId: "cyber-championship-2024" },
  { id: 3, name: "Caesar Cipher", category: "Crypto", points: 100, solved: true, competitionId: "cyber-championship-2024" },
  { id: 4, name: "Reverse Engineering", category: "Rev", points: 300, solved: false, competitionId: "cyber-championship-2024" },
  { id: 5, name: "Network Analysis", category: "Forensics", points: 250, solved: false, competitionId: "cyber-championship-2024" },
  
  // University CTF
  { id: 6, name: "XSS Challenge", category: "Web", points: 175, solved: false, competitionId: "university-ctf" },
  { id: 7, name: "Base64 Decode", category: "Crypto", points: 50, solved: true, competitionId: "university-ctf" },
  { id: 8, name: "Simple Rev", category: "Rev", points: 125, solved: false, competitionId: "university-ctf" },
  
  // Pro Hacker Challenge
  { id: 9, name: "Advanced RCE", category: "Pwn", points: 500, solved: false, competitionId: "pro-hacker-challenge" },
  { id: 10, name: "Crypto Master", category: "Crypto", points: 400, solved: false, competitionId: "pro-hacker-challenge" },
  { id: 11, name: "Memory Forensics", category: "Forensics", points: 450, solved: false, competitionId: "pro-hacker-challenge" }
];

// Mock ranking data
const MOCK_RANKING: RankingEntry[] = [
  { position: 1, team: "TeamCyber", score: 1250, competitionId: "cyber-championship-2024" },
  { position: 2, team: "HackMasters", score: 1100, competitionId: "cyber-championship-2024" },
  { position: 3, team: "SecureSquad", score: 950, competitionId: "cyber-championship-2024" },
  { position: 4, team: "user123", score: 300, competitionId: "cyber-championship-2024" },
  { position: 5, team: "ByteWarriors", score: 700, competitionId: "cyber-championship-2024" },
];

// Initialize localStorage with mock data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.COMPETITIONS)) {
    localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify(MOCK_COMPETITIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHALLENGES)) {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(MOCK_CHALLENGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RANKING)) {
    localStorage.setItem(STORAGE_KEYS.RANKING, JSON.stringify(MOCK_RANKING));
  }
};

// User operations
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

export const clearUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Competition operations
export const getCompetitions = (): Competition[] => {
  const competitions = localStorage.getItem(STORAGE_KEYS.COMPETITIONS);
  return competitions ? JSON.parse(competitions) : [];
};

export const getCompetitionByCode = (code: string): Competition | null => {
  const competitions = getCompetitions();
  return competitions.find(comp => comp.code.toLowerCase() === code.toLowerCase()) || null;
};

export const getUserCompetitions = (user: User): Competition[] => {
  const allCompetitions = getCompetitions();
  return allCompetitions.filter(comp => user.competitions.includes(comp.id));
};

// Challenge operations
export const getChallenges = (): Challenge[] => {
  const challenges = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
  return challenges ? JSON.parse(challenges) : [];
};

export const getChallengesByCompetition = (competitionId: string): Challenge[] => {
  const challenges = getChallenges();
  return challenges.filter(challenge => challenge.competitionId === competitionId);
};

export const updateChallenge = (challengeId: number, updates: Partial<Challenge>): void => {
  const challenges = getChallenges();
  const updatedChallenges = challenges.map(challenge => 
    challenge.id === challengeId ? { ...challenge, ...updates } : challenge
  );
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(updatedChallenges));
};

// Ranking operations
export const getRankingByCompetition = (competitionId: string): RankingEntry[] => {
  const ranking = localStorage.getItem(STORAGE_KEYS.RANKING);
  const allRanking = ranking ? JSON.parse(ranking) : [];
  return allRanking.filter((entry: RankingEntry) => entry.competitionId === competitionId);
};

// User competition management
export const addUserToCompetition = (user: User, competitionId: string): User => {
  if (!user.competitions.includes(competitionId)) {
    const updatedUser = {
      ...user,
      competitions: [...user.competitions, competitionId]
    };
    saveUser(updatedUser);
    return updatedUser;
  }
  return user;
};

export const removeUserFromCompetition = (user: User, competitionId: string): User => {
  const updatedUser = {
    ...user,
    competitions: user.competitions.filter(id => id !== competitionId)
  };
  saveUser(updatedUser);
  return updatedUser;
};