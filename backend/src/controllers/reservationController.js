const { sql, poolPromise } = require('../config/db');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;
const PHONE_RE = /^[+\d][\d\s\-()]{6,}$/;

exports.createReservation = async (req, res) => {
  const { name, phone, email, date, time, guests, table_number } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Ad tələb olunur' });
  }
  if (!phone || !PHONE_RE.test(String(phone).trim())) {
    return res.status(400).json({ error: 'Düzgün telefon nömrəsi tələb olunur' });
  }
  if (!date || !DATE_RE.test(date)) {
    return res.status(400).json({ error: 'Tarix YYYY-AA-GG formatında olmalıdır' });
  }
  const todayStr = new Date().toISOString().slice(0, 10);
  if (date < todayStr) {
    return res.status(400).json({ error: 'Keçmiş tarix üçün rezervasiya edilə bilməz' });
  }
  if (!time || !TIME_RE.test(time)) {
    return res.status(400).json({ error: 'Saat SS:DD formatında olmalıdır' });
  }
  const guestsNum = Number(guests);
  if (!Number.isInteger(guestsNum) || guestsNum <= 0) {
    return res.status(400).json({ error: 'Qonaq sayı müsbət tam ədəd olmalıdır' });
  }

  try {
    const pool = await poolPromise;

    if (table_number) {
      const overlap = await pool.request()
        .input('date', sql.Date, date)
        .input('time', sql.VarChar(8), time)
        .input('table_number', sql.Int, table_number)
        .query(`
          SELECT id FROM reservations
          WHERE table_number = @table_number
            AND [date] = @date
            AND status <> N'ləğv edildi'
            AND ABS(DATEDIFF(MINUTE, [time], CAST(@time AS TIME))) < 120
        `);

      if (overlap.recordset.length > 0) {
        return res.status(409).json({ error: 'Bu masa seçilmiş vaxt üçün artıq rezerv olunub' });
      }
    }

    const result = await pool.request()
      .input('name', sql.NVarChar(120), name)
      .input('phone', sql.NVarChar(30), phone)
      .input('email', sql.NVarChar(150), email || null)
      .input('date', sql.Date, date)
      .input('time', sql.VarChar(8), time)
      .input('guests', sql.Int, guestsNum)
      .input('table_number', sql.Int, table_number || null)
      .query(`
        INSERT INTO reservations (name, phone, email, [date], [time], guests, table_number)
        OUTPUT INSERTED.*
        VALUES (@name, @phone, @email, @date, @time, @guests, @table_number)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rezervasiya yaradılarkən xəta baş verdi' });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM reservations ORDER BY [date] DESC, [time] DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rezervasiyalar alınarkən xəta baş verdi' });
  }
};

const VALID_STATUSES = ['gözləyir', 'təsdiqləndi', 'ləğv edildi'];

exports.updateReservationStatus = async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Yanlış rezervasiya ID-si' });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status bunlardan biri olmalıdır: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar(20), status)
      .query('UPDATE reservations SET status = @status OUTPUT INSERTED.* WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Rezervasiya tapılmadı' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rezervasiya yenilənərkən xəta baş verdi' });
  }
};
