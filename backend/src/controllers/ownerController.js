const pool = require('../config/db');

// Owner dashboard: avg rating + list of users who rated their store
const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find owner's store
    const [storeRows] = await pool.query(
      'SELECT id, name, email, address FROM stores WHERE owner_id = ?',
      [ownerId]
    );

    if (storeRows.length === 0) {
      return res.json({ store: null, avgRating: null, raters: [] });
    }

    const store = storeRows[0];

    // Avg rating
    const [[avgRow]] = await pool.query(
      'SELECT ROUND(AVG(rating), 2) AS avg_rating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    // Users who rated
    const [raters] = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating, r.comment, r.created_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    return res.json({
      store,
      avgRating: avgRow.avg_rating,
      raters,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard };
