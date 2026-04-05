const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

/**
 * Protects routes from non-admin users.
 * Checks for admin_token in cookies and verifies role.
 */
exports.protectAdmin = async (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Admin access only.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is actually in the admin table
    const result = await db.query(
      `SELECT a.id, a.username, a.email, a.is_active, a.is_superadmin, r.name as role 
       FROM admins a 
       LEFT JOIN roles r ON a.role_id = r.id 
       WHERE a.id = $1`, 
      [decoded.id]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({ message: 'Admin account not found or deactivated.' });
    }

    req.admin = result.rows[0];
    next();
  } catch (error) {
    console.error('Admin Auth Middleware Error:', error);
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

/**
 * Restricts access based on superadmin status.
 */
exports.superAdminOnly = (req, res, next) => {
  if (req.admin && req.admin.is_superadmin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. SuperAdmin access required.' });
  }
};
