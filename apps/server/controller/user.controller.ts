import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type {
  UpdateUser,
  createExperience,
  updateExperience,
} from "../utils/type";
import cloudinaryService from "../service/Cloudinary.service";

class UserController {
  async updateUserInfo(req: Request, res: Response) {
    try {
      const data = req.body as UpdateUser;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error("User Id is required");
      }
      // Validated the input
      if (!data.name && !data.headline && !data.userInfo) {
        throw new Error("At least one field is requires");
      }

      // Check for existing user
      const dbUser = await prismaClient.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("Db user not found");

      // Updation of the data
      const updatedUser = await prismaClient.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          name: data.name ?? dbUser.name,
          userInfo: data.userInfo ?? dbUser.userInfo,
          headline: data.headline ?? dbUser.headline,
        },
      });
      // checking if data is updated or not
      if (!updatedUser) throw new Error("Failed User Updation");

      return res.status(200).json(
        apiResponse(200, "User data updated", {
          updatedUser,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleResumeUpload(req: Request, res: Response) {
    try {
      const file = req.file;
      if(!file) throw new Error("No file found");
      const userId = req.user?.id;

      if(!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname} resume ${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(file, "Resume", uniqueFileName);

      if(!fileLink) throw new Error("Upload failed");

      const updateResume = await prismaClient.user.update({
        where:{
          id: userId,
        },
        data:{
          resume: fileLink
        }
      });

      if(!updateResume) throw new Error("Unable to update Resume");

      return res.status(200).json(
        apiResponse(200, "Updated Resume", null),
      );

    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleProfilePicUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      if(!file) throw new Error("No file found");
      const userId = req.user?.id;
      if(!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname} Profile-Picture ${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(file, "ProfilePic", uniqueFileName);
      if(!fileLink) throw new Error("Upload failed");

      const updatedProfilePic = await prismaClient.user.update({
        where:{
          id: userId,
        },
        data:{
          profileUrl: fileLink,
        }
      });

      if(!updatedProfilePic) throw new Error("Unable to  update profile picture");

      return res.status(200).json(
        apiResponse(200, "Updated Profile Picture", null),
      );

    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleProfileBannerUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      if(!file) throw new Error("No file found");
      const userId = req.user?.id;
      if(!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname} Banner ${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(file, "Profile-Banner", uniqueFileName);

      if(!fileLink) throw new Error("Upload failed");

      const updatedBanner = await prismaClient.user.update({
        where:{
          id: userId,
        },
        data:{
          bannerUrl: fileLink,
        }
      });

      if(!updatedBanner) throw new Error("Unable to update Banner");

      return res.status(200).json(
        apiResponse(200, "Updated Banner", null),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getFullProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if(!userId) throw new Error("User id is required");

      const userData = await prismaClient.user.findFirst({
        where:{
          id: userId,
        }
      });

      if(!userData) throw new Error("Unable to fetch user data");

      return res.status(200).json(
        apiResponse(200, "User data found", {
          userData,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async addExperience(req: Request, res: Response) {
    try {
      const data = req.body as createExperience;
      const userId = req.user?.id;

      if (
        !data.companyName ||
        !data.jobTitle ||
        !data.jobDescription ||
        !data.startDate ||
        !data.isOngoing ||
        !data.jobType
      ) {
        throw new Error("At least one field is required");
      }
      if (!userId) throw new Error("User is Required");

      const dbUser = await prismaClient.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("User not found");

      //TODO: handle file upload left
      const createdExperience = await prismaClient.userExperience.create({
        data: {
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          startDate: data.startDate,
          endDate: data.endDate,
          isOngoing: data.isOngoing,
          jobType: data.jobType,
          userId: dbUser.id,
        },
      });

      return res.status(200).json(
        apiResponse(200, "Experience Created", {
          createdExperience,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateExperience(req: Request, res: Response) {
    try {
      const data = req.body as updateExperience;
      const userId = req.user?.id;

      if (!userId) throw new Error("User Id is required");

      if (
        !data.companyName &&
        !data.jobTitle &&
        !data.jobDescription &&
        !data.startDate &&
        !data.endDate &&
        !data.jobType
      ) {
        throw new Error("At least one field is required");
      }

      const dbExperience = await prismaClient.userExperience.findFirst({
        where: {
          userId: userId,
        },
      });
      if (!dbExperience) throw new Error("Db user experience not found");

      const updatedExperience = await prismaClient.userExperience.update({
        where: {
          id: dbExperience.id,
        },
        data: {
          companyName: data.companyName ?? dbExperience.companyName,
          jobTitle: data.jobTitle ?? dbExperience.jobTitle,
          jobDescription: data.jobDescription ?? dbExperience.jobDescription,
          startDate: data.startDate ?? dbExperience.startDate,
          endDate: data.endDate ?? dbExperience.endDate,
          isOngoing: data.isOngoing ?? dbExperience.isOngoing,
          jobType: data.jobType ?? dbExperience.jobType,
        },
      });

      if (!updatedExperience) throw new Error("Failed Experience Updation");

      return res.status(200).json(
        apiResponse(200, "Experience updated", {
          updatedExperience,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteExperience(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if(!userId) throw new Error("User Id is required");

      const dbExperience = await prismaClient.userExperience.findFirst({
        where:{
          userId: userId,
        }
      });

      if(!dbExperience) throw new Error("Db user experience not found");

      const deletedExperience = await prismaClient.userExperience.delete({
        where:{
          id: dbExperience.id,
        }
      });

      if(!deletedExperience) throw new Error("Failed experience deletion");

      return res.status(200).json(
        apiResponse(200, "Experience Deleted", {
          deletedExperience,
        }),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}

export default new UserController();
