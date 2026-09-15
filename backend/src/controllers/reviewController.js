const { sql, poolPromise } = require('../config/db');

exports.getApprovedReviews = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT id, name, rating, comment, created_at FROM reviews WHERE is_approved = 1 ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rəylər alınarkən xəta baş verdi' });
  }
};

exports.createReview = async (req, res) => {
  const { name, rating, comment } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Ad tələb olunur' });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: 'Reytinq 1 ilə 5 arasında tam ədəd olmalıdır' });
  }
  if (!comment || !String(comment).trim()) {
    return res.status(400).json({ error: 'Rəy mətni tələb olunur' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar(120), name)
      .input('rating', sql.Int, ratingNum)
      .input('comment', sql.NVarChar(sql.MAX), comment)
      .query(`
        INSERT INTO reviews (name, rating, comment, is_approved)
        OUTPUT INSERTED.*
        VALUES (@name, @rating, @comment, 0)
      `);

    res.status(201).json({ ...result.recordset[0], message: 'Rəyiniz göndərildi, təsdiqdən sonra saytda görünəcək' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rəy göndərilərkən xəta baş verdi' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT id, name, rating, comment, is_approved, created_at FROM reviews ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rəylər alınarkən xəta baş verdi' });
  }
};

exports.updateReviewStatus = async (req, res) => {
  const id = Number(req.params.id);
  const { is_approved } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Yanlış rəy ID-si' });
  }
  if (typeof is_approved !== 'boolean') {
    return res.status(400).json({ error: 'is_approved boolean olmalıdır' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('is_approved', sql.Bit, is_approved ? 1 : 0)
      .query('UPDATE reviews SET is_approved = @is_approved OUTPUT INSERTED.* WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Rəy tapılmadı' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rəy yenilənərkən xəta baş verdi' });
  }
};

exports.deleteReview = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Yanlış rəy ID-si' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM reviews WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Rəy tapılmadı' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rəy silinərkən xəta baş verdi' });
  }
};
