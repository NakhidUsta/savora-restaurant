const { sql, poolPromise } = require('../config/db');

exports.getSettings = async (req, res) => {
  try {
    const pool = await poolPromise;
    const settingsResult = await pool.request().query('SELECT [key], value FROM site_settings');
    const imagesResult = await pool.request().query('SELECT section_key, image_url, alt_text FROM site_images');

    const settings = {};
    settingsResult.recordset.forEach((row) => {
      settings[row.key] = row.value;
    });

    const images = {};
    imagesResult.recordset.forEach((row) => {
      images[row.section_key] = { url: row.image_url, alt: row.alt_text };
    });

    res.json({ ...settings, images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sayt ayarları alınarkən xəta baş verdi' });
  }
};

exports.updateSetting = async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (value === undefined) {
    return res.status(400).json({ error: 'value sahəsi tələb olunur' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('key', sql.NVarChar(80), key)
      .input('value', sql.NVarChar(sql.MAX), String(value))
      .query('UPDATE site_settings SET value = @value WHERE [key] = @key');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Belə bir ayar tapılmadı' });
    }
    res.json({ key, value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ayar yenilənərkən xəta baş verdi' });
  }
};

exports.updateImage = async (req, res) => {
  const { sectionKey } = req.params;
  const { image_url, alt_text } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: 'image_url sahəsi tələb olunur' });
  }

  try {
    const pool = await poolPromise;
    const existing = await pool.request()
      .input('section_key', sql.NVarChar(80), sectionKey)
      .query('SELECT id FROM site_images WHERE section_key = @section_key');

    if (existing.recordset.length === 0) {
      await pool.request()
        .input('section_key', sql.NVarChar(80), sectionKey)
        .input('image_url', sql.NVarChar(sql.MAX), image_url)
        .input('alt_text', sql.NVarChar(200), alt_text || null)
        .query('INSERT INTO site_images (section_key, image_url, alt_text) VALUES (@section_key, @image_url, @alt_text)');
    } else {
      await pool.request()
        .input('section_key', sql.NVarChar(80), sectionKey)
        .input('image_url', sql.NVarChar(sql.MAX), image_url)
        .input('alt_text', sql.NVarChar(200), alt_text || null)
        .query('UPDATE site_images SET image_url = @image_url, alt_text = @alt_text WHERE section_key = @section_key');
    }

    res.json({ section_key: sectionKey, image_url, alt_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Şəkil yenilənərkən xəta baş verdi' });
  }
};
