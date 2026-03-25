import { transporter } from './Email.config.js';
import {
  Verification_Email_Template,
  Welcome_Email_Template,
} from './EmailTemplate.js';

const FROM_ADDRESS = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`;

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: FROM_ADDRESS,
      to: email,
      subject: 'Verify your email',
      html: Verification_Email_Template.replace('{verificationCode}', verificationCode),
    });
    console.log('Verification email sent:', response.messageId);
  } catch (error) {
    console.error('Verification email error:', error);
    throw error; 
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: FROM_ADDRESS,
      to: email,
      subject: 'Welcome!',
      html: Welcome_Email_Template.replace('{name}', name),
    });
    console.log('Welcome email sent:', response.messageId);
  } catch (error) {
    console.error('Welcome email error:', error);
  }
};