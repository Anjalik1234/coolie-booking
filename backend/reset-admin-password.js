const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@2026', salt);
    
    const res = await db.query(
      'UPDATE admins SET password_hash = $1 WHERE email = $2 RETURNING username',
      [passwordHash, 'admin@cooliebook.in']
    );

    if (res.rows.length > 0) {
      console.log(`Password reset successfully for user: ${res.rows[0].username}`);
    } else {
      console.error('Admin account not found.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error resetting password:', err);
    process.exit(1);
  }
}

resetAdminPassword();
