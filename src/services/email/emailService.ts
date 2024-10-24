// emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password', // Use an App Password if 2FA is enabled
  },
});

export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: '"Your Name" <your-email@gmail.com>',
      to,
      subject,
      text,
    });
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

