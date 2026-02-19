import type { Request, Response } from "express";
import prismaClient from "../utils/prisma";
import apiResponse from "../utils/apiResponse";
import cacheClient from "../utils/redis";

class NotificationController {
  async createInternalNotification(data: {
    from: string;
    to: string;
    message: string;
  }) {
    return await prismaClient.notification.create({
      data,
    });
  }
  async createNotification(req: Request, res: Response) {
    try {
      const { from, to, message } = req.body;

      if (!from || !to || !message) {
        return res
          .status(400)
          .json(apiResponse(400, "Notification details are Missing", null));
      }

      const notification = await this.createInternalNotification({
        from,
        to,
        message,
      });

      await cacheClient.invalidateCache(
        `/notification/${to}`,
      );

      return res
        .status(201)
        .json(apiResponse(201, "Notification Created", notification));
    } catch (error: any) {
      console.log(error);
      return res
        .status(200)
        .json(apiResponse(500, "Error Creating Notification", error.message));
    }
  }
  async getAllNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(400)
          .json(apiResponse(400, "User ID is Required", null));
      }

      const cacheNotification = await cacheClient.getCache(
        `/notification/${userId}`
      );

      if(cacheNotification){
        return res
        .status(200)
        .json(apiResponse(200,"Notifications Fetched (Cache) !",cacheNotification));
      }

      const notifications = await prismaClient.notification.findMany({
        where: {
          to: userId,
          isDeleted: "NOT_DELETED",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      await cacheClient.setCache(
        `/notification/${userId}`,
        notifications
      );

      return res
        .status(200)
        .json(apiResponse(200, "Notifications Fetched !", notifications));
    } catch (error: any) {
      console.log(error);
      return res
        .status(200)
        .json(
          apiResponse(500, "Error Fetching Notifications !", error.message),
        );
    }
  }
  async markNotificationAsRead(req: Request, res: Response) {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.id;

      if (!notificationId) {
        return res
          .status(400)
          .json(apiResponse(400, "Notification ID is Missing", null));
      }

      const dbNotification = await prismaClient.notification.findUnique({
        where:{
          id:notificationId as string
        }
      });

      if(!dbNotification) throw new Error("Notification not Found");
      if(dbNotification.to !== userId) throw new Error("User not Authorized !");

      const updateRead = await prismaClient.notification.update({
        where: {
          id: notificationId as string,
        },
        data: {
          recieptStatus: "SEEN",
        },
      });

      await cacheClient.invalidateCache(
        `/notification/${userId}`
      );

      return res
        .status(200)
        .json(apiResponse(200, "Notification Marked as Seen", updateRead));
    } catch (error: any) {
      console.log(error);
      return res
        .status(200)
        .json(apiResponse(500, "Error Marking Notification as Seen", null));
    }
  }
  async markAllNotificationsAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(400)
          .json(apiResponse(400, "User ID is Required !", null));
      }

      const updateReadAll = await prismaClient.notification.updateMany({
        where: {
          to: userId,
          recieptStatus: "UNSEEN",
        },
        data: {
          recieptStatus: "SEEN",
        },
      });

      await cacheClient.invalidateCache(
        `/notification/${userId}`
      )

      return res
        .status(200)
        .json(apiResponse(200, "All Notifications Marked as Read", updateReadAll));
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .json(apiResponse(500, "Error Marking Notifications as Read", null));
    }
  }
}

export default new NotificationController();
