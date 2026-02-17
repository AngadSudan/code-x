import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import generateSlug from "../utils/slug";
import cacheClient from "../utils/redis";
class InterviewController {
  // interview
  async createInterview(req: Request, res: Response) {
    try {
      const roundCandidateId = req.params.id;
      const userId = req.user?.id;

      if (!roundCandidateId) throw new Error("round candidate ID not found");
      if (req.user?.type === "USER") throw new Error("unAuthorized");

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

      if (!dbRoundCandidate) throw new Error("round candidate not found");

      const dbInterview = await prismaClient.interview.findUnique({
        where: {
          roundCandidateId: dbRoundCandidate.id,
        },
      });

      if (dbInterview) throw new Error("interview already exists");

      await prismaClient.interview.create({
        data: {
          roundCandidateId: dbRoundCandidate.id,
          interviewRoundId: dbRoundCandidate.roundId,
          createdBy: dbUser?.id,
          slug: generateSlug(),
        },
      });

      return res.status(200).json(apiResponse(200, "interview created", null));
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

      const dbRound = await prismaClient.roundCandidate.findMany({
        where: {
          roundId: roundId as string,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "interview Round fetched", null));
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
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
