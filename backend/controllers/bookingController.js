const db = require('../config/db');

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  const { station, trainNumber, platform, luggageType, date, time, passengers, notes, coolieId, totalFare } = req.body;
  const userId = req.user.id; // From protect middleware

  try {
    const result = await db.query(
      `INSERT INTO bookings (user_id, coolie_id, station, train_number, platform, luggage_type, date, time, passengers, notes, total_fare)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [userId, coolieId || null, station, trainNumber, platform, luggageType, date, time, passengers, notes, totalFare]
    );

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      booking: result.rows[0]
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating booking' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
exports.getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT b.*, c.first_name as coolie_first_name, c.last_name as coolie_last_name, c.phone as coolie_phone, c.avatar_url as coolie_avatar
       FROM bookings b
       LEFT JOIN coolies c ON b.coolie_id = c.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
};

// @desc    Get coolie's bookings
// @route   GET /api/bookings/coolie-tasks
exports.getCoolieBookings = async (req, res) => {
  const coolieId = req.user.id; // User ID from JWT (which is coolie ID for partners)

  try {
    const result = await db.query(
      `SELECT b.*, u.name as user_name, u.phone as user_phone
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.coolie_id = $1
       ORDER BY b.created_at DESC`,
      [coolieId]
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error('Get coolie bookings error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching coolie tasks' });
  }
};

// @desc    Update booking status (Accept/Reject/Complete)
// @route   PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const coolieId = req.user.id;

  try {
    // Ensure the coolie owns this booking
    const check = await db.query('SELECT * FROM bookings WHERE id = $1 AND coolie_id = $2', [id, coolieId]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this booking' });
    }

    const result = await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};
