const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');

const COOKIE_NAME = 'savora_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 gün

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: COOKIE_MAX_AGE,
});

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-poçt və şifrə tələb olunur' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVarChar(150), email)
      .query('SELECT id, email, password_hash FROM admin_users WHERE email = @email');

    const admin = result.recordset[0];
    if (!admin) {
      return res.status(401).json({ error: 'Yanlış e-poçt və ya şifrə' });
    }

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Yanlış e-poçt və ya şifrə' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie(COOKIE_NAME, token, cookieOptions());
    res.json({ admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Giriş zamanı xəta baş verdi' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.json({ message: 'Çıxış edildi' });
};

exports.me = (req, res) => {
  res.json({ admin: { id: req.admin.id, email: req.admin.email } });
};
