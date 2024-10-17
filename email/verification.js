require("dotenv").config();
const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    const verificationLink = `https://your-app.com/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: '"The sickest hacker of them all" <no-reply@website.com>',
        to: email,
        subject: 'Verify Your Email',
        text: `Please verify your email by clicking the following link: ${verificationLink}`,
        html: `<p>Please verify your email by clicking </p><a href="${verificationLink}">here.</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent.');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email.');
    }
};

module.exports = {
    sendVerificationEmail
}