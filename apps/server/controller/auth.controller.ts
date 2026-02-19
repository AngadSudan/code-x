import type { Request, Response } from "express";
import type { CreateInterviewerBody, CreateOrganisationBody, CreateUserBody } from "../utils/type";
import prismaClient from "../utils/prisma";
import { comparePassword, hashPassword } from "../utils/password";
import apiResponse from "../utils/apiResponse";
import { handleSendMail, handleSendOTPMail, handleVerifyOTP } from "../utils/nodemailer/mailHandler";
import { generateResetToken, verifyResetToken } from "../utils/resetToken";
import { generateFreshTokens } from "../utils/jwt";
import { generatePassword } from "../utils/nodemailer/GeneratePass";

class AuthController {
    async OrganizationRegister(req: Request, res: Response) {
        try {
            const data: CreateOrganisationBody = req.body;
            const existingOrganization = await prismaClient.organization.findUnique({
                where: { email: data.email }
            });
            if (existingOrganization) throw new Error("Organization with this mail already exists");
            const hashedPassword = await hashPassword(data.password);
            const createdOrganization = await prismaClient.organization.create({
                data: {
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    password: hashedPassword,
                    tagline: data.tagline,
                }
            });
            if (!createdOrganization) throw new Error("Error Creating Organization");
            return res.status(200).json(apiResponse(200, "Organization Created Successfully", createdOrganization));
        } catch (error: any) {
            console.log(error);
            return res.status(200).json(apiResponse(500, error.message, null));
        }
    }
    async OrganizationLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password)
                throw new Error("email and password are required");

            const organization = await prismaClient.organization.findFirst({
                where: { email },
            });

            if (!organization) throw new Error("invalid credentials");

            const isValid = await comparePassword(password, organization.password);
            if (!isValid) throw new Error("invalid credentials");

            const tokens = generateFreshTokens({
                id: organization.id,
                type: "ORGANIZATION",
            });

            const dborganization = await prismaClient.organization.findUnique({
                where: { id: organization.id },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            });

            return res
                .status(200)
                .json(apiResponse(200, "login successful", { data: dborganization, tokens }));
        } catch (error: any) {
            return res.status(401).json(apiResponse(401, error.message, null));
        }
    }
    async CreateInterviewer(req: Request, res: Response) {
        try {
            const data: CreateInterviewerBody = req.body;
            const existingInterviewer = await prismaClient.interviewer.findUnique({
                where: { email: data.email }
            });
            if (existingInterviewer) throw new Error("Interviewer with this mail already exists");
            const generatedPassword = generatePassword();
            console.log("password is" + generatedPassword);
            const hashedPassword = await hashPassword(generatedPassword);
            const createdInterviewer = await prismaClient.interviewer.create({
                data: {
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    password: hashedPassword,
                    organizationId: "698b347a2927cd5892ece1f5",
                }
            });
            const email = data.email;
            await handleSendMail(email, generatedPassword);
            if (!createdInterviewer) throw new Error("Error Creating Interviewer");
            return res.status(200).json(apiResponse(200, "Interviewer Created Successfully", createdInterviewer));
        } catch (error: any) {
            console.log(error);
            return res.status(200).json(apiResponse(500, error.message, null));
        }
    }
    async InterviewerLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password)
                throw new Error("email and password are required");

            const interviewer = await prismaClient.interviewer.findFirst({
                where: { email },
            });

            if (!interviewer) throw new Error("invalid credentials");

            const isValid = await comparePassword(password, interviewer.password);
            if (!isValid) throw new Error("invalid credentials");

            const tokens = generateFreshTokens({
                id: interviewer.id,
                type: "INTERVIEWER",
            });

            const dbinterviewer = await prismaClient.interviewer.findUnique({
                where: { id: interviewer.id },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            });

            return res
                .status(200)
                .json(apiResponse(200, "login successful", { data: dbinterviewer, tokens }));
        } catch (error: any) {
            return res.status(401).json(apiResponse(401, error.message, null));
        }
    }
    async UserRegister(req: Request, res: Response) {
        try {
            const data: CreateUserBody = req.body;
            const existingUser = await prismaClient.user.findUnique({
                where: { email: data.email }
            });
            if (existingUser) throw new Error("User with this mail already exists");
            const hashedPassword = await hashPassword(data.password);
            const createdUser = await prismaClient.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    password: hashedPassword,
                }
            });
            const email = data.email;
            if (!createdUser) throw new Error("Error Creating User");
            return res.status(200).json(apiResponse(200, "User Created Successfully", null));
        } catch (error: any) {
            return res.status(200).json(apiResponse(500, error.message, null));
        }
    }
    async UserLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password)
                throw new Error("email and password are required");

            const user = await prismaClient.user.findFirst({
                where: { email },
            });

            if (!user) throw new Error("invalid credentials");

            const isValid = await comparePassword(password, user.password);
            if (!isValid) throw new Error("invalid credentials");

            const tokens = generateFreshTokens({
                id: user.id,
                type: "USER",
            });

            const dbuser = await prismaClient.user.findUnique({
                where: { id: user.id },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            });

            return res
                .status(200)
                .json(apiResponse(200, "login successful", { data: user, tokens }));
        } catch (error: any) {
            return res.status(401).json(apiResponse(401, error.message, null));
        }
    }
    async sendVerificationOTP(req: Request, res: Response) {
        try {
            /**
             * req.params = email
             */
            const { email } = req.body;
            const sentOtp = await handleSendOTPMail(email, "email-otp-verification");
            if (sentOtp === false) throw new Error("OTP could not be sent");
            res.status(200).json(apiResponse(200, "OTP sent successfully", null));
        } catch (error: any) {
            console.log(error);
            res.status(500).json(apiResponse(500, error.message, error));
        }
    }
    async matchVerificationOTP(req: Request, res: Response) {
        try {
            /**
             * req.params = email
             */
            const { email, otp } = req.body;
            const isCorrect = handleVerifyOTP(email, otp);
            const resetToken = generateResetToken(email);
            if (!isCorrect) throw new Error("otp is not verified");
            res.status(200).json(apiResponse(200, "OTP verified sucessfully", resetToken));
        } catch (error: any) {
            console.log(error);
            res.status(500).json(apiResponse(500, error.message, error));
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { resetToken, newPassword } = req.body;
            if (!resetToken) {

                return res
                    .status(401)
                    .json(apiResponse(401, "Reset token missing or expired", null));
            }
            if (!newPassword) {
                return res
                    .status(400)
                    .json(apiResponse(400, "new password is required", null));
            }

            const payload = verifyResetToken(resetToken);

            if (payload.purpose !== "PASSWORD_RESET") {
                return res
                    .status(401)
                    .json(apiResponse(401, "Invalid reset token", null));
            }

            const email = payload.email;

            let userType:
                | "INTERVIEWER"
                | "USER"
                | "ORGANIZATION"
                | null = null;
            let dbUser: any = null;

            dbUser = await prismaClient.interviewer.findFirst({ where: { email } });
            if (dbUser) userType = "INTERVIEWER";

            if (!dbUser) {
                dbUser = await prismaClient.user.findFirst({ where: { email } });
                if (dbUser) userType = "USER";
            }

            if (!dbUser) {
                dbUser = await prismaClient.organization.findFirst({ where: { email } });
                if (dbUser) userType = "ORGANIZATION";
            }


            const hashed = await hashPassword(newPassword);

            if (userType === "INTERVIEWER") {
                await prismaClient.interviewer.update({
                    where: { id: dbUser.id },
                    data: { password: hashed },
                });
            } else if (userType === "USER") {
                await prismaClient.user.update({
                    where: { id: dbUser.id },
                    data: { password: hashed },
                });
            } else if (userType === "ORGANIZATION") {
                await prismaClient.organization.update({
                    where: { id: dbUser.id },
                    data: { password: hashed },
                });
            }

            const tokens = generateFreshTokens({
                id: dbUser.id,
                type: userType,
            });

            return res
                .status(200)
                .json(apiResponse(200, "Password reset successfully", { tokens }));
        } catch (error: any) {
            console.error(error);
            return res.status(500).json(apiResponse(500, error.message, null));
        }
    }
}


export default new AuthController();
