import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is require "],
    },
    position: {
      type: String,
      minlength: [5, "minimum 5 charactors"],
      maxlength: [50, "not more than 50 charactors"],
      required: [true, "job position is require"],
    },
    status: {
      type: String,
      enum: ["pending", "interview", "reject", "selected"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "Hydrabad",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
