import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type { Express } from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import "dotenv/config";
import morgan from "morgan";
import dotenv from "dotenv";
import cacheClient from "./utils/redis";
import { authRouter } from "./routes";
import type { JwtPayload } from "./utils/type";
import userRouter from "./routes/user.route";
import organizationRouter from "./routes/organization.route";
import initializeSocket from "./socket/socket";
import chalk from "chalk";
import interviewRouter from "./routes/interview.route";

dotenv.config({ path: "../.env" });

const app: Express = express();
const server = http.createServer(app);
const io = initializeSocket(server);
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 200,
  message: "Too many requests from this IP, please try again after 10 minutes",
});
const port = process.env.PORT || 8000;
app.use(morgan("dev") as any);

//websecurity
app.use(helmet());
app.use("/api", limiter);
app.use(hpp() as any);

//express middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remeber-token",
      "Origin",
      "Accept",
    ],
  }),
);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Backend of the Codex Devhire API ",
    version: "1.0.0",
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    FRONTEND_URL: process.env.FRONTEND_URL,
  });
});
app.get("/health", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy!",
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    FRONTEND_URL: process.env.FRONTEND_URL,
  });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/admin/v1/flush/redis", async (req, res) => {
  const data = await cacheClient.clearAllCache();
  return res.status(200).json({ message: "cleared all cache storage" });
});
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/interview/", interviewRouter);

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log({
    error: error,
    message: "Error: " + error.message,
    loggingLevel: "error",
  });
  console.log({
    error: error,
    message: "Stack: " + error.message,
    loggingLevel: "error",
  });

  if (error.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
      details: error.message,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format",
      user: "SYSTEM",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      status: "error",
      message: "Duplicate key error",
      user: "SYSTEM",
    });
  }

  // Default error response
  res.status(error.status || 500).json({
    status: "error",
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Server startup function
const startServer = async () => {
  try {
    cacheClient.createClient();
    cacheClient
      .connectToClient()
      .then(() => {
        console.log("cache layer initialized");
      })
      .catch((err) => {
        console.log(err);
        console.log(chalk.red("Cache layer initialization failiure"));
      });
    console.log(chalk.green("cache layer initialized"));
    server.listen(port, () => {
      console.log(
        chalk.green(
          `Server running in ${process.env.NODE_ENV} mode on port ${port}`,
        ),
      );
      console.log(chalk.yellow(`Frontend URL: ${process.env.FRONTEND_URL}`));
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal: any) => {
      console.log(
        chalk.yellow(`\n${signal} received. Starting graceful shutdown...`),
      );

      try {
        await new Promise((resolve) => {
          server.close(resolve);
        });
        console.log(chalk.yellow("✓ Server closed"));
        process.exit(0);
      } catch (err) {
        process.exit(1);
      }
    };

    // Process event handlers
    process.on("unhandledRejection", (error) => {
      console.log(error, "Unhandled Rejection");
    });

    process.on("uncaughtException", (error) => {
      console.log(error, "Uncaught Exception");
    });

    // Shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (err) {
    console.log(err, "Server Startup");
    process.exit(1);
  }
};

// Start the server
startServer().catch((err) => {
  console.log(err, "Fatal Startup Error");
  process.exit(1);
});

export { app as default, server, io };
