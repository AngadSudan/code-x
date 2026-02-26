import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import interviewController from "../controller/interview.controller";
import interviewSuiteController from "../controller/interview-suite.controller";
const interviewRouter = Router();

// interview-suite
interviewRouter.post(
  "/interview-suite/create/:id",
  authMiddleware,
  interviewSuiteController.createInterviewSuite,
);
interviewRouter.put(
  "/interview-suite/update/:id",
  authMiddleware,
  interviewSuiteController.updateInterviewSuite,
);
interviewRouter.put(
  "/interview-suite/change-status/:id",
  authMiddleware,
  interviewSuiteController.updateSuiteState,
);
interviewRouter.delete(
  "/interview-suite/delete/:id",
  authMiddleware,
  interviewSuiteController.deleteInterviewSuite,
);
interviewRouter.get(
  "/interview-suite/get-details/:id",
  authMiddleware,
  interviewSuiteController.getInterviewSuiteById,
);
interviewRouter.get(
  "/interview-suite/get-all-suite/:id",
  authMiddleware,
  interviewSuiteController.getAllCompanyInterviewSuite,
);

// interview-suite-rounds
interviewRouter.post(
  "/interview-suite/round/create/:id",
  authMiddleware,
  interviewSuiteController.createInterviewRound,
);
interviewRouter.put(
  "/interview-suite/round/update/:id",
  authMiddleware,
  interviewSuiteController.updateInterviewRound,
);
interviewRouter.delete(
  "/interview-suite/round/delete/:id",
  authMiddleware,
  interviewSuiteController.deleteInterviewRound,
);
interviewRouter.get(
  "/interview-suite/round/get-details/:id",
  authMiddleware,
  interviewSuiteController.getInterviewRoundById,
);
interviewRouter.get(
  "/interview-suite/round/get-all-suite/:id",
  authMiddleware,
  interviewSuiteController.getAllInterviewRoundBySuite,
);
interviewRouter.get(
  "/interview-suite/round/interview/:id",
  authMiddleware,
  interviewController.getAllRoundInterview,
);
// interview applications status

interviewRouter.get(
  "/interview-suite/application/get-all-application/:id",
  authMiddleware,
  interviewSuiteController.getAllApplication,
);

// interview round candidates
interviewRouter.get(
  "/interview-suite/round/candidate/:id",
  authMiddleware,
  interviewSuiteController.getAllRoundCanddate,
);

// interview related actions
interviewRouter.post(
  "/meeting/token",
  authMiddleware,
  interviewController.joinParticipant,
);

export default interviewRouter;
