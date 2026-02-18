import { Router } from "express";
const projectRouter = Router();
import projectController from "../controller/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

projectRouter.post('/create-project', authMiddleware, projectController.createProject);
projectRouter.put('/update-project/:id', authMiddleware, projectController.updateProject);
projectRouter.delete('/delete-project/:id', authMiddleware, projectController.deleteProject);
projectRouter.get('/get-project/:id', authMiddleware, projectController.getProjectById);
projectRouter.get('/get-all-projects', authMiddleware, projectController.getAllUserProjects);

export default projectRouter;
