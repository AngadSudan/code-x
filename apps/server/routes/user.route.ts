import { Router } from "express";
import UserController from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";
const userRouter = Router();

userRouter.put(
  "/update-user-info",
  authMiddleware,
  UserController.updateUserInfo,
);

userRouter.put(
  "/upload-resume",
  authMiddleware,
  upload.single("resume"),
  UserController.handleResumeUpload,
);

userRouter.put(
  "/delete-resume",
  authMiddleware,
  upload.single("resume"),
  UserController.deleteExperience,
);

userRouter.put(
  "/update-ProfilePic",
  authMiddleware,
  upload.single("profilePic"),
  UserController.handleProfilePicUpdate,
);

userRouter.put(
  "/update-banner",
  authMiddleware,
  upload.single("Banner"),
  UserController.handleProfileBannerUpdate,
);

userRouter.get("/get-profile", authMiddleware, UserController.getFullProfile);
userRouter.get(
  "/profile/:id",
  authMiddleware,
  UserController.getFullProfileBasedonUsername,
);
userRouter.get("/git-graph", authMiddleware, UserController.getGraph);
userRouter.get(
  "/recalculate-git-graph",
  authMiddleware,
  UserController.getGithubDashboardInsights,
);
userRouter.post(
  "/add-experience",
  authMiddleware,
  // upload.fields([{ name: "offerLetter" }, { name: "completionCertificate" }]),
  UserController.addExperience,
);

userRouter.put(
  "/update-experience/:experienceId",
  authMiddleware,
  upload.fields([
    { name: "offerLetter", maxCount: 1 },
    { name: "completionCertificate", maxCount: 1 },
  ]),
  UserController.updateExperience,
);

userRouter.delete(
  "/delete-experience/:experienceId",
  authMiddleware,
  UserController.deleteExperience,
);

userRouter.put(
  "/update-platform-links",
  authMiddleware,
  UserController.updateUserPlatformLinks,
);

export default userRouter;
