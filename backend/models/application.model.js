import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Reference to the Job model
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User (applicant) model
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], // Possible values for the application status
    default: 'pending', // Default status when an application is created
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Application model
export const Application = mongoose.model("Application", applicationSchema);
