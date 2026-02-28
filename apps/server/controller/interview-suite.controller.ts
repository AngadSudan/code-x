import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import * as InterviewTypes from "../utils/type";
import cacheClient from "../utils/redis";
import externalPlatformService from "../service/external-platform.service";

const MAX_PAGE_SIZE = 100;
class InterviewSuiteController {
  async createInterviewSuite(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const jobListingId = req.params.id;
      const data: InterviewTypes.SuiteCreation = req.body;

      if (!userId) throw new Error("userId is required");
      if (!jobListingId) throw new Error("joblisting missing");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: { id: userId },
      });
      if (!dbUser) throw new Error("no interviewer found");

      const dbJobListing = await prismaClient.jobListing.findUnique({
        where: { id: jobListingId as string },
      });
      if (!dbJobListing) throw new Error("no such joblisting found");
      if (dbJobListing.organizationId != dbUser.orgId)
        throw new Error("unAuthorized to make these changes");

      const dbInterviewSuite = await prismaClient.interviewSuite.findUnique({
        where: { jobListingId: dbJobListing.id },
      });
      if (dbInterviewSuite)
        throw new Error("A job suite for this listing already exists");

      const createdSuite = await prismaClient.interviewSuite.create({
        data: {
          name: data.name,
          jobListingId: dbJobListing.id,
          startDate: data.startDate,
          endDate: data.endDate,
          creatorId: dbUser.id,
          publishStatus: data.publishStatus ?? "NOT_PUBLISHED",
          orgId: dbUser.orgId,
        },
      });

      if (!createdSuite) throw new Error("error creating interview suite");

      await cacheClient.invalidateCache(
        `/interview-suite/company/${dbUser.orgId}`,
      );

      return res
        .status(200)
        .json(apiResponse(200, "interview suite created", createdSuite));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateInterviewSuite(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const suiteId = req.params.id;
      const data: Partial<InterviewTypes.SuiteCreation> = req.body;

      if (!userId) throw new Error("userId is required");
      if (!suiteId) throw new Error("suiteId is  missing");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: { id: userId },
      });
      if (!dbUser) throw new Error("no interviewer found");

      const dbInterviewSuite = await prismaClient.interviewSuite.findUnique({
        where: { id: suiteId as string },
      });

      if (!dbInterviewSuite) throw new Error("No interviewSuite found");

      const updatedSuite = await prismaClient.interviewSuite.update({
        where: {
          id: dbInterviewSuite.id,
        },
        data: {
          name: data.name ?? dbInterviewSuite.name,
          startDate: data.startDate ?? dbInterviewSuite.startDate,
          endDate: data.endDate ?? dbInterviewSuite.endDate,
        },
        select: {
          name: true,
          startDate: true,
          endDate: true,
          publishStatus: true,
          organization: {
            select: {
              name: true,
              email: true,
              username: true,
            },
          },
          jobListing: {
            select: {
              jobDescription: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      if (!updatedSuite) throw new Error("error updating interview suite");
      await cacheClient.invalidateCache(`/interview-suit/${suiteId}`);
      await cacheClient.invalidateCache(
        `/interview-suite/company/${dbUser.orgId}`,
      );
      return res
        .status(200)
        .json(apiResponse(200, "interview suite updated", updatedSuite));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateSuiteState(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const suiteId = req.params.id;

      if (!userId) throw new Error("userId is required");
      if (!suiteId) throw new Error("suiteId is  missing");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: { id: userId },
      });
      if (!dbUser) throw new Error("no interviewer found");

      const dbInterviewSuite = await prismaClient.interviewSuite.findUnique({
        where: { id: suiteId as string },
      });

      if (!dbInterviewSuite) throw new Error("No interviewSuite found");

      const updatedSuite = await prismaClient.interviewSuite.update({
        where: {
          id: dbInterviewSuite.id,
        },
        data: {
          publishStatus:
            dbInterviewSuite.publishStatus === "PUBLISHED"
              ? "NOT_PUBLISHED"
              : "PUBLISHED",
        },
        select: {
          name: true,
          startDate: true,
          endDate: true,
          publishStatus: true,
          organization: {
            select: {
              name: true,
              email: true,
              username: true,
            },
          },
          jobListing: {
            select: {
              jobDescription: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      if (!updatedSuite) throw new Error("error updating interview suite");
      await cacheClient.invalidateCache(`/interview-suit/${suiteId}`);
      await cacheClient.invalidateCache(
        `/interview-suite/company/${dbUser.orgId}`,
      );
      return res
        .status(200)
        .json(apiResponse(200, "interview suite updated", updatedSuite));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteInterviewSuite(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const suiteId = req.params.id;

      if (!userId) throw new Error("userId is required");
      if (!suiteId) throw new Error("suiteId is  missing");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: { id: userId },
      });
      if (!dbUser) throw new Error("no interviewer found");

      const dbInterviewSuite = await prismaClient.interviewSuite.findUnique({
        where: { id: suiteId as string },
      });

      if (!dbInterviewSuite) throw new Error("No interviewSuite found");

      const deletedSuite = await prismaClient.interviewSuite.delete({
        where: {
          id: dbInterviewSuite.id,
        },
      });

      if (!deletedSuite) throw new Error("error deleting interview suite");
      await cacheClient.invalidateCache(`/interview-suit/${suiteId}`);
      await cacheClient.invalidateCache(
        `/interview-suite/company/${dbUser.orgId}`,
      );
      return res
        .status(200)
        .json(apiResponse(200, "interview suite deleted", deletedSuite));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getInterviewSuiteById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const suiteId = req.params.id;

      if (!userId) throw new Error("userId is required");
      if (!suiteId) throw new Error("suiteId is  missing");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const cachedResponse = await cacheClient.getCache(
        `/interview-suit/${suiteId}`,
      );
      if (cachedResponse) {
        return res
          .status(200)
          .json(
            apiResponse(
              200,
              "interview suite fetched",
              JSON.parse(cachedResponse),
            ),
          );
      }

      const dbUser = await prismaClient.interviewer.findUnique({
        where: { id: userId },
      });
      if (!dbUser) throw new Error("no interviewer found");

      const dbInterviewSuite = await prismaClient.interviewSuite.findUnique({
        where: { id: suiteId as string },
        select: {
          name: true,
          startDate: true,
          endDate: true,
          publishStatus: true,
          organization: {
            select: {
              name: true,
              email: true,
              username: true,
            },
          },
          jobListing: {
            select: {
              jobDescription: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      if (!dbInterviewSuite) throw new Error("No interviewSuite found");

      await cacheClient.setCache(
        `/interview-suit/${suiteId}`,
        JSON.stringify(dbInterviewSuite),
      );

      return res
        .status(200)
        .json(apiResponse(200, "interview suite fetched", dbInterviewSuite));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAllCompanyInterviewSuite(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("userId is missing");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("user not found");

      const cachedInterviewSuite = await cacheClient.getCache(
        `/interview-suite/company/${dbUser.orgId}`,
      );
      if (cachedInterviewSuite) {
        return res
          .status(200)
          .json(
            apiResponse(
              200,
              "interview suite fetched",
              JSON.parse(cachedInterviewSuite),
            ),
          );
      }
      // TODO: add a check for interviewer vs organization
      const dbInterviewSuite = await prismaClient.interviewSuite.findMany({
        where: {
          OR: [{ orgId: dbUser.orgId }, { orgId: dbUser.id }],
        },
      });

      await cacheClient.setCache(
        `/interview-suite/company/${dbUser.orgId}`,
        JSON.stringify(dbInterviewSuite || []),
      );

      return res
        .status(200)
        .json(apiResponse(200, "interview suite fetched", dbInterviewSuite));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  // interview-round
  async createInterviewRound(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const suiteId = req.params.id;
      const data: InterviewTypes.SuiteRound = req.body;

      if (!userId) throw new Error("no userID found");
      if (!suiteId) throw new Error("no suiteId found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: {
          id: userId,
        },
      });
      if (!dbUser) throw new Error("no such user found");

      const dbSuite = await prismaClient.interviewSuite.findUnique({
        where: { id: suiteId as string },
      });
      if (!dbSuite) throw new Error("no such dbSuite found");

      const createdRound = await prismaClient.interviewSuiteRound.create({
        data: {
          name: data.name,
          description: data.description,
          roundType: data.roundType,
          duration: data.duration,
          suiteId: dbSuite.id,
        },
      });

      if (!createdRound) throw new Error("interview round not created");

      await cacheClient.invalidateCache(`/interview/${dbSuite.id}/rounds`);

      return res
        .status(200)
        .json(apiResponse(200, "interview round created", createdRound));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateInterviewRound(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const roundId = req.params.id;
      const data: Partial<InterviewTypes.SuiteRound> = req.body;

      if (!userId) throw new Error("no userID found");
      if (!roundId) throw new Error("no roundId found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: {
          id: userId,
        },
      });
      if (!dbUser) throw new Error("no such user found");

      const dbRound = await prismaClient.interviewSuiteRound.findUnique({
        where: { id: roundId as string },
      });
      if (!dbRound) throw new Error("no such dbSuite found");

      const updatedRound = await prismaClient.interviewSuiteRound.update({
        where: {
          id: dbRound.id,
        },
        data: {
          name: data.name ?? dbRound.name,
          description: data.description ?? dbRound.description,
          roundType: data.roundType ?? dbRound.roundType,
          duration: data.duration ?? dbRound.duration,
        },
      });

      if (!updatedRound) throw new Error("interview round not updated");

      await cacheClient.invalidateCache(
        `/interview/${updatedRound.suiteId}/rounds`,
      );
      await cacheClient.invalidateCache(
        `/interview/${updatedRound.suiteId}/rounds/${dbRound.id}`,
      );

      return res
        .status(200)
        .json(apiResponse(200, "interview round not updated", updatedRound));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteInterviewRound(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const roundId = req.params.id;

      if (!userId) throw new Error("no userID found");
      if (!roundId) throw new Error("no roundId found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: {
          id: userId,
        },
      });
      if (!dbUser) throw new Error("no such user found");

      const dbRound = await prismaClient.interviewSuiteRound.findUnique({
        where: { id: roundId as string },
      });
      if (!dbRound) throw new Error("no such dbSuite found");

      const deletedRound = await prismaClient.interviewSuiteRound.delete({
        where: {
          id: dbRound.id,
        },
      });

      if (!deletedRound) throw new Error("interview round not deleted");

      await cacheClient.invalidateCache(
        `/interview/${deletedRound.suiteId}/rounds`,
      );
      await cacheClient.invalidateCache(
        `/interview/${deletedRound.suiteId}/rounds/${dbRound.id}`,
      );

      return res
        .status(200)
        .json(apiResponse(200, "interview round deleted", deletedRound));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAllInterviewRoundBySuite(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const suiteId = req.params.id;

      if (!userId) throw new Error("no userID found");
      if (!suiteId) throw new Error("no suiteId found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: {
          id: userId,
        },
      });
      if (!dbUser) throw new Error("no such user found");

      const dbSuite = await prismaClient.interviewSuite.findUnique({
        where: { id: suiteId as string },
      });
      if (!dbSuite) throw new Error("no such dbSuite found");

      const cachedRounds = await cacheClient.getCache(
        `/interview/${dbSuite.id}/rounds`,
      );
      if (cachedRounds) {
        return res
          .status(200)
          .json(
            apiResponse(
              200,
              "rounds fetched successfully",
              JSON.parse(cachedRounds),
            ),
          );
      }

      const dbRounds = await prismaClient.interviewSuiteRound.findMany({
        where: {
          suiteId: dbSuite.id,
        },
      });

      await cacheClient.setCache(
        `/interview/${dbSuite.id}/rounds`,
        JSON.stringify(dbRounds || []),
      );

      return res
        .status(200)
        .json(apiResponse(200, "rounds fetched successfully", dbRounds));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getInterviewRoundById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const roundId = req.params.id;

      if (!userId) throw new Error("no userID found");
      if (!roundId) throw new Error("no roundId found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbUser = await prismaClient.interviewer.findUnique({
        where: {
          id: userId,
        },
      });
      if (!dbUser) throw new Error("no such user found");

      const dbRound = await prismaClient.interviewSuiteRound.findUnique({
        where: { id: roundId as string },
      });
      if (!dbRound) throw new Error("no such dbSuite found");

      // const cachedRound = await cacheClient.getCache(
      //   `/interview/${dbRound.suiteId}/rounds/${dbRound.id}`,
      // );
      // if (cachedRound) {
      //   return res
      //     .status(200)
      //     .json(apiResponse(200, "interview round fetched", cachedRound));
      // }

      const interviewRound = await prismaClient.interviewSuiteRound.findUnique({
        where: { id: dbRound.id },
        include: {
          suite: true,
        },
      });

      if (!interviewRound) throw new Error("no such interview Round found");

      await cacheClient.setCache(
        `/interview/${dbRound.suiteId}/rounds/${dbRound.id}`,
        JSON.stringify(interviewRound),
      );

      return res
        .status(200)
        .json(apiResponse(200, "interview round fetched", interviewRound));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  // invite-job-application for interview
  async getAllApplication(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const suiteId = req.params.id;
      const pageNumber = Number(req.query.page) || 0;
      console.log(pageNumber);
      if (!userId) throw new Error("userId not found");
      if (!suiteId) throw new Error("suiteId not found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      let dbUser;
      if (req.user?.type === "INTERVIEWER") {
        dbUser = await prismaClient.interviewer.findUnique({
          where: { id: userId },
        });
      } else {
        dbUser = await prismaClient.organization.findUnique({
          where: { id: userId },
        });
      }

      const dbSuite = await prismaClient.interviewSuite.findUnique({
        where: { id: suiteId as string },
      });

      if (!dbSuite) throw new Error("suite not found!");

      if (!dbUser) throw new Error("db user not found");
      const dbJobListing = await prismaClient.jobListing.findUnique({
        where: { id: dbSuite.jobListingId as string },
      });
      if (!dbJobListing) throw new Error("job listing not found");

      // const cachedData = await cacheClient.getCache(
      //   `/job-listing/${dbJobListing?.id}/application?pageNumber=${pageNumber}`,
      // );
      // if (cachedData) {
      //   return res
      //     .status(200)
      //     .json(
      //       apiResponse(200, "applications fetched", JSON.parse(cachedData)),
      //     );
      // }
      const applicationCount = await prismaClient.jobApplication.count({
        where: { jobListingId: dbJobListing.id },
      });

      const totalPages = Math.floor(applicationCount / MAX_PAGE_SIZE) + 1;

      const data = await prismaClient.jobApplication.findMany({
        where: {
          jobListingId: dbJobListing.id,
        },
        select: {
          id: true,
          resume: true,
          currentStatus: true,
          createdAt: true,
          candidate: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        skip: MAX_PAGE_SIZE * pageNumber,
        take: MAX_PAGE_SIZE,
      });

      await cacheClient.setCache(
        `/job-listing/${dbJobListing?.id}/application?pageNumber=${pageNumber}`,
        JSON.stringify(data),
      );

      return res
        .status(200)
        .json(apiResponse(200, "applications fetched", { data, totalPages }));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getApplicationById(req: Request, res: Response) {
    try {
      const applicationId = req.params.id;
      const userId = req.user?.id;

      if (!applicationId) throw new Error("applicationId not found");
      if (!userId) throw new Error("userId not found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      let dbUser;
      if (req.user?.type === "INTERVIEWER") {
        dbUser = await prismaClient.interviewer.findUnique({
          where: { id: applicationId as string },
        });
      } else {
        dbUser = await prismaClient.organization.findUnique({
          where: { id: applicationId as string },
        });
      }

      const dbApplication = await prismaClient.jobApplication.findUnique({
        where: {
          id: applicationId as string,
        },
      });
      if (!dbApplication) throw new Error("Job application not found");

      const dbCandidate = await prismaClient.user.findUnique({
        where: { id: dbApplication.candidateId },
        include: {
          userExperiences: true,
        },
      });

      if (!dbCandidate) throw new Error("failed to fetch Information");

      return res.status(200).json(
        apiResponse(200, "application Fetched", {
          userInfo: dbCandidate,
          application: dbApplication,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getPlatformInformation(req: Request, res: Response) {
    try {
      const { url }: { url: InterviewTypes.UrlMapping } = req.body;

      let leetcodeUrl: any = url.leetcodeUrl.split("/");
      leetcodeUrl =
        leetcodeUrl[leetcodeUrl.length - 1] ||
        leetcodeUrl[leetcodeUrl.length - 2];
      let leetCodeObject;
      if (leetcodeUrl) {
        leetCodeObject =
          await externalPlatformService.getLeetCodeInfo(leetcodeUrl);
      }

      let githubUrl: any = url.githubUrl.split("/");
      githubUrl =
        githubUrl[githubUrl.length - 1] || githubUrl[githubUrl.length - 2];

      let githubObject;
      if (githubUrl) {
        githubObject = await externalPlatformService.getGithubInfo(githubUrl);
      }

      let codeforcesUrl: any = url.codeforcesUrl.split("/");
      codeforcesUrl =
        codeforcesUrl[codeforcesUrl.length - 1] ||
        codeforcesUrl[codeforcesUrl.length - 2];
      let codeforcesObject;
      if (codeforcesUrl) {
        codeforcesObject =
          await externalPlatformService.getCodeForcesInfo(codeforcesUrl);
      }

      return res.status(200).json(
        apiResponse(200, "platform data extracted", {
          leetcode: leetCodeObject,
          github: githubObject,
          codeforces: codeforcesObject,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async selectApplicaton(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const jobApplicationId = req.params.id;

      if (!userId) throw new Error("userId not found");
      if (!jobApplicationId) throw new Error("jobApplicationId not found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      let dbUser;
      if (req.user?.type === "INTERVIEWER") {
        dbUser = await prismaClient.interviewer.findUnique({
          where: { id: userId },
        });
      } else {
        dbUser = await prismaClient.organization.findUnique({
          where: { id: userId },
        });
      }

      if (!dbUser) throw new Error("db user not found");

      const dbJobApplication = await prismaClient.jobApplication.findUnique({
        where: { id: jobApplicationId as string },
      });
      if (!dbJobApplication) throw new Error("job listing not found");

      const dbInterviewSuite = await prismaClient.interviewSuite.findUnique({
        where: {
          jobListingId: dbJobApplication.jobListingId,
        },
      });
      if (!dbInterviewSuite) throw new Error("no interview suite found");

      const dbRound = await prismaClient.interviewSuiteRound.findMany({
        where: {
          suiteId: dbInterviewSuite?.id,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 1,
      });

      if (!dbRound || dbRound.length === 0) throw new Error("no valid round");

      //TODO: create the round candidate
      const dbCanidate = await prismaClient.roundCandidate.findFirst({
        where: {
          candidateId: dbJobApplication.candidateId,
          roundId: dbRound[0]?.id!,
        },
      });

      if (dbCanidate) throw new Error("candidate already accepted");

      const createdCandidate = await prismaClient.roundCandidate.create({
        data: {
          candidateId: dbJobApplication.candidateId,
          roundStatus: "PENDING",
          roundId: dbRound[0]?.id!,
        },
      });
      if (!createdCandidate) throw new Error("candidate selection failed");

      const updatedStatus = await prismaClient.jobApplication.update({
        where: { id: dbJobApplication.id },
        data: {
          currentStatus: "ACCEPTED",
        },
      });

      if (!updatedStatus)
        throw new Error("could not update application status");

      return res
        .status(200)
        .json(apiResponse(200, "selected candidate", updatedStatus));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async rejectApplication(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const jobApplicationId = req.params.id;

      if (!userId) throw new Error("userId not found");
      if (!jobApplicationId) throw new Error("jobApplicationId not found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      let dbUser;
      if (req.user?.type === "INTERVIEWER") {
        dbUser = await prismaClient.interviewer.findUnique({
          where: { id: userId },
        });
      } else {
        dbUser = await prismaClient.organization.findUnique({
          where: { id: userId },
        });
      }

      if (!dbUser) throw new Error("db user not found");

      const dbJobApplication = await prismaClient.jobApplication.findUnique({
        where: { id: jobApplicationId as string },
        include: {
          jobListing: true,
        },
      });
      if (!dbJobApplication) throw new Error("job listing not found");

      //TODO: create the round candidate
      const roundCandidate = await prismaClient.roundCandidate.findFirst({
        where: {
          candidateId: dbJobApplication.candidateId,
        },
      });

      if (roundCandidate) {
        await prismaClient.roundCandidate.delete({
          where: {
            id: roundCandidate.id,
          },
        });
      }
      const updatedStatus = await prismaClient.jobApplication.update({
        where: { id: dbJobApplication.id },
        data: {
          currentStatus: "REJECTED",
        },
      });

      if (!updatedStatus)
        throw new Error("could not update application status");

      return res
        .status(200)
        .json(apiResponse(200, "rejected candidate", updatedStatus));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAllSelectedCandidates(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const jobListingId = req.params.id;

      if (!userId) throw new Error("userId not found");
      if (!jobListingId) throw new Error("jobListingId not found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      let dbUser;
      if (req.user?.type === "INTERVIEWER") {
        dbUser = await prismaClient.interviewer.findUnique({
          where: { id: userId },
        });
      } else {
        dbUser = await prismaClient.organization.findUnique({
          where: { id: userId },
        });
      }

      if (!dbUser) throw new Error("db user not found");
      const cachedData = await cacheClient.getCache(
        `/joblisting/${jobListingId}/selected`,
      );
      if (cachedData) {
        return res
          .status(200)
          .json(
            apiResponse(
              200,
              "fetched Selected Candidates",
              JSON.parse(cachedData),
            ),
          );
      }
      const dbJobApplications = await prismaClient.jobListing.findMany({
        where: { id: jobListingId as string },
        include: {
          jobApplications: {
            where: {
              currentStatus: "ACCEPTED",
            },
          },
        },
      });
      await cacheClient.setCache(
        `/joblisting/${jobListingId}/selected`,
        JSON.stringify(dbJobApplications),
      );
      return res
        .status(200)
        .json(
          apiResponse(200, "fetched Selected Candidates", dbJobApplications),
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  // interview-candidate
  async getAllRoundCanddate(req: Request, res: Response) {
    try {
      const roundId = req.params.id;
      const userId = req.user?.id;
      const pageNumber = Number(req.query.page) || 0;

      if (!roundId) throw new Error("roundId not found");
      if (!userId) throw new Error("userId not found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbRound = await prismaClient.interviewSuiteRound.findUnique({
        where: { id: roundId as string },
      });
      if (!dbRound) throw new Error("dbround not found");

      // const cachedData = await cacheClient.getCache(
      //   `/interview-round/${dbRound.id}/candidates`,
      // );
      // if (cachedData) {
      //   return res
      //     .status(200)
      //     .json(
      //       apiResponse(
      //         200,
      //         "fetched round candidates",
      //         JSON.parse(cachedData),
      //       ),
      //     );
      // }
      console.log(dbRound.id);
      const data = await prismaClient.roundCandidate.findMany({
        where: { roundId: dbRound.id },
        select: {
          id: true,
          roundStatus: true,
          candidate: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              resume: true,
              profileUrl: true,
            },
          },
        },
        take: MAX_PAGE_SIZE,
        skip: MAX_PAGE_SIZE * pageNumber,
      });

      await cacheClient.setCache(
        `/interview-round/${dbRound.id}/candidates`,
        JSON.stringify(data),
      );

      return res
        .status(200)
        .json(apiResponse(200, "fetched round candidates", data));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleRoundStatusChange(req: Request, res: Response) {
    try {
      const currentRoundId = req.params.id;
      const roundCandidateId = req.params.candidateId;
      const updatedStatus = req.body.status;
      const userId = req.user?.id;

      if (!currentRoundId) throw new Error("roundId not found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      let dbUser;
      if (req.user?.type === "INTERVIEWER") {
        dbUser = await prismaClient.interviewer.findUnique({
          where: { id: userId },
        });
      } else {
        dbUser = await prismaClient.organization.findUnique({
          where: { id: userId },
        });
      }

      const dbRoundCandidate = await prismaClient.roundCandidate.findUnique({
        where: { id: roundCandidateId as string },
      });
      console.log(dbRoundCandidate);
      if (!dbRoundCandidate) throw new Error("candidate round not found");

      const dbCurrentRound = await prismaClient.interviewSuiteRound.findUnique({
        where: { id: currentRoundId as string },
      });
      console.log(dbCurrentRound);
      if (!dbCurrentRound) throw new Error("invalid current round");

      const dbRound = await prismaClient.interviewSuiteRound.findMany({
        where: { suiteId: dbCurrentRound.suiteId },
        select: { id: true },
      });
      if (updatedStatus === "SELECTED_FOR_NEXT") {
        let nextRound;
        for (let i = 0; i < dbRound.length; i++) {
          if (dbRound[i]?.id === dbCurrentRound.id && i !== dbRound.length) {
            nextRound = dbRound[i + 1]?.id;
          }
        }

        if (!nextRound) {
          const updatedData = await prismaClient.roundCandidate.update({
            where: { id: dbRoundCandidate.id },
            data: {
              roundStatus: "ACCEPTED",
            },
          });

          console.log(updatedData);

          return res
            .status(200)
            .json(apiResponse(200, "selected for job", updatedData));
        }

        const data = await prismaClient.roundCandidate.create({
          data: {
            candidateId: dbRoundCandidate.candidateId,
            roundId: nextRound,
          },
        });

        await prismaClient.roundCandidate.update({
          where: { id: dbRoundCandidate.id },
          data: {
            roundStatus: "SELECTED_FOR_NEXT",
          },
        });
        return res
          .status(200)
          .json(apiResponse(200, "candidates selected", data));
      } else if (updatedStatus === "REJECTED") {
        const updatedData = await prismaClient.roundCandidate.update({
          where: { id: dbRoundCandidate.id },
          data: {
            roundStatus: "REJECTED",
          },
        });

        return res
          .status(200)
          .json(apiResponse(200, "candidates rejected", updatedData));
      } else {
        const updatedData = await prismaClient.roundCandidate.update({
          where: { id: dbRoundCandidate.id },
          data: {
            roundStatus: "PENDING",
          },
        });

        return res
          .status(200)
          .json(apiResponse(200, "candidates pending", updatedData));
      }
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new InterviewSuiteController();
