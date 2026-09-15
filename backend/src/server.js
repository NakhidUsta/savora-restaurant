require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { poolPromise } = require('./config/db');

const menuRoutes = require('./routes/menu');
const reservationRoutes = require('./routes/reservations');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Ümumi sorğu limiti — sui-istifadə/flood hücumlarına qarşı (bütün /api yollarına)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çox sayda sorğu göndərildi, bir az sonra yenidən cəhd edin' },
});
app.use('/api', generalLimiter);

// Sərt limit — admin girişini brute-force hücumlarından qorumaq üçün
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Çox sayda uğursuz giriş cəhdi. 15 dəqiqə sonra yenidən cəhd edin' },
});
app.use('/api/auth/login', loginLimiter);

app.get('/api/health', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request().query('SELECT 1 AS ok');
    res.json({ status: 'ok', database: 'qoşulub' });
  } catch (err) {
    res.status(500).json({ status: 'xəta', database: 'qoşulmayıb', error: err.message });
  }
});

app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tapılmadı' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server xətası baş verdi' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Savora backend http://localhost:${PORT} ünvanında işləyir`);
});
