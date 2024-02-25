import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";

export const createJobsController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("please provide all fields");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(200).json({
    message: "job created successfully",
    job,
  });
};
export const getJobsController = async (req, res, next) => {
  // all jobs
  // const jobs = await jobsModel.find({ createdBy: req.body.userId });
  // filter jobs
  const { status, workType, search, sort } = req.query;
  // conditions
  const queryObject = {
    createdBy: req.user.userId,
  };
  // filter logic
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  let queryResult = jobsModel.find(queryObject);

  // sorting method

  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  // sorting method oldest

  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  // sorting method a-z

  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }
  // sorting method a-z

  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const jobs = await queryResult;

  queryResult = queryResult.skip(skip).limit(limit);

  const totalJobs = await jobsModel.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);
  res.status(200).json({
    message: "All jobs finds",
    totalJobs,
    jobs,
    numOfPage,
  });
};

export const updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  if (!company || !position) {
    next("please provide all fields");
  }
  const job = await jobsModel.findOne({ _id: id });
  if (!job) {
    next(`no jobs find by this id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("Your Not Authorized to update this job");
    return;
  }
  const updatedJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    updatedJob,
  });
};

// ======= DELETE JOBS ===========
export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;
  //find job
  const job = await jobsModel.findOne({ _id: id });
  //validation
  if (!job) {
    next(`No Job Found With This ID ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("Your Not Authorize to delete this job");
    return;
  }
  await job.deleteOne();
  res.status(200).json({ message: "Success, Job Deleted!" });
};

// job stats and filters
export const jobStatsController = async (req, res) => {
  const stats = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // default stats
  const defaultStats = {
    allJobs: stats || 0,
  };
  // monthly
  //monthly yearly stats
  let monthlyApplication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res
    .status(200)
    .json({ totalJob: stats.length, defaultStats, monthlyApplication });
};
