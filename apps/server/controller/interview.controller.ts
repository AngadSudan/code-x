import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import generateSlug from "../utils/slug";
import cacheClient from "../utils/redis";
import videoConfrencingService from "../service/videoConfrencing.service";
class InterviewController {
  // interview
  async createInterview(req: Request, res: Response) {
    try {
      const roundId = await req.params.id;
      const userId = req.user?.id;
      const interviewCandidates: string[] = req.body.candidates;

      if (!roundId) throw new Error("roundId is required");
      if (!userId) throw new Error("userId is required");
      if (req.user?.type === "USER") {
        throw new Error("unauthorized");
      }

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

      const dbRound = await prismaClient.interviewSuiteRound.findUnique({
        where: { id: roundId as string },
      });

      if (!dbRound) throw new Error("dbRound not found");

      const dbRoundCandidates = await prismaClient.roundCandidate.findMany({
        where: { id: { in: interviewCandidates } },
      });

      if (dbRoundCandidates.length !== interviewCandidates.length) {
        throw new Error("Invalid data sent");
      }

      const mappedData = dbRoundCandidates.map((candidate) => {
        return {
          interviewRoundId: dbRound.id,
          createdBy: dbUser.id,
          roundCandidateId: candidate.id,
          slug: generateSlug(),
        };
      });

      const dbInterview = await prismaClient.interview.createMany({
        data: mappedData,
      });

      return res
        .status(200)
        .json(apiResponse(200, "interview created", dbInterview));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getAllRoundInterview(req: Request, res: Response) {
    try {
      const roundId = req.params.id;
      const userId = req.user?.id;

      if (!roundId) throw new Error("roundId not found");
      if (!userId) throw new Error("userId not found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbRound = await prismaClient.interviewSuiteRound.findUnique({
        where: {
          id: roundId as string,
        },
      });

      if (!dbRound) throw new Error("db Round not found!");

      const dbInterview = await prismaClient.interview.findMany({
        where: {
          interviewRoundId: dbRound.id,
        },
        select: {
          slug: true,
          id: true,
          roundCandidate: {
            select: {
              candidate: {
                select: {
                  name: true,
                  username: true,
                  email: true,
                  profileUrl: true,
                },
              },
            },
          },
          interviewStatus: true,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "interview Round fetched", dbInterview));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getInterviewById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const interviewId = req.params.id;

      if (!userId) throw new Error("userId not found");
      let dbUser;
      if (req.user?.type === "USER") {
        dbUser = await prismaClient.user.findUnique({
          where: { id: userId },
        });
      } else {
        dbUser = await prismaClient.interviewer.findUnique({
          where: { id: userId },
        });
      }
      if (!dbUser) throw new Error("user not found");

      const dbInterview = await prismaClient.interview.findUnique({
        where: {
          id: interviewId as string,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "interview fetched", dbInterview));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteInterview(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const interviewId = req.params.id;

      if (!userId) throw new Error("userId not found");
      if (req.user?.type === "USER") throw new Error("unauthorized");

      const dbInterview = await prismaClient.interview.delete({
        where: {
          id: interviewId as string,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "interview deleted", dbInterview));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getUserInterview(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new Error("userId not found");

      const dbUser = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbUser) throw new Error("user not found");

      const dbInterview = await prismaClient.interview.findMany({
        where: {
          roundCandidateId: {
            contains: dbUser.id,
          },
          OR: [
            { interviewStatus: "PENDING" },
            { interviewStatus: "UNDER_PROGRESS" },
          ],
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "interview fetched", dbInterview));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  async startInterview(req: Request, res: Response) {
    try {
      // TODO: create a pod connection and store this in redis
      // key as slug and content - namespace,pod and ingressName
      // alng with this start the meeting
      const interviewId = req.params.id;
      const userId = req.user?.id;

      if (!interviewId) throw new Error("InterviewId not found");
      if (!userId) throw new Error("userId not found");

      const dbInterview = await prismaClient.interview.findUnique({
        where: { id: interviewId as string },
      });

      if (!dbInterview) throw new Error("no such interview found");

      const updatedInterview = await prismaClient.interview.update({
        where: {
          id: dbInterview.id,
        },
        data: {
          interviewStatus: "UNDER_PROGRESS",
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "interview started", updatedInterview));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async joinParticipant(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const body: { role: "host" | "guest"; channelId: string } = req.body;

      let dbUser;
      if (req.user?.type === "INTERVIEWER") {
        dbUser = await prismaClient.interviewer.findUnique({
          where: { id: userId },
        });
      } else {
        dbUser = await prismaClient.user.findUnique({
          where: { id: userId },
        });
      }

      if (!dbUser) throw new Error("user not found");

      // TODO: verify if interview exists
      // const dbInterview = await prismaClient.interview.findFirst({
      //   where:{
      //     slug: body.channelId
      //   }
      // });
      // if(!dbInterview) throw new Error("db Interview not found");
      // if(req.user?.type==="USER"){
      //   //TODO: check if user is invited candidate in this interview
      // }

      const tokenData = await videoConfrencingService.createToken(
        body.channelId,
        dbUser.name,
        body.role,
      );

      return res.status(200).json(apiResponse(200, "user joined", tokenData));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async endInterview(req: Request, res: Response) {
    try {
      const interviewId = req.params.id;
      const userId = req.user?.id;

      if (!interviewId) throw new Error("InterviewId not found");
      if (!userId) throw new Error("userId not found");

      const dbInterview = await prismaClient.interview.findUnique({
        where: { id: interviewId as string },
      });

      if (!dbInterview) throw new Error("no such interview found");

      const updatedInterview = await prismaClient.interview.update({
        where: {
          id: dbInterview.id,
        },
        data: {
          interviewStatus: "COMPLETED",
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "interview completed", updatedInterview));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new InterviewController();
