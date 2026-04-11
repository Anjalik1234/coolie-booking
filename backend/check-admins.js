const db = require('./config/db');

async function checkAdmins() {
  try {
    const res = await db.query('SELECT id, username, email FROM admins');
    console.log('Current Admins:', JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error checking admins:', err);
    process.exit(1);
  }
}

checkAdmins();
