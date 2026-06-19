// Run with: node seeder.js
// Creates a default admin (headmaster) account.
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@school.edu';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Headmaster';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`Admin already exists with email: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });

    console.log('Admin account created successfully!');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('Please change this password after your first login.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

run();
