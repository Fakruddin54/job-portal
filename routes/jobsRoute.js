import express from "express";
import userAuth from "../middlewares/authMIddleware.js";
import {
  createJobsController,
  deleteJobController,
  jobStatsController,
  getJobsController,
  updateJobController,
} from "./../controllers/jobsController.js";
const router = express.Router();

// routes
// create jobs
router.post("/create-job", userAuth, createJobsController);
// get jobs
router.get("/get-job", userAuth, getJobsController);
// get jobs
router.patch("/update-job/:id", userAuth, updateJobController);
// delete jobs
router.delete("/delete-job/:id",userAuth , deleteJobController)
//  jobs status filters
router.get("/job-stats",userAuth , jobStatsController)
export default router;
