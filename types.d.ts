import { User as BetterAuthUser } from "better-auth/types";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  description: string;
  totalCopies: number;
  availableCopies: number;
  coverColor: string;
  coverUrl: string;
  video?: string;
  summary: string;
  isLoanedBook?: boolean;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

type InitialPayload = {
  email: string;
  name: string;
};

type UserState = "non-active" | "active";
