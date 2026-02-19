import type { Request,Response } from "express";
import prismaClient from "../utils/prisma";
import apiResponse from "../utils/apiResponse";
import type { JobListing } from "../utils/type";
import type { JobApplication } from "../utils/type";
import cacheClient from "../utils/redis";
import cloudinaryService from "../service/Cloudinary.service";

class JobListingController{
    async createJobListing(req:Request,res:Response){
        try {
            const orgId = req.user?.id;
            const data:JobListing = req.body;
    
            if(!orgId){
                return res
                .status(400)
                .json(apiResponse(400,"Organization ID not Found!",null));
            }
    
            const jobListing = await prismaClient.jobListing.create({
                data:{
                    jobDescription : data.jobDescription,
                    jobRole : data.jobRole,
                    jobType : data.jobType,
                    startDate : data.startDate,
                    endDate : data.endDate,
                    payment : data.payment,
                    organizationId : orgId,
                }
            });

            await cacheClient.invalidateCache(
                `/jobListing/${orgId}`
            )
    
            return res
            .status(201)
            .json(apiResponse(201,"Job Listing Created SuccessFully !",jobListing));
        } catch (error:any) {
            console.log(error);
            return res
            .status(200)
            .json(apiResponse(500,error.message,null));
        }
    }
    async updateJobListing(req:Request,res:Response){
        try {
            const {jobListId} = req.params;
            const organization = req.user;
            const data = req.body;

            if(organization?.type !== "ORGANIZATION"){
                throw new Error("Not Authorized ! Only Organizations can update Job Listing");
            }

            if(!jobListId){
                return res
                .status(400)
                .json(apiResponse(400,"Job Listing ID is Required",null));
            }
            
            const job = await prismaClient.jobListing.findUnique({
                where:{
                    id:jobListId as string
                }
            });

            if(!job || job.organizationId !== organization.id){
                return res
                .status(403)
                .json(apiResponse(403,"Not Authorized !",null));
            }

            const updateJobList = await prismaClient.jobListing.update({
                where:{
                    id:jobListId as string
                },
                data:{
                    jobDescription : data.jobDescription,
                    jobRole : data.jobRole,
                    jobType : data.jobType,
                    startDate : data.startDate,
                    endDate : data.endDate,
                    payment : data.payment
                }
            });

            await cacheClient.invalidateCache(
                `/jobListing/${organization.id}`
            );

            await cacheClient.invalidateCache(
                `/jobListing/${jobListId}`
            );

            return res
            .status(200)
            .json(apiResponse(200,"Job Listing Updated SuccessFully !",updateJobList));
        } catch (error:any) {
            console.log(error);
            return res
            .status(200)
            .json(apiResponse(500,error.message,null));
        }
    }
    async deleteJobListing(req:Request,res:Response){
        try {
            const {jobListId} = req.params;
            const organization  = req.user;
            const resumeFile = req.file;
    
            if(organization?.type !== "ORGANIZATION") throw new Error("Only Organizations can Delete Job Listing");
    
            if(!jobListId){
                return res
                .status(400)
                .json(apiResponse(400,"Job List ID Missing",null));
            }

            await cacheClient.invalidateCache(
                `/jobListing/${organization.id}`
            );
            await cacheClient.invalidateCache(
                `/jobListing/${jobListId}`
            );

            const job = await prismaClient.jobListing.findUnique({
                where:{
                    id:jobListId as string
                }
            });

            if(!job || job.organizationId !== organization.id){
                return res
                .status(403)
                .json(apiResponse(403,"Not Authorized !",null));
            }
    
            const deleteJobList = await prismaClient.jobListing.delete({
                where:{
                    id:jobListId as string
                }
            });
    
            return res
            .status(200)
            .json(apiResponse(200,"Job Listing Deleted SuccessFully",deleteJobList));
        } catch (error:any) {
            console.log(error);
            return res
            .status(200)
            .json(apiResponse(500,error.message,null));
        }
    }
    async viewApplications(req:Request,res:Response){
        try {
            const user = req.user;
            const {jobListId} = req.params;

            if(!jobListId){
                return res
                .status(400)
                .json(apiResponse(400,"Job Listing ID is Required !",null));
            }
    
            if(user?.type !== "INTERVIEWER" && user?.type !== "ORGANIZATION"){
                return res
                .status(403)
                .json(apiResponse(403,"User not Authorized !",null));
            }

            const job = await prismaClient.jobListing.findUnique({
                where:{
                    id:jobListId as string
                }
            });

            if(!job){
                return res
                .status(404)
                .json(apiResponse(404,"Job Not Found !",null));
            }

            if(user.type === "ORGANIZATION" && job.organizationId !== user.id){
                return res
                .status(403)
                .json(apiResponse(403,"Not your Job Listing",null));
            }

            const cacheJobApplication = await cacheClient.getCache(
                `/jobApplication/${jobListId}`
            );

            if(cacheJobApplication){
                return res
                .status(200)
                .json(apiResponse(200,"Job Applications Fetched (Cache) !",cacheJobApplication));
            }
            
            const jobApplications = await prismaClient.jobApplication.findMany({
                where:{
                    jobListingId:jobListId as string
                },
                include:{
                    candidate:{
                        select:{
                            id:true,
                            name:true,
                            email:true,
                            resume:true
                        }
                    }
                }
            });

            await cacheClient.setCache(
                `/jobApplication/${jobListId}`,
                jobApplications
            );
            
            return res
            .status(200)
            .json(apiResponse(200,"Job Applications for Job Listing Fetched SuccessFully !",jobApplications));
        } catch (error:any) {
            console.log(error);
            return res
            .status(200)
            .json(apiResponse(500,error.message,null));
        }
    }
    async getAllJobListings(req:Request,res:Response){
        try {
            const orgId = req.user?.id;

            if(!orgId){
                return res
                .status(400)
                .json(apiResponse(400,"Organization ID not Found !",null));
            }

            const cacheJobApplication = await cacheClient.getCache(
                `/jobListing/${orgId}`
            );

            if(cacheJobApplication){
                return res
                .status(200)
                .json(apiResponse(200,"Job Applications Fetched (Cache) !",cacheJobApplication));
            }

            const allJobListing = await prismaClient.jobListing.findMany({
                where:{
                    organizationId:orgId
                },
            });

            await cacheClient.setCache(
                `/jobListing/${orgId}`,
                allJobListing
            );

            return res
            .status(200)
            .json(apiResponse(200,"All Job Listings",allJobListing));
        } catch (error:any) {
            console.log(error);
            return res
            .status(200)
            .json(apiResponse(400,error.message,null));
        }
    }
    async getJobListingById(req:Request,res:Response){
        try {
            const {jobId} = req.params;
            
            if(!jobId){
                return res
                .status(400)
                .json(apiResponse(400,"Job ID is Missing !",null));
            }

            const cacheJobListing = await cacheClient.getCache(
                `/jobListing/${jobId}`
            );

            if(cacheJobListing){
                return res
                .status(200)
                .json(apiResponse(200,"Job Listing By Id (Cache)",cacheJobListing));
            }

            const jobListing = await prismaClient.jobListing.findUnique({
                where:{
                    id:jobId as string
                },
                select:{
                    jobDescription:true,
                    jobRole:true,
                    jobType:true,
                    startDate:true,
                    endDate:true,
                    payment:true,
                }
            });

            if(!jobListing){
                return res
                .status(404)
                .json(apiResponse(404,"Job Listing Not Found !",null));
            }

            await cacheClient.setCache(
                `/jobListing/${jobId}`,
                jobListing
            );

            return res
            .status(200)
            .json(apiResponse(200,"Job Listing Fetched SuccessFully !",jobListing));
        } catch (error:any) {
            console.log(error);
            return res
            .status(200)
            .json(apiResponse(500,error.message,null));
        }
    }
    async applyToJob(req:Request,res:Response){
        try {
            const user = req.user;
            const {jobId} = req.params;
            const data:JobApplication = req.body;
            const resumeFile = req.file;
    
            if(user?.type !== "USER"){
                return res
                .status(403)
                .json(apiResponse(403,"Only Users can Apply !",null));
            }

            if(!resumeFile){
                return res
                .status(400)
                .json(apiResponse(400,"Resume is Required !",null));
            }
    
            if(!jobId){
                return res
                .status(400)
                .json(apiResponse(400,"Job ID not Found !",null));
            }
    
            const job = await prismaClient.jobListing.findUnique({
                where:{
                    id:jobId as string
                }
            });
    
            if(!job){
                return res
                .status(404)
                .json(apiResponse(404,"Job Not Found !",null));
            }
            // TODO: CHECK FOR ALREADY EXISTING APPLICATION IF ANY 
            const dbApplication = await prismaClient.jobApplication.findFirst({
                where:{
                    candidateId:user.id,
                    jobListingId:jobId as string
                }
            });

            if(dbApplication){
                return res
                .status(409)
                .json(apiResponse(409,"Application Already Applied !",null));
            }

            const resume = await cloudinaryService.uploadFile(resumeFile,`${resumeFile?.originalname}_Resume_${Date.now()}`,"Resume");

            if(!resume){
                throw new Error("Resume Upload Failed !");
            }

            const jobApplication = await prismaClient.jobApplication.create({
                data:{
                    resume:resume, // would be a file 
                    candidateId:user.id,
                    jobListingId:jobId as string
                }
            });

            await cacheClient.invalidateCache(
                `/jobApplication/${jobId}`
            )
    
            return res
            .status(201)
            .json(apiResponse(201,"Applied to Job SuccessFully !",jobApplication));
        } catch (error:any) {
            console.log(error);
            return res
            .status(200)
            .json(apiResponse(500,error.message,null));
        }
    }
}

export default new JobListingController();