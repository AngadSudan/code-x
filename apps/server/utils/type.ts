export interface JwtPayload {
  id: string;
  type: "ORGANIZATION" | "INTERVIEWER" | "USER";
}
export interface CreateInterviewerBody {
  name: string;
  email: string;
  username: string;
  organizationId: string;
  password: string;
}
export interface UpdateInterviewerBody {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
}
export interface CreateUserBody {
  name: string;
  email: string;
  username: string;
  password: string;
}
export interface UpdateUserBody {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
}
export interface CreateOrganisationBody {
  name: string;
  email: string;
  username: string;
  password: string;
  tagline: string;
}
export interface UpdateOrganisationBody {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  tagline?: string;
}

export interface UpdateUser {
  name?: string;
  userInfo?: string;
  headline?: string;
}

export interface createExperience {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  offerletter?: string;
  completionCertificate?: string;
  startDate: Date;
  endDate?: Date;
  isOngoing: "ONGOING" | "COMPLETED";
  jobType: "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE";
}

export interface updateExperience {
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  startDate?: Date;
  endDate?: Date;
  isOngoing?: "ONGOING" | "COMPLETED";
  jobType?: "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE";
  offerletter?: string;
  completionCertificate?: string;
}

export interface updateUserLinks {
  githubUrl?: string;
  linkedinUrl?: string;
  leetcodeUrl?: string;
  codeForcesUrl?: string;
  mediumUrl?: string;
  portfolioUrl?: string;
}

export interface updateOrganization {
  name?: string;
  tagline?: string;
}

export interface updateInterviewer {
  name?: string;
  userInfo?: string;
  headline?: string;
}

export interface createInterviewer {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface SuiteRound {
  name: string;
  description: string;
  roundType: "DSA" | "LIVE_PROJECT" | "HR" | "OTHER";
  duration: string;
}

export interface projectPayload {
  title: string;
  description: string;
  coverImage?: string;
  projectUrl?: string;
  repositoryUrl?: string;
  startDate: Date;
  endDate: Date;
  isOngoing: boolean;
  visibility: "PUBLIC" | "CONNECTIONS" | "PRIVATE";
  publishStatus: "PUBLISHED" | "NOT_PUBLISHED";
  publishTime: Date;
  skills: string[];
  tags: projectTagsPayload[];
  projectMedias: projectMediaPayload[];
}

export interface projectTagsPayload {
  note: string;
  role: "CREATOR" | "CONTRIBUTOR" | "REVIEWER";
  userId: string;
}

export interface projectMediaPayload {
  type: "IMAGE" | "VIDEO" | "DOCUMENT";
  url: string;
  caption?: string;
}

export interface JobListing {
  jobDescription: string;
  jobRole: string;
  jobType: "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE";
  startDate: string;
  endDate: string;
  payment: string;
}

export interface JobApplication {
  resume: string;
  candidateId: string;
  jobListingId: string;
}

export interface InterviewMember {
  name: string;
  username: string;
  role: "HOST" | "CANDIDATE";
}
export interface InterviewMessage {
  message: string;
  author: string;
  timestamp: string;
}
export interface RoomConfig {
  member: Record<string, InterviewMember>;
  chat: InterviewMessage[];
}
export interface SuiteCreation {
  name: string;
  startDate: Date;
  endDate: Date;
  publishStatus: "NOT_PUBLISHED" | "PUBLISHED";
}

export interface UrlMapping {
  mediumUrl: string;
  leetcodeUrl: string;
  githubUrl: string;
  codeforcesUrl: string;
}
