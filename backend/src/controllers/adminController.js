const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Dashboard stats
const getDashboard = async (req, res) => {
  try {
    const [[usersRow]] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const [[storesRow]] = await pool.query('SELECT COUNT(*) AS total FROM stores');
    const [[ratingsRow]] = await pool.query('SELECT COUNT(*) AS total FROM ratings');

    return res.json({
      totalUsers: usersRow.total,
      totalStores: storesRow.total,
      totalRatings: ratingsRow.total,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Helper: build filter/sort clauses
const buildListQuery = (base, params, allowedFilters, allowedSort) => {
  const { name, email, address, role, sortBy, order } = params;
  const conditions = [];
  const values = [];

  if (name && allowedFilters.includes('name')) {
    conditions.push('name LIKE ?');
    values.push(`%${name}%`);
  }
  if (email && allowedFilters.includes('email')) {
    conditions.push('email LIKE ?');
    values.push(`%${email}%`);
  }
  if (address && allowedFilters.includes('address')) {
    conditions.push('address LIKE ?');
    values.push(`%${address}%`);
  }
  if (role && allowedFilters.includes('role')) {
    conditions.push('role = ?');
    values.push(role);
  }

  let query = base;
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');

  const sortCol = allowedSort.includes(sortBy) ? sortBy : allowedSort[0];
  const sortDir = order === 'desc' ? 'DESC' : 'ASC';
  query += ` ORDER BY ${sortCol} ${sortDir}`;

  return { query, values };
};

// List users
const getUsers = async (req, res) => {
  try {
    const base = 'SELECT id, name, email, address, role, created_at FROM users';
    const { query, values } = buildListQuery(
      base,
      req.query,
      ['name', 'email', 'address', 'role'],
      ['name', 'email', 'address', 'role', 'created_at']
    );
    const [rows] = await pool.query(query, values);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get single user detail
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = rows[0];

    if (user.role === 'owner') {
      const [[ratingRow]] = await pool.query(
        `SELECT ROUND(AVG(r.rating), 2) AS avg_rating
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = ?`,
        [id]
      );
      user.avg_rating = ratingRow.avg_rating;
    }

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create user (any role)
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const validRoles = ['admin', 'user', 'owner'];
    if (!validRoles.includes(role)) {
      return res.status(422).json({ message: 'Invalid role' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address, role]
    );

    return res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List stores with avg rating
const getStores = async (req, res) => {
  try {
    const base = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
             ROUND(AVG(r.rating), 2) AS avg_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      GROUP BY s.id
    `;

    const { name, email, address, sortBy, order } = req.query;
    const conditions = [];
    const values = [];

    if (name) { conditions.push('s.name LIKE ?'); values.push(`%${name}%`); }
    if (email) { conditions.push('s.email LIKE ?'); values.push(`%${email}%`); }
    if (address) { conditions.push('s.address LIKE ?'); values.push(`%${address}%`); }

    let query;
    if (conditions.length) {
      query = `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
                      ROUND(AVG(r.rating), 2) AS avg_rating
               FROM stores s
               LEFT JOIN ratings r ON r.store_id = s.id
               WHERE ${conditions.join(' AND ')}
               GROUP BY s.id`;
    } else {
      query = base;
    }

    const allowedSort = ['name', 'email', 'address', 'avg_rating', 'created_at'];
    const sortCol = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortDir = order === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortCol} ${sortDir}`;

    const [rows] = await pool.query(query, values);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get single store detail with ratings
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const [storeRows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
              u.name AS owner_name
       FROM stores s
       LEFT JOIN users u ON u.id = s.owner_id
       WHERE s.id = ?`,
      [id]
    );

    if (storeRows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const store = storeRows[0];

    const [[ratingRow]] = await pool.query(
      'SELECT ROUND(AVG(rating), 2) AS avg_rating, COUNT(*) AS total_ratings FROM ratings WHERE store_id = ?',
      [id]
    );

    const [ratings] = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.id AS user_id, u.name, u.email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    return res.json({
      ...store,
      avg_rating: ratingRow.avg_rating,
      total_ratings: ratingRow.total_ratings,
      ratings,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update store
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, owner_id } = req.body;

    const [existing] = await pool.query('SELECT id FROM stores WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const [emailConflict] = await pool.query(
      'SELECT id FROM stores WHERE email = ? AND id != ?',
      [email, id]
    );
    if (emailConflict.length > 0) {
      return res.status(409).json({ message: 'Email already in use by another store' });
    }

    if (owner_id) {
      const [ownerRows] = await pool.query(
        "SELECT id FROM users WHERE id = ? AND role = 'owner'",
        [owner_id]
      );
      if (ownerRows.length === 0) {
        return res.status(422).json({ message: 'owner_id must reference a user with role owner' });
      }
    }

    await pool.query(
      'UPDATE stores SET name = ?, email = ?, address = ?, owner_id = ? WHERE id = ?',
      [name, email, address, owner_id || null, id]
    );

    return res.json({ message: 'Store updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create store
const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const [existing] = await pool.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Store email already registered' });
    }

    if (owner_id) {
      const [ownerRows] = await pool.query(
        "SELECT id FROM users WHERE id = ? AND role = 'owner'",
        [owner_id]
      );
      if (ownerRows.length === 0) {
        return res.status(422).json({ message: 'owner_id must reference a user with role owner' });
      }
    }

    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );

    return res.status(201).json({ message: 'Store created', storeId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard, getUsers, getUserById, createUser, getStores, getStoreById, updateStore, createStore };
