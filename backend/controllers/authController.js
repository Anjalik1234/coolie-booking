const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    // 1. Validate inputs
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // 2. Check if user exists
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Insert into database
    const result = await db.query(
      'INSERT INTO users (name, email, phone, password_hash, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, address',
      [name, email, phone, passwordHash, address]
    );

    const newUser = result.rows[0];

    // 5. Generate Token
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: false, // User requested frontend access
      secure: false, // Localhost dev
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address
      }
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    let user = null;
    let table = 'users';

    // 1. Check passengers first
    const passengerRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (passengerRes.rows.length > 0) {
      user = passengerRes.rows[0];
    } else {
      // 2. Check coolies
      const coolieRes = await db.query('SELECT * FROM coolies WHERE email = $1', [email]);
      if (coolieRes.rows.length > 0) {
        user = coolieRes.rows[0];
        table = 'coolies';

        // Check approval
        if (!user.is_approved) {
          return res.status(403).json({ 
            message: 'Your coolie account is pending admin approval. You will be able to login once verified.',
            status: 'pending_approval' 
          });
        }
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, table },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: table === 'users' ? user.name : `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        role: table === 'users' ? 'passenger' : 'coolie',
        avatar: table === 'coolies' ? user.avatar_url : null
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
