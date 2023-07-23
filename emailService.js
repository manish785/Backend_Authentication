// app/services/emailService.js
const nodemailer = require('nodemailer');
const path = require('path');


const sendResetEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587, // SMTP port (usually 587 or 465 for SSL)
      secure: false, // Set to true for SSL (465) or false for other ports
      auth: {
        user: 'kumarachilish1997@gmail.com', // Update with your Gmail address
        pass: 'itpoqvszjufwggnp', // Update with the generated application-specific 
      },
    });

    const mailOptions = {
      from:'kumarachilish1997@gmail.com', // Sender's email address
      to: 'kumarachilish1997@gmail.com', // Recipient's email address
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `<p>Click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

module.exports = { sendResetEmail };
