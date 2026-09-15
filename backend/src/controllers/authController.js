const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');

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

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Giriş zamanı xəta baş verdi' });
  }
};
