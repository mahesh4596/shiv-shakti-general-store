const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Helper function to send OTP email via Gmail SMTP (Nodemailer)
async function sendOtpEmail(toEmail, otp) {
    const gmailUser = (process.env.ADMIN_EMAIL || '').trim();
    const gmailPass = (process.env.EMAIL_APP_PASSWORD || '').trim();

    if (!gmailUser || !gmailPass) {
        throw new Error('Gmail credentials (ADMIN_EMAIL / EMAIL_APP_PASSWORD) are not configured');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPass,
        },
    });

    await transporter.sendMail({
        from: `"Shiv Shakti Beauty" <${gmailUser}>`,
        to: toEmail,
        subject: 'Verify your Shiv Shakti Beauty account 🌸',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 8px;">
                <h2 style="color: #ec4899; text-align: center;">Welcome to Shiv Shakti Beauty!</h2>
                <p>Your one-time verification code is:</p>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
                    <h1 style="font-size: 36px; letter-spacing: 6px; color: #333; margin: 0;">${otp}</h1>
                </div>
                <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
                <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">If you did not create this account, ignore this email.</p>
            </div>
        `,
    });
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

        // Send OTP email via Resend HTTPS API
        try {
            await sendOtpEmail(user.email, otp);
        } catch (emailErr) {
            console.error('❌ Email send error:', emailErr.message);
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
            console.error('❌ Resend OTP Email error:', emailErr.response?.data || emailErr.message);
            return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
        }

        res.json({ message: 'Verification code sent to your email.' });
    } catch (err) {
        console.error('❌ RESEND OTP ERROR:', err);
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
