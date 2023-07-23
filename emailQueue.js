const Queue = require('bull');

// Create a new Bull queue for processing emails
const emailQueue = new Queue('emailQueue', {
  redis: {
    service: 'gmail',
    host: 'localhost',
    port: 6379,
    secure: false,
    // service: 'gmail',
    // host: 'smtp.gmail.com',
    // port: '587',
    // secure: false,
    // Optionally, you can specify Redis password if required
    // password: 'your_redis_password',
  },
});

// Define the email sending job
emailQueue.process(async (job) => {
  const { email, subject, message } = job.data;


  console.log('Processing email job:', job.data);
  // Use Nodemailer or any other email library to send the email
  // For this example, we're using Nodemailer
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    // Configure your email service here
    service: 'Gmail',
    auth: {
      user: 'kumarachilish1997@gmail.com', // Update with your Gmail address
      pass: 'lkxdkeooubzrrydb', // Update with the generated application-specific 
    },
  });

  const mailOptions = {
    from: 'kumarachilish1997@gmail.com',
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
});
module.exports = emailQueue; // Export the emailQueue instance