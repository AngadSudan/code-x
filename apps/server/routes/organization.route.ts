import { Router } from "express";
import organizationController from "../controller/organization.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";
const organizationRouter = Router();

organizationRouter.put(
    "update-org-profilePic",
    authMiddleware,
    upload.fields([{name:"Org-Profile-Pic"}]),
    organizationController.OrgProfilePicUpdate,
);

organizationRouter.put(
    "update-org-profileBanner",
    authMiddleware,
    upload.fields([{name:"Org-Profile-Pic"}]),
    organizationController.OrgProfilePicUpdate,
);

organizationRouter.put(
    "update-organization",
    authMiddleware,
    organizationController.updateOrganizationInfo,
);

organizationRouter.post(
    "create-interviewer",
    authMiddleware,
    organizationController.addInterviewer,
);

organizationRouter.put(
    "update-interviewer",
    authMiddleware,
    organizationController.updateInterviewerDetail,
);

organizationRouter.delete(
    "delete-interviewer",
    authMiddleware,
    organizationController.removeInterviewer,
);

organizationRouter.put(
    "update-interviewer-profilePic",
    authMiddleware,
    upload.fields([{name:"Interviewer-Profile-Pic"}]),
    organizationController.InterviewerProfilePicUpdate,
);


organizationRouter.put(
    "update-interviewer-banner",
    authMiddleware,
    upload.fields([{name:"Interviewer-Profile-Banner"}]),
    organizationController.InterviewerProfileBannerUpdate,
);

export default organizationRouter;
