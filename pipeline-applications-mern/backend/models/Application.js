import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 120, default: "Not specified" },
    salary: { type: String, trim: true, maxlength: 120, default: "Not specified" },
    type: {
      type: String,
      enum: ["Internship", "Full-time", "Scholarship", "Training"],
      default: "Internship"
    },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "Rejected"],
      default: "Applied"
    },
    appliedDate: {
      type: String,
      match: /^\d{4}-\d{2}-\d{2}$/,
      default: () => new Date().toISOString().slice(0, 10)
    },
    match: { type: Number, min: 0, max: 100, default: 0 },
    color: { type: String, match: /^#[0-9a-fA-F]{6}$/, default: "#0a9a6c" },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "No description provided."
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(document, result) {
        result.id = result._id.toString();
        delete result._id;
        delete result.__v;
        return result;
      }
    }
  }
);

export default mongoose.model("Application", applicationSchema);
