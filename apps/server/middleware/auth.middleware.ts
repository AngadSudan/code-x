import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.headers.authorization?.split(" ")[0];
        if (!token) {
            throw new Error("Unauthorised, Re-login");
        }

        // const decoded = verifyAccessToken(token);

        // let user;
        // if (decoded.type === "ORGANIZATION") {
        //     user = await prismaClient.organization.findUnique({
        //         where: { id: decoded.id },
        //     });
        // } else if (decoded.type === "INTERVIEWER") {
        //     user = await prismaClient.interviewer.findUnique({
        //         where: { id: decoded.id },
        //     });
        // } else if (decoded.type === "USER") {
        //     user = await prismaClient.user.findUnique({
        //         where: { id: decoded.id },
        //     });
        // }

        // if (!user) {
        //     return res
        //         .status(401)
        //         .json(apiResponse(401, "UNAUTHORIZED ENTITY", null));
        // }
        req.user = {
            id: token,
            type: "USER",
        };

        next();
    } catch (error: any) {
        return res.status(401).json(apiResponse(401, error.message, null));
    }
};
