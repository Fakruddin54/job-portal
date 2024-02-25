// Api documentation

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
// paxcages imoprt
import express from "express";
import "express-async-errors";

import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRouts.js";
import userRoutes from "./routes/userRoutes.js";
import authRoute from "./routes/authRoute.js";
import jobsRoute from "./routes/jobsRoute.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// config dotenv

dotenv.config();

// connection to mongo db
connectDB();
// swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node ExpressJs MOngoDb Job Portal Application",
    },
    servers: [
      {
        url: "http://localhost:8080",
            // url: "https://nodejs-job-portal-app.onrender.com"
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);

// rest objects
const app = express();

// middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 8080;

// routes
app.use("/api/v1/test", testRoutes);
// register route
app.use("/api/v1/auth", authRoute);
// user route
app.use("/api/v1/user", userRoutes);
// get users
// app.use("/api/v1/users", userRoutes);

// jobs route
app.use("/api/v1/job", jobsRoute);
// home route
app.get("/", (req, res) => {
  return res.status(200).send("<h1>Welcome To Node server </h1>");
});
// home route
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(spec));

// validation middlewaare
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(
    `node server is running on port ${PORT} in ${process.env.DEV_MODE} mode.`
      .bgCyan.white
  );
});
