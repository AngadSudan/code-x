import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import cloudinaryService from "../service/Cloudinary.service";
import prismaClient from "../utils/prisma";
import type { updateOrganization, updateInterviewer, createInterviewer } from "../utils/type";

class OrganizationController {
  async OrgProfilePicUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      if(!file) throw new Error("No file found");
      const userId = req.user?.id;
      if(!userId) throw new Error("UserId is required");

      const uniqueFileName = `${file.originalname} Profile-Picture ${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(file, "Profile-Picture", uniqueFileName);

      if(!fileLink) throw new Error("Upload Failed");

      const updatedProfilePic = await prismaClient.organization.update({
        where:{
          id:userId,
        },
        data:{
          profileUrl: fileLink,
        }
      });

      if(!updatedProfilePic) throw new Error("Unable to update Profile Picture");

      return res.status(200).json(
        apiResponse(200, "Updated Profile Picture", null),
      )
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async OrgProfileBannerUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      if(!file) throw new Error("No file found");
      const userId = req.user?.id;

      if(!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname} Banner ${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(file, "Banner", uniqueFileName);
      if(!fileLink) throw new Error("Upload failed");

      const updatedOrgBanner = await prismaClient.organization.update({
        where:{
          id:userId,
        },
        data:{
          bannerUrl: fileLink,
        }
      });
      if(!updatedOrgBanner) throw new Error("Unable to Update banner");

      return res.status(200).json(
        apiResponse(200, "Updated banner", null),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateOrganizationInfo(req: Request, res: Response) {
    try {
      const data = req.body as updateOrganization;
      const userId = req.user?.id;
      if(!userId) throw new Error("UserId is required");
      
      if(!data.name && !data.tagline) throw new Error("At least oe field is required");

      const dbOrganization = await prismaClient.organization.findFirst({
        where:{
          id:userId,
        }
      })

      if(!dbOrganization) throw new Error("Db Organiszation");

      const updatedOrganization = await prismaClient.organization.update({
        where:{
          id: userId,
        },
        data:{
          name: data.name ?? dbOrganization.name,
          tagline: data.tagline ?? dbOrganization.tagline,
        }
      });

      if(!dbOrganization) throw new Error("Unable to update Organization")

      return res.status(200).json(
        apiResponse(200, "Updated Organization!", null),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async addInterviewer(req: Request, res: Response) {
    try {
      const data = req.body as createInterviewer;
      const userId = req.user?.id;

      if(!userId) throw new Error("UserId is required");

      if(!data.name || !data.username || !data.email || !data.password){
        throw new Error("All fields are required");
      }

      const newInterviewer = await prismaClient.interviewer.create({
        data:{
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          orgId: userId,
        }
      });
      if(!newInterviewer) throw new Error("Unable to create interviewer");

      return res.status(200).json(
        apiResponse(200,"Created Interviewer", null),
      )
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateInterviewerDetail(req: Request, res: Response) {
    try {
      const data = req.body as updateInterviewer;
      const userId = req.user?.id;
      
      if(!userId) throw new Error("UserId is required");

      if(!data.headline && !data.name && !data.userInfo){
        throw new Error("At least one field is required");
      }

      const db_Interviewer = await prismaClient.interviewer.findFirst({
        where:{
          orgId: userId,
        }
      });
      if(!db_Interviewer) throw new Error("Db interviewer not found");

      const updatedInterviewer = await prismaClient.interviewer.update({
        where:{
          id: db_Interviewer.id,
        },
        data:{
          name: data.name ?? db_Interviewer.name,
          userInfo: data.userInfo ?? db_Interviewer.userInfo,
          headline: data.headline ?? db_Interviewer.headline,
        }
      });

      if(!updatedInterviewer) throw new Error("Unable to update Interviewer");

      return res.status(200).json(
        apiResponse(200, "Updated Interviewer", null),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async removeInterviewer(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if(!userId) throw new Error("userId is required");

      const deletedInterviewer = await prismaClient.interviewer.delete({
        where:{
          id: userId,
        }
      });
      if(!deletedInterviewer) throw new Error("Unable to delete");

      return res.status(200).json(
        apiResponse(200, "Deleted Interviewer", null),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async InterviewerProfilePicUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      const userId = req.user?.id;
      if(!userId) throw new Error("userId is required");

      const uniqueFileName = `${file?.originalname} Profile-Picture ${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(file, "Profile-Picture", uniqueFileName);
      if(!fileLink) throw new Error("Unable to upload file");

      const updatedProfilePic = await prismaClient.interviewer.update({
        where:{
          id: userId,
        },
        data:{
          profileUrl: fileLink,
        }
      });

      if(!updatedProfilePic) throw new Error("Unable to update Profile Picture");

      return res.status(200).json(
        apiResponse(200, "Updated Profile Picture", null),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async InterviewerProfileBannerUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      const userId = req.user?.id;
      if(!userId) throw new Error("userId is required");

      const uniqueFileName = `${file?.originalname} Banner ${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(file, "Banner", uniqueFileName);
      if(!fileLink) throw new Error("Unable to upload file");

      const updatedBanner = await prismaClient.interviewer.update({
        where:{
          id: userId,
        },
        data:{
          bannerUrl: fileLink,
        }
      });

      if(!updatedBanner) throw new Error("Unable to update Banner");

      return res.status(200).json(
        apiResponse(200, "Updated banner", null),
      );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new OrganizationController();
