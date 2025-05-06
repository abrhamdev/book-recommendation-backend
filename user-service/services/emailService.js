import dotenv from 'dotenv';
import Mailgun from "mailgun-js";

dotenv.config();

const DOMAIN = 'sandbox7add70c7d10e4753b589990708422ed7.mailgun.org'; // from Mailgun
const mg = Mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

export const sendVerificationEmail = (email, token) => {
  const verificationLink = `http://localhost:3001/verify?token=${token}`;
  const data = {
    from: 'NovaReads <no-reply@NovaReads.com>',
    to:email,
    subject: 'Verify your email',
    html: `<p>Click the link to verify your email:</p><a href="${verificationLink}">click here to verify</a>`
  };

  return mg.messages().send(data);
};


