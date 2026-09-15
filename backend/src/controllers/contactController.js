const { sql, poolPromise } = require('../config/db');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.createContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Ad tələb olunur' });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Düzgün e-poçt ünvanı tələb olunur' });
  }
  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'Mesaj mətni tələb olunur' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar(120), name)
      .input('email', sql.NVarChar(150), email)
      .input('message', sql.NVarChar(sql.MAX), message)
      .query(`
        INSERT INTO contact_messages (name, email, message)
        OUTPUT INSERTED.*
        VALUES (@name, @email, @message)
      `);

    res.status(201).json({ ...result.recordset[0], message: 'Mesajınız uğurla göndərildi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Mesaj göndərilərkən xəta baş verdi' });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Mesajlar alınarkən xəta baş verdi' });
  }
};

exports.deleteMessage = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Yanlış mesaj ID-si' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM contact_messages WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Mesaj tapılmadı' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Mesaj silinərkən xəta baş verdi' });
  }
};
