#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--name' && args[i+1]) { out.name = args[++i]; }
    else if (a === '--email' && args[i+1]) { out.email = args[++i]; }
    else if (a === '--password' && args[i+1]) { out.password = args[++i]; }
    else if (a === '--mongo' && args[i+1]) { out.mongo = args[++i]; }
    else if (a === '--help' || a === '-h') { out.help = true; }
  }
  return out;
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    console.log(`Usage: node create_admin.js --name "Admin Name" --email admin@example.com --password secret [--mongo mongodb://localhost:27017/mern-app]`);
    process.exit(0);
  }

  const name = args.name || process.env.ADMIN_NAME;
  const email = args.email || process.env.ADMIN_EMAIL;
  const password = args.password || process.env.ADMIN_PASSWORD;
  const mongoUri = args.mongo || process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-app';

  if (!name || !email || !password) {
    console.error('Missing required fields. Provide --name, --email and --password (or set ADMIN_NAME/ADMIN_EMAIL/ADMIN_PASSWORD).');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    const passwordHash = await bcrypt.hash(password, 10);
    let user;
    if (existing) {
      existing.isAdmin = true;
      existing.passwordHash = passwordHash;
      existing.name = name;
      user = await existing.save();
      console.log(`Updated existing user (${email}) to admin.`);
    } else {
      user = await User.create({ name, email: email.toLowerCase().trim(), passwordHash, isAdmin: true });
      console.log(`Created admin user: ${user.email}`);
    }

    // Print a JWT for quick testing (expires in 7d)
    try {
      const jwt = require('jsonwebtoken');
      const secret = process.env.JWT_SECRET || 'devsecret';
      const token = jwt.sign({ id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin }, secret, { expiresIn: '7d' });
      console.log('\n=== TEST JWT ===');
      console.log(token);
      console.log('=== END JWT ===\n');
    } catch (e) {
      // ignore JWT print failures
    }
  } catch (e) {
    console.error('Error creating admin:', e.message || e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

main();
