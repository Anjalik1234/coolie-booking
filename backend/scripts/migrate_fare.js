const { Client } = require('pg');

async function migrate() {
  const client = new Client({
    connectionString: 'postgres://postgres:password@localhost:5432/cooliebook'
  });

  try {
    await client.connect();
    await client.query('ALTER TABLE bookings ADD COLUMN total_fare INTEGER;');
    console.log('✅ Column total_fare added successfully.');
  } catch (err) {
    if (err.code === '42701') {
      console.log('ℹ️ Column total_fare already exists.');
    } else {
      console.error('❌ Migration failed:', err.message);
    }
  } finally {
    await client.end();
  }
}

migrate();
