const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');

// Configure OAuth2 Client for Gmail API over HTTPS
const oAuth2Client = new OAuth2Client(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
);

// Helper function to send OTP email via Gmail API over HTTPS
async function sendOtpEmail(toEmail, otp) {
    const clientId = (process.env.GMAIL_CLIENT_ID || '').trim();
    const clientSecret = (process.env.GMAIL_CLIENT_SECRET || '').trim();
    const refreshToken = (process.env.GMAIL_REFRESH_TOKEN || '').trim();
    const senderEmail = (process.env.SENDER_EMAIL || process.env.GMAIL_USER || '').trim();

    if (!clientId || !clientSecret || !refreshToken || !senderEmail) {
        throw new Error('Gmail OAuth credentials (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, SENDER_EMAIL) are not configured');
    }

    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const { token: accessToken } = await oAuth2Client.getAccessToken();
    if (!accessToken) {
        throw new Error('Failed to retrieve Gmail OAuth access token');
    }

    const subject = 'Your OTP Verification Code';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        `From: Shiv Shakti General Store <${senderEmail}>`,
        `To: ${toEmail}`,
        `Subject: ${utf8Subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        `
            <div style="
                margin:0;
                padding:40px 15px;
                background-color:#1b1d26;
                font-family:Arial,Helvetica,sans-serif;
            ">

                <div style="
                    max-width:600px;
                    margin:0 auto;
                    background-color:#0d111b;
                    border-radius:20px;
                    padding:45px 30px 50px 30px;
                    text-align:center;
                ">

                    <h1 style="
                        margin:0 0 35px 0;
                        color:#ff1493;
                        font-size:30px;
                        line-height:1.25;
                        font-weight:700;
                    ">
                        Welcome to Shiv Shakti<br>
                        General Store!
                    </h1>

                    <p style="
                        margin:0 0 28px 0;
                        color:#eeeeee;
                        font-size:17px;
                        line-height:1.6;
                    ">
                        Your one-time verification code is:
                    </p>

                    <div style="
                        color:#f4f4f4;
                        font-size:46px;
                        line-height:1;
                        font-weight:700;
                        letter-spacing:12px;
                        margin:25px 0 45px 12px;
                    ">
                        ${otp}
                    </div>

                    <p style="
                        margin:0;
                        color:#8c8f99;
                        font-size:16px;
                        line-height:1.5;
                    ">
                        If you didn't request this,<br>
                        you can safely ignore this email.
                    </p>

                </div>
            </div>
        `
    ];
    const message = messageParts.join('\r\n');
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const response = await axios.post(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
        { raw: encodedMessage },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        }
    );

    return response.data;
}

// 1. Signup Route
router.post('/signup', async (req, res) => {
    try {
        let { name, email, password, phone } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }
        email = email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine if user is admin
        const isAdmin = email === (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            isAdmin,
            isVerified: false,
            verificationCode: otp
        });
        await user.save();

        // Send OTP email via Gmail API over HTTPS
        try {
            await sendOtpEmail(user.email, otp);
        } catch (emailErr) {
            console.error('❌ Gmail API Email error:', emailErr.response?.data || emailErr.message);
            // Rollback user creation if email fails
            await User.deleteOne({ _id: user._id });
            return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
        }

        res.json({ 
            message: 'Signup successful! Please check your email for the verification code.',
            user
        });
    } catch (err) {
        console.error('❌ SIGNUP ERROR:', err);
        res.status(400).json({ message: 'Error: ' + err.message });
    }
});

// 2. Resend OTP Route
router.post('/resend-otp', async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        email = email.trim().toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = otp;
        await user.save();

        try {
            await sendOtpEmail(user.email, otp);
        } catch (emailErr) {
            console.error('❌ Gmail API OTP Email error:', emailErr.response?.data || emailErr.message);
            return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
        }

        res.json({ message: 'Verification code sent to your email.' });
    } catch (err) {
        console.error('❌ GMAIL API OTP ERROR:', err);
        res.status(400).json({ message: 'Error: ' + err.message });
    }
});

// 3. Login with Verification
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        email = email.trim().toLowerCase();
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        let isMatch = await bcrypt.compare(password, user.password);

        // MIGRATION: If not a hashed match, check if it's an old plain-text password
        if (!isMatch && password === user.password) {
            console.log('Migrating old plain-text password for:', user.email);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            isMatch = true;
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Auto-upgrade to Admin if email matches
        const isAdminEmail = email === (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
        if (isAdminEmail && !user.isAdmin) {
            user.isAdmin = true;
            await user.save();
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Account not verified. Please verify OTP.', requiresVerification: true, email: user.email });
        }

        res.json({ message: 'Login success!', user });
    } catch (err) {
        res.status(400).json({ message: 'Error logging in', error: err.message });
    }
});

// 4. Update Profile
router.post('/update-profile', async (req, res) => {
    try {
        const { userId, name, phone, password } = req.body;
        const user = await User.findById(userId);
        if (user) {
            if (name) user.name = name;
            if (phone) user.phone = phone;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }
            await user.save();
            res.json({ message: 'Profile updated!', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ message: 'Error updating profile', error: err.message });
    }
});

// 5. Verify OTP route
router.post('/verify-otp', async (req, res) => {
    try {
        let { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and verification code are required' });
        }
        email = email.trim().toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (user.verificationCode === otp) {
            user.isVerified = true;
            user.verificationCode = undefined;
            await user.save();
            return res.json({ message: 'OTP verified, account activated', user });
        } else {
            return res.status(400).json({ message: 'Incorrect verification code. Please try again.' });
        }
    } catch (err) {
        console.error('OTP verification error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
