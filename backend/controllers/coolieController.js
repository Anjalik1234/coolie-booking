const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Not used here, but kept if you need it elsewhere in the file
const db = require('../config/db');
const { saveBase64Image } = require('../utils/fileUpload');
require('dotenv').config();

exports.registerCoolie = async (req, res) => {
  try {
    const { 
      first_name, middle_name, last_name, email, password, 
      age, phone, city, postal_code, aadhar_number, 
      aadhar_image, avatar_url 
    } = req.body;

    // 1. Basic validation
    if (!first_name || !last_name || !email || !password || !age || !phone || !city || !postal_code || !aadhar_number || !aadhar_image) {
      return res.status(400).json({ message: 'Please provide all required fields, including your Aadhar card image.' });
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

    // 6. Save Base64 to Files (using a temporary ID or placeholder before actual insert, 
    // but better to insert first to get the ID, then update. 
    // Or just use email-hashed folder. Let's use ID.)
    
    // First insert to get the ID
    const insertResult = await db.query(
      `INSERT INTO coolies (first_name, middle_name, last_name, email, age, phone, city, postal_code, aadhar_number, aadhar_image, avatar_url, password_hash) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING id`,
      [first_name, middle_name, last_name, email, age, phone, city, postal_code, aadhar_number, 'pending', finalAvatar, passwordHash]
    );

    const coolieId = insertResult.rows[0].id;

    // Now save the actual images using the coolieId
    const savedAadharPath = saveBase64Image(aadhar_image, coolieId, 'aadhar');
    const savedAvatarPath = avatar_url ? saveBase64Image(avatar_url, coolieId, 'avatar') : finalAvatar;

    // Update the record with the file paths
    const finalResult = await db.query(
      'UPDATE coolies SET aadhar_image = $1, avatar_url = $2 WHERE id = $3 RETURNING id, first_name, last_name, email, is_approved',
      [savedAadharPath, savedAvatarPath, coolieId]
    );

    const newCoolie = finalResult.rows[0];

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

exports.getApprovedCoolies = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.id, c.first_name, c.last_name, c.email, c.age, c.city, c.avatar_url,
              CASE 
                WHEN EXISTS (SELECT 1 FROM bookings b WHERE b.coolie_id = c.id AND b.status IN ('accepted', 'pending')) THEN 'busy'
                ELSE 'available'
              END as status
       FROM coolies c
       WHERE c.is_approved = TRUE`
    );
    res.json({ success: true, coolies: result.rows });
  } catch (error) {
    console.error('Error fetching approved coolies:', error);
    res.status(500).json({ success: false, message: 'Server error fetching partners.' });
  }
};