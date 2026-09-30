const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const axios = require('axios');

// Helper: send admin order alert via Brevo HTTPS API (works on Render - no SMTP)
async function sendOrderAlertEmail(order) {
    const apiKey = (process.env.BREVO_API_KEY || '').trim();
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim();

    if (!apiKey || !adminEmail) {
        console.log('⚠️ EMAIL SKIPPED: BREVO_API_KEY or ADMIN_EMAIL not set');
        return;
    }

    await axios.post('https://api.brevo.com/v3/smtp/email', {
        sender: { name: 'Shiv Shakti Bot', email: adminEmail },
        to: [{ email: adminEmail }],
        subject: `🚨 NEW ORDER: #${order._id.toString().slice(-6)}`,
        htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ff0080; border-radius: 20px;">
                <h1 style="color: #ff0080;">Shiv Shakti Store Alert! 🌸</h1>
                <p>Hello Admin, a new order has been placed!</p>
                <hr/>
                <p><strong>Order ID:</strong> #${order._id}</p>
                <p><strong>Customer:</strong> ${order.user?.name || 'N/A'}</p>
                <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
                <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
                <p><strong>Shipping Address:</strong> ${order.address}</p>
                <hr/>
                <p><strong>Items:</strong></p>
                <ul>
                    ${order.items.map(i => `<li>${i.name} (x${i.quantity}) - ₹${i.price}</li>`).join('')}
                </ul>
                <p style="color: #888; font-size: 10px;">Check your Boutique Console for full order details.</p>
            </div>
        `,
    }, {
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        timeout: 10000,
    });
}

// Create order
router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();

        // Fetch full document with populated user for reliable logs
        const fullOrder = await Order.findById(order._id).populate('user');

        // --- STEP 1: TERMINAL LOG ---
        console.log('\n\n--- 🌸 NEW ORDER ALERT 🌸 ---');
        console.log(`🆔 Order ID: ${fullOrder._id}`);
        console.log(`👤 Customer: ${fullOrder.user?.name || 'Walk-in'} (${fullOrder.user?.email || 'N/A'})`);
        console.log(`📞 Phone: ${fullOrder.phone || 'N/A'}`);
        console.log(`🏠 Address: ${fullOrder.address}`);
        console.log(`💰 Total: ₹${fullOrder.totalAmount}`);
        console.log(`📦 Items:`);
        fullOrder.items.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.name} (Qty: ${item.quantity}) - ₹${item.price}`);
        });
        console.log('-------------------------------\n\n');

        // --- STEP 2: TELEGRAM NOTIFICATION ---
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            const message = `🚨 *NEW ORDER RECEIVED* 🚨\n\n🆔 *Order ID:* \`${fullOrder._id}\`\n👤 *Customer:* ${fullOrder.user?.name || 'N/A'}\n📞 *Phone:* ${fullOrder.phone || 'N/A'}\n🏠 *Address:* ${fullOrder.address}\n💰 *Total:* ₹${fullOrder.totalAmount}\n\n📦 *Items:* \n${fullOrder.items.map(i => `• ${i.name} (x${i.quantity})`).join('\n')}`;

            axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            }).then(() => {
                console.log('📱 Telegram Notification Sent! ✅');
            }).catch(err => {
                console.error('❌ Telegram Failed:', err.response?.data || err.message);
            });
        }

        // --- STEP 3: EMAIL NOTIFICATION via Brevo ---
        sendOrderAlertEmail(fullOrder)
            .then(() => console.log('📧 Admin notified via Email! ✅'))
            .catch(err => console.error('❌ EMAIL ERROR:', err.response?.data || err.message));

        res.json({ message: 'Order created!', order });
    } catch (err) {
        res.status(400).json({ message: 'Error creating order', error: err.message });
    }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching orders', error: err.message });
    }
});

// Get all orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching all orders', error: err.message });
    }
});

// Update order payment status (Admin)
router.patch('/:id/payment-status', async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
        res.json({ message: 'Status Updated', order });
    } catch (err) {
        res.status(400).json({ message: 'Error updating status', error: err.message });
    }
});

module.exports = router;
