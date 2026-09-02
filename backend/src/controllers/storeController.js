const pool = require('../config/db');

// List all stores with avg rating and the requesting user's rating
const getStores = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, sortBy, order } = req.query;

    const conditions = [];
    const values = [];

    if (name) { conditions.push('s.name LIKE ?'); values.push(`%${name}%`); }
    if (address) { conditions.push('s.address LIKE ?'); values.push(`%${address}%`); }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const allowedSort = ['name', 'address', 'avg_rating'];
    const sortCol = allowedSort.includes(sortBy) ? `s.${sortBy}` : 's.name';
    const sortDir = order === 'desc' ? 'DESC' : 'ASC';

    const query = `
      SELECT
        s.id,
        s.name,
        s.address,
        ROUND(AVG(r.rating), 2) AS avg_rating,
        ur.rating AS user_rating,
        ur.comment AS user_comment,
        ur.id AS user_rating_id
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
      ${whereClause}
      GROUP BY s.id, ur.rating, ur.comment, ur.id
      ORDER BY ${sortCol} ${sortDir}
    `;

    const [rows] = await pool.query(query, [userId, ...values]);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Submit a rating
const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { store_id, rating, comment } = req.body;

    if (!store_id || !rating || rating < 1 || rating > 5) {
      return res.status(422).json({ message: 'store_id and rating (1–5) are required' });
    }

    const [storeRows] = await pool.query('SELECT id FROM stores WHERE id = ?', [store_id]);
    if (storeRows.length === 0) return res.status(404).json({ message: 'Store not found' });

    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, store_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'You have already rated this store. Use PUT to update.' });
    }

    const [result] = await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, store_id, rating, comment || null]
    );

    return res.status(201).json({ message: 'Rating submitted', ratingId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update a rating
const updateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(422).json({ message: 'Rating must be between 1 and 5' });
    }

    const [rows] = await pool.query(
      'SELECT id FROM ratings WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found or not yours' });
    }

    await pool.query(
      'UPDATE ratings SET rating = ?, comment = ? WHERE id = ?',
      [rating, comment || null, id]
    );
    return res.json({ message: 'Rating updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStores, submitRating, updateRating };
