# Cosmetic Shop - Full Stack Website

A beautiful and simple cosmetic shopping website built with React, Node.js, Express, and MongoDB.

## Features
- Home page with product listing
- Product details
- Shopping Cart
- User Login & Signup
- Razorpay Payment Integration
- Admin Panel (Manage Products & View Orders)
- Order History

## Tech Stack
- **Frontend:** React, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Payment:** Razorpay

## How to Run

### 1. Backend Setup
1. Go to `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your MongoDB URI and Razorpay keys:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/cosmetic-shop
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   ```
4. Seed the database: `node seed.js`
5. Start the server: `npm start` (or `node index.js`)

### 2. Frontend Setup
1. Go to `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Admin Access
To access the admin panel, you need to manually set `isAdmin: true` for a user in the MongoDB database or update the logic in the code.

## Note
This project is designed with simplicity in mind, perfect for beginners!
