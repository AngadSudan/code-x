export interface JwtPayload {
  id: string;
  type: "ORGANIZATION" | "INTERVIEWER" | "USER";
}
export interface CreateInterviewerBody {
  name: string,
  email: string,
  username: string,
  organizationId: string,
  password: string,
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

export interface SuiteCreation {
  name: string;
  startDate: Date;
  endDate: Date;
  publishStatus: "NOT_PUBLISHED" | "PUBLISHED";
}

export interface SuiteRound {
  name: string;
  description: string;
  roundType: "DSA" | "LIVE_PROJECT" | "HR" | "OTHER";
  duration: string;
}
