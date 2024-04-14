// backend/src/utils/emailService.js

const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'sumitkumar12110@outlook.com',
    pass: 'Mrsumit45@',
  },
});

const emailService = {
  sendEmail: async (to, subject, text) => {
    try {
      // Send mail with defined transport object
      await transporter.sendMail({
        from: 'sumitkumar12110@outlook.com',
        to,
        subject,
        text,
      });

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },
};

// emailService.sendEmail('deepakkumar@jmangroup.com','test subject','test body');

module.exports = emailService;
