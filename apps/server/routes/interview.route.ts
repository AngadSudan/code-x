import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import interviewController from "../controller/interview.controller";
const interviewRouter = Router();

interviewRouter.post(
  "/meeting/token",
  authMiddleware,
  interviewController.joinParticipant,
);

export default interviewRouter;
