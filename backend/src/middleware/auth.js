const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const token = req.cookies?.savora_token;
  if (!token) {
    return res.status(401).json({ error: 'Giriş tələb olunur' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Sessiya etibarsızdır, yenidən daxil olun' });
  }
}

module.exports = { requireAdmin };
