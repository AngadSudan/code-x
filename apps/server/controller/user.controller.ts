import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type {
  UpdateUser,
  createExperience,
  updateExperience,
  updateUserLinks,
} from "../utils/type";
import cloudinaryService from "../service/Cloudinary.service";
import GithubService from "../service/github.service";
import aiService from "../service/ai.service";
import { parse } from "yaml";

class UserController {
  async updateUserInfo(req: Request, res: Response) {
    try {
      const data = req.body as UpdateUser;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error("User Id is required");
      }

      // Check for existing user
      const dbUser = await prismaClient.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("Db user not found");

      // Update data using trimmed values
      const updatedUser = await prismaClient.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          name: (data.name?.trim() || undefined) ?? dbUser.name,
          userInfo: (data.userInfo?.trim() || undefined) ?? dbUser.userInfo,
          headline: (data.headline?.trim() || undefined) ?? dbUser.headline,
        },
      });
      if (!updatedUser) throw new Error("Failed User Updation");

      return res
        .status(200)
        .json(apiResponse(200, "User data updated", updatedUser));
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }
  async handleResumeUpload(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) throw new Error("No file found");
      const userId = req.user?.id;

      if (!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname}-resume-${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(
        file,
        "Resume",
        uniqueFileName,
      );

      if (!fileLink) throw new Error("Upload failed");

      const updateResume = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          resume: fileLink,
        },
      });
      // TODO: handle resume parsing
      if (!updateResume) throw new Error("Unable to update Resume");

      return res
        .status(200)
        .json(apiResponse(200, "Updated Resume", updateResume));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleResumeDelete(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json(apiResponse(401, "Unauthorized", null));
      }

      const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { resume: true },
      });

      if (!user?.resume) {
        return res
          .status(400)
          .json(apiResponse(400, "No resume to delete", null));
      }

      await cloudinaryService.deleteFile(user.resume);
      const updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: { resume: null },
      });

      return res
        .status(200)
        .json(apiResponse(200, "Resume deleted successfully", updatedUser));
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }
  async handleProfilePicUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) throw new Error("No file found");
      const userId = req.user?.id;
      if (!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname}-Profile-Picture-${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(
        file,
        "ProfilePic",
        uniqueFileName,
      );
      if (!fileLink) throw new Error("Upload failed");

      const updatedProfilePic = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          profileUrl: fileLink,
        },
      });

      if (!updatedProfilePic)
        throw new Error("Unable to  update profile picture");

      return res
        .status(200)
        .json(apiResponse(200, "Updated Profile Picture", updatedProfilePic));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleProfileBannerUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) throw new Error("No file found");
      const userId = req.user?.id;
      if (!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname}-Banner-${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(
        file,
        "Profile-Banner",
        uniqueFileName,
      );

      if (!fileLink) throw new Error("Upload failed");

      const updatedBanner = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          bannerUrl: fileLink,
        },
      });

      if (!updatedBanner) throw new Error("Unable to update Banner");

      return res
        .status(200)
        .json(apiResponse(200, "Updated Banner", updatedBanner));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getFullProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("User id is required");

      const userData = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          profileUrl: true,
          bannerUrl: true,
          headline: true,
          userInfo: true,
          resume: true,
          githubUrl: true,
          linkedinUrl: true,
          leetcodeUrl: true,
          codeForcesUrl: true,
          mediumUrl: true,
          portfolioUrl: true,
          githubOAuth: true,
          userExperiences: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!userData) throw new Error("Unable to fetch user data");

      return res
        .status(200)
        .json(apiResponse(200, "User data found", userData));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getFullProfileBasedonUsername(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      if (!userId) throw new Error("User id is required");

      const userData = await prismaClient.user.findFirst({
        where: {
          username: userId as string,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          profileUrl: true,
          bannerUrl: true,
          headline: true,
          userInfo: true,
          resume: true,
          githubUrl: true,
          linkedinUrl: true,
          leetcodeUrl: true,
          codeForcesUrl: true,
          mediumUrl: true,
          portfolioUrl: true,
          githubOAuth: true,
          userExperiences: {
            orderBy: {
              createdAt: "desc",
            },
          },
          developerGraphs: true,
          projects: {
            take: 3,
          },
        },
      });

      if (!userData) throw new Error("Unable to fetch user data");

      return res
        .status(200)
        .json(apiResponse(200, "User data found", userData));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async addExperience(req: Request, res: Response) {
    try {
      const data = req.body as createExperience;
      const userId = req.user?.id;

      if (!userId) throw new Error("User is required");

      const companyName =
        typeof data.companyName === "string" ? data.companyName.trim() : "";
      const jobTitle =
        typeof data.jobTitle === "string" ? data.jobTitle.trim() : "";
      const jobDescription =
        typeof data.jobDescription === "string"
          ? data.jobDescription.trim()
          : "";

      const VALID_JOB_TYPES = [
        "REMOTE",
        "OFFLINE",
        "HYBRID",
        "FREELANCE",
      ] as const;

      if (!VALID_JOB_TYPES.includes(data.jobType as any)) {
        throw new Error("Invalid job type");
      }

      if (
        !companyName ||
        !jobTitle ||
        !jobDescription ||
        !data.startDate ||
        (data.isOngoing !== "ONGOING" && data.isOngoing !== "COMPLETED")
      ) {
        throw new Error("All required fields must be provided");
      }

      const dbUser = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!dbUser) throw new Error("User not found");

      const createdExperience = await prismaClient.userExperience.create({
        data: {
          companyName,
          jobTitle,
          jobDescription,
          startDate: new Date(data.startDate),
          endDate:
            data.isOngoing === "ONGOING"
              ? null
              : data.endDate
                ? new Date(data.endDate)
                : null,
          isOngoing: data.isOngoing,
          jobType: data.jobType,
          userId: dbUser.id,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "Experience Created", createdExperience));
    } catch (error: any) {
      console.error(error);
      return res.status(400).json(apiResponse(400, error.message, null));
    }
  }
  async updateExperience(req: Request, res: Response) {
    try {
      const data = req.body as updateExperience;
      const userId = req.user?.id;
      const experienceId = req.params.experienceId as string;

      const files = req.files as
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | undefined;
      const offerLetterFile = files?.offerLetter?.[0];
      const completionCertificateFile = files?.completionCertificate?.[0];

      if (!userId) throw new Error("User Id is required");
      if (!experienceId) throw new Error("Experience Id is required");

      const companyName =
        typeof data.companyName === "string"
          ? data.companyName.trim()
          : undefined;
      const jobTitle =
        typeof data.jobTitle === "string" ? data.jobTitle.trim() : undefined;
      const jobDescription =
        typeof data.jobDescription === "string"
          ? data.jobDescription.trim()
          : undefined;
      const jobType =
        typeof data.jobType === "string" ? data.jobType.trim() : undefined;

      const isOngoing =
        data.isOngoing === "ONGOING" || data.isOngoing === "COMPLETED"
          ? data.isOngoing
          : undefined;

      const startDate = data.startDate ? new Date(data.startDate) : undefined;
      if (startDate && Number.isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
      }

      const endDate = data.endDate ? new Date(data.endDate) : undefined;
      if (endDate && Number.isNaN(endDate.getTime())) {
        throw new Error("Invalid end date");
      }

      const offerLetterFromBody =
        typeof data.offerletter === "string" && data.offerletter.trim()
          ? data.offerletter.trim()
          : undefined;

      const completionCertificateFromBody =
        typeof data.completionCertificate === "string" &&
        data.completionCertificate.trim()
          ? data.completionCertificate.trim()
          : undefined;

      if (
        !companyName &&
        !jobTitle &&
        !jobDescription &&
        !startDate &&
        !endDate &&
        !jobType &&
        !isOngoing &&
        !offerLetterFromBody &&
        !completionCertificateFromBody &&
        !offerLetterFile &&
        !completionCertificateFile
      ) {
        throw new Error("At least one field is required");
      }

      const VALID_JOB_TYPES = [
        "REMOTE",
        "OFFLINE",
        "HYBRID",
        "FREELANCE",
      ] as const;
      if (jobType && !VALID_JOB_TYPES.includes(jobType as any)) {
        throw new Error("Invalid job type");
      }

      const dbExperience = await prismaClient.userExperience.findFirst({
        where: {
          id: experienceId,
          userId: userId,
        },
      });

      if (!dbExperience) throw new Error("Db user experience not found");

      let uploadedOfferLetterLink: string | null | undefined;
      if (offerLetterFile) {
        const uniqueFileName = `${offerLetterFile.originalname}-offer-letter-${Date.now()}`;
        uploadedOfferLetterLink = await cloudinaryService.uploadFile(
          offerLetterFile,
          "Offer-Letters",
          uniqueFileName,
        );

        if (!uploadedOfferLetterLink) {
          throw new Error("Failed to upload offer letter");
        }
      }

      let uploadedCompletionCertificateLink: string | null | undefined;
      if (completionCertificateFile) {
        const uniqueFileName = `${completionCertificateFile.originalname}-completion-certificate-${Date.now()}`;
        uploadedCompletionCertificateLink = await cloudinaryService.uploadFile(
          completionCertificateFile,
          "Completion-Certificates",
          uniqueFileName,
        );

        if (!uploadedCompletionCertificateLink) {
          throw new Error("Failed to upload completion certificate");
        }
      }

      const resolvedIsOngoing = isOngoing ?? dbExperience.isOngoing;
      const resolvedEndDate =
        resolvedIsOngoing === "ONGOING"
          ? null
          : endDate !== undefined
            ? endDate
            : dbExperience.endDate;

      const updatedExperience = await prismaClient.userExperience.update({
        where: {
          id: dbExperience.id,
        },
        data: {
          companyName: companyName ?? dbExperience.companyName,
          jobTitle: jobTitle ?? dbExperience.jobTitle,
          jobDescription: jobDescription ?? dbExperience.jobDescription,
          startDate: startDate ?? dbExperience.startDate,
          endDate: resolvedEndDate,
          isOngoing: resolvedIsOngoing,
          jobType: (jobType as any) ?? dbExperience.jobType,
          offerLetter:
            uploadedOfferLetterLink ??
            offerLetterFromBody ??
            dbExperience.offerLetter,
          completionCertifiate:
            uploadedCompletionCertificateLink ??
            completionCertificateFromBody ??
            dbExperience.completionCertifiate,
        },
      });

      if (!updatedExperience) throw new Error("Failed Experience Updation");

      return res
        .status(200)
        .json(apiResponse(200, "Experience updated", updatedExperience));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteExperience(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const experienceId = req.params.experienceId as string;

      if (!userId) {
        return res.status(401).json(apiResponse(401, "Unauthorized", null));
      }

      if (!experienceId) {
        return res
          .status(400)
          .json(apiResponse(400, "Experience ID is required", null));
      }

      const dbExperience = await prismaClient.userExperience.findFirst({
        where: {
          id: experienceId,
          userId: userId, // 🔐 ownership check
        },
      });

      if (!dbExperience) {
        return res
          .status(404)
          .json(apiResponse(404, "Experience not found", null));
      }

      await prismaClient.userExperience.delete({
        where: {
          id: experienceId,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "Experience deleted successfully", null));
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }
  async updateUserPlatformLinks(req: Request, res: Response) {
    try {
      const data = req.body as updateUserLinks;
      const userId = req.user?.id;

      if (!userId) throw new Error("User Id is required");

      if (
        !data.codeForcesUrl &&
        !data.githubUrl &&
        !data.leetcodeUrl &&
        !data.linkedinUrl &&
        data.mediumUrl &&
        data.portfolioUrl
      ) {
        throw new Error("At least one field is required");
      }

      const dbUser = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!dbUser) throw new Error("No User Found in Db");

      const updatedPlatformLinks = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          githubUrl: data.githubUrl ?? dbUser.githubUrl,
          linkedinUrl: data.linkedinUrl ?? dbUser.linkedinUrl,
          leetcodeUrl: data.leetcodeUrl ?? dbUser.leetcodeUrl,
          codeForcesUrl: data.codeForcesUrl ?? dbUser.codeForcesUrl,
          mediumUrl: data.mediumUrl ?? dbUser.mediumUrl,
          portfolioUrl: data.portfolioUrl ?? dbUser.portfolioUrl,
        },
      });

      if (!updatedPlatformLinks) throw new Error("Unable to update Links");

      return res
        .status(200)
        .json(apiResponse(200, "Platform Links updated", updatedPlatformLinks));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getGithubDashboardInsights(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("userId not found");
      const dbUser = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!dbUser) throw new Error("db user not found");
      if (!dbUser.githubToken)
        throw new Error("pleases Connect with github first");

      const gitClient = new GithubService(dbUser.githubToken);
      const getAllRepos = await gitClient.getAllReposName();
      console.log(getAllRepos.length);
      if (getAllRepos?.length === 0) throw new Error("no github data");
      let tech: Set<string> = new Set();
      let repoPromises = [];
      for (let i = 0; i < getAllRepos?.length; i++) {
        const repo = getAllRepos[i];
        repoPromises.push(
          //@ts-ignore
          gitClient.getAllRepoTopicAndLang(repo?.name, repo?.owner),
        );

        repo?.topics.map((topic: string) => {
          tech.add(topic);
        });
      }

      const repoData = await Promise.all(repoPromises);
      for (let i = 0; i < repoData.length; i++) {
        const currentTags = repoData[i]?.tags;
        const currentLanguages = Object.keys(repoData[i]?.languages || {});

        //@ts-ignore
        currentTags?.forEach((tag) => tech.add(tag));
        currentLanguages.forEach((lang) => tech.add(lang));
      }

      console.log(Array.from(tech));

      const response = await aiService.getClassification(Array.from(tech));
      const processing = {
        frontend: 0,
        backend: 0,
        devops: 0,
        systemDesign: 0,
        tools: 0,
      };

      const jsonData = parse(response);

      processing.frontend = Math.round(
        ((Number(jsonData.FRONTEND?.length) || 0) / tech.size) * 100,
      );

      processing.backend = Math.round(
        ((Number(jsonData.BACKEND?.length) || 0) / tech.size) * 100,
      );

      processing.devops = Math.round(
        ((Number(jsonData.DEVOPS?.length) || 0) / tech.size) * 100,
      );

      processing.systemDesign = Math.round(
        ((Number(jsonData.SYSTEM_DESIGN?.length) || 0) / tech.size) * 100,
      );

      processing.tools = Math.round(
        ((Number(jsonData.PROGRAMMING?.length) || 0) / tech.size) * 100,
      );
      console.log(processing);
      const dbGraph = await prismaClient.developerGraph.findFirst({
        where: { userId: dbUser.id },
      });

      let data;
      if (!dbGraph) {
        data = await prismaClient.developerGraph.create({
          data: {
            userId: dbUser.id,
            frontend: processing.frontend,
            backend: processing.backend,
            devops: processing.devops,
            systemDesign: processing.systemDesign,
            tools: processing.tools,
          },
        });
      } else {
        data = await prismaClient.developerGraph.update({
          where: {
            id: dbGraph.id,
          },
          data: {
            frontend:
              processing.frontend === 0
                ? dbGraph.frontend
                : processing.frontend,
            backend:
              processing.backend === 0 ? dbGraph.backend : processing.backend,
            devops:
              processing.devops === 0 ? dbGraph.devops : processing.devops,
            systemDesign:
              processing.systemDesign === 0
                ? dbGraph.systemDesign
                : processing.systemDesign,
            tools: processing.tools === 0 ? dbGraph.tools : processing.tools,
          },
        });
      }

      return res.status(200).json(apiResponse(200, "graph generated", data));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  async getGraph(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("userId not found");
      const dbUser = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!dbUser) throw new Error("db user not found");
      if (!dbUser.githubToken)
        throw new Error("pleases Connect with github first");

      const dbGraph = await prismaClient.developerGraph.findFirst({
        where: { userId: dbUser.id },
      });

      if (!dbGraph) {
        return res.status(200).json(
          apiResponse(200, "graph fetched", {
            isConnected: true,
            graphPoints: [0, 0, 0, 0, 0],
          }),
        );
      }

      return res.status(200).json(
        apiResponse(200, "graph fetched", {
          isConnected: true,
          graphPoints: [
            dbGraph.systemDesign,
            dbGraph.backend,
            dbGraph.frontend,
            dbGraph.tools,
            dbGraph.devops,
          ],
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(
        apiResponse(200, error.message, {
          isConnected: false,
          graphPoints: [0, 0, 0, 0, 0],
        }),
      );
    }
  }
}

export default new UserController();
