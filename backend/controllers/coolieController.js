const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Not used here, but kept if you need it elsewhere in the file
const db = require('../config/db');
require('dotenv').config();

exports.registerCoolie = async (req, res) => {
  try {
    const { 
      first_name, middle_name, last_name, email, password, 
      age, phone, city, postal_code, aadhar_number, 
      aadhar_image, avatar_url 
    } = req.body;

    // 1. Basic validation
    if (!first_name || !last_name || !email || !password || !age || !phone || !city || !postal_code || !aadhar_number) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // 2. Check if user exists in passengers
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered as a passenger. Please use another email.' });
    }

    // 3. Check if user exists in coolies
    const coolieCheck = await db.query('SELECT * FROM coolies WHERE email = $1', [email]);
    if (coolieCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered as a coolie.' });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Fallback Avatar
    const finalAvatar = avatar_url || `https://ui-avatars.com/api/?name=${first_name}+${last_name}&background=0f172a&color=f97316`;

    // 6. Insert into DB (is_approved defaults to false via schema)
    // FIX: Removed the backslash escaping the closing backtick
    const result = await db.query(
      `INSERT INTO coolies (first_name, middle_name, last_name, email, age, phone, city, postal_code, aadhar_number, aadhar_image, avatar_url, password_hash) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING id, first_name, last_name, email, is_approved`,
      [first_name, middle_name, last_name, email, age, phone, city, postal_code, aadhar_number, aadhar_image, finalAvatar, passwordHash]
    );

    const newCoolie = result.rows[0];

    // Note: We deliberately do NOT return a JWT token here because unapproved coolies cannot log in.
    res.status(201).json({
      message: 'Coolie registration submitted successfully. Your account is pending admin approval.',
      user: {
        id: newCoolie.id,
        // FIX: Removed the backslashes escaping the backticks
        name: `${newCoolie.first_name} ${newCoolie.last_name}`,
        email: newCoolie.email,
        is_approved: newCoolie.is_approved
      }
    });

  } catch (error) {
    console.error('Error during coolie registration:', error);
    res.status(500).json({ message: 'Server error during coolie registration.' });
  }
};