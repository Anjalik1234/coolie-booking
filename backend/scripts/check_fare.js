const { Client } = require('pg');

async function check() {
  const client = new Client({
    connectionString: 'postgres://postgres:password@localhost:5432/cooliebook'
  });

  try {
    await client.connect();
    const res = await client.query('SELECT total_fare FROM bookings ORDER BY created_at DESC LIMIT 5');
    console.log('Recent bookings total_fare:', res.rows);
  } catch (err) {
    console.error('❌ Check failed:', err.message);
  } finally {
    await client.end();
  }
}

check();
