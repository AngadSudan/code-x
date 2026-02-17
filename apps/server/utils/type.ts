export interface JwtPayload {
    id: string;
    type:
    | "ORGANIZATION"
    | "INTERVIEWER"
    | "USER"
}
export interface CreateInterviewerBody {
    name: string,
    email: string,
    username: string,
    orgId: string,
    password: string,
}
export interface UpdateInterviewerBody {
    name?: string,
    email?: string,
    username?: string,
    password?: string,
}
export interface CreateUserBody {
    name: string,
    email: string,
    username: string,
    password: string,

}
export interface UpdateUserBody {
    name?: string,
    email?: string,
    username?: string,
    password?: string,
}
export interface CreateOrganisationBody {
    name: string,
    email: string,
    username: string,
    password: string,
    tagline: string,

}
export interface UpdateOrganisationBody {
    name?: string,
    email?: string,
    username?: string,
    password?: string,
    tagline?: string,
}

export interface UpdateUser{
    name?: string,
    userInfo?: string,
    headline?: string,
}

export interface createExperience{
    companyName: string,
    jobTitle: string,
    jobDescription: string,
    offerletter?: string,
    completionCertificate?: string,
    startDate: Date,
    endDate?: Date,
    isOngoing: "ONGOING" | "COMPLETED",
    jobType: "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE",
}

export interface updateExperience{
    companyName?: string,
    jobTitle?: string,
    jobDescription?: string,
    startDate?: Date,
    endDate?: Date,
    isOngoing?: "ONGOING" | "COMPLETED",
    jobType?: "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE",
}

export interface updateOrganization{
    name?: string,
    tagline?: string,
}

export interface updateInterviewer{
    name?: string,
    userInfo?: string,
    headline?: string,
}

export interface createInterviewer{
    name: string,
    username: string,
    email: string,
    password: string,
}