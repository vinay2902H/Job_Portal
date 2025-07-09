import nodemailer from 'nodemailer';

// Create a transporter using SMTP credentials from environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",  // or another email service
  auth: {
    user: process.env.SMTP_USER, // email address
    pass: process.env.SMTP_PASS, // email password (or app password for Gmail)
  },
});

// Function to send an email
export const sendCustomEmail = async ({ email, subject, message }) => {
  const mailOptions = {
    from: process.env.SMTP_USER, // Sender's email address
    to: email,                  // Recipient's email address
    subject: subject,           // Subject of the email
    text: message,              // Body of the email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
