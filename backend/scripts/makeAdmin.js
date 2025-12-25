const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const email = process.argv[2];

if (!email) {
    console.log('Usage: node makeAdmin.js <email>');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB...');
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found: ${email}`);
            process.exit(1);
        }

        if (user.isAdmin) {
            console.log(`User ${email} is already an admin.`);
        } else {
            user.isAdmin = true;
            await user.save();
            console.log(`Successfully promoted ${email} to Admin!`);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
