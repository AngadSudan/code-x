import { Router } from "express";
import authController from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const authRouter = Router();
authRouter.post("/register/interviewer", authMiddleware, authController.CreateInterviewer);
authRouter.post("/login/interviewer", authController.InterviewerLogin);
authRouter.post("/register/user", authController.UserRegister);
authRouter.post("/login/user", authController.UserLogin);
authRouter.post("/register/org", authController.OrganizationRegister);
authRouter.post("/login/org", authController.OrganizationLogin);
authRouter.post("/forgot-password", authController.sendVerificationOTP);
authRouter.post("/verify-otp", authController.matchVerificationOTP);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
