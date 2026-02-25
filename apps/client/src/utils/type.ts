export interface Organization {
  id: string;
  name: string;
  username: string;
  email: string;
  tagline: string;
  profileUrl: string;
  bannerUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Interviewer {
  id: string;
  name: string;
  username: string;
  email: string;
  userInfo: string;
  headline: string;
  profileUrl: string;
  bannerUrl: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
  organization: Organization;
}

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  resume: string;
  userInfo: string;
  headline?: string;
  profileUrl: string;
  bannerUrl: string;
  createdAt: Date;
  updatedAt: Date;
  githubOAuth: boolean;
};
export interface InterviewMember {
  param: { id: string };
  userData: Interviewer | User | null;
  isHost: boolean;
}
export interface InterviewInfo {
  appId?: string;
  channelName: string;
  token: string;
  uid: string;
  containerUrl?: string;
}
export interface Message {
  message: string;
  author: string;
  timestamp: string;
}

export interface Suite {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  jobListingId: string;
  creatorId: string;
  orgId: string;
  publishStatus: "NOT_PUBLISHED" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
}

export interface SuiteFilters {
  search: string;
  publishStatus: "ALL" | "PUBLISHED" | "NOT_PUBLISHED";
  startDateFrom?: string;
  startDateTo?: string;
  sortBy: "createdAt" | "startDate" | "endDate" | "name";
  sortOrder: "asc" | "desc";
}
