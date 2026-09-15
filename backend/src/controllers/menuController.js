const { sql, poolPromise } = require('../config/db');

exports.getAllMenuItems = async (req, res) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    let query = 'SELECT id, name, description, price, image_url, category, is_new, created_at FROM menu_items';

    const { category } = req.query;
    if (category) {
      query += ' WHERE category = @category';
      request.input('category', sql.NVarChar(60), category);
    }
    query += ' ORDER BY id ASC';

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Menyu siyahısı alınarkən xəta baş verdi' });
  }
};

exports.getMenuItemById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Yanlış yemək ID-si' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id, name, description, price, image_url, category, is_new, created_at FROM menu_items WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Yemək tapılmadı' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yemək məlumatı alınarkən xəta baş verdi' });
  }
};

function validateMenuItemBody(body) {
  const { name, price, category } = body;
  if (!name || !String(name).trim()) return 'Ad tələb olunur';
  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum < 0) return 'Qiymət düzgün deyil';
  if (!category || !String(category).trim()) return 'Kateqoriya tələb olunur';
  return null;
}

exports.createMenuItem = async (req, res) => {
  const validationError = validateMenuItemBody(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, description, price, image_url, category, is_new } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar(120), name)
      .input('description', sql.NVarChar(sql.MAX), description || null)
      .input('price', sql.Decimal(10, 2), Number(price))
      .input('image_url', sql.NVarChar(sql.MAX), image_url || null)
      .input('category', sql.NVarChar(60), category)
      .input('is_new', sql.Bit, is_new ? 1 : 0)
      .query(`
        INSERT INTO menu_items (name, description, price, image_url, category, is_new)
        OUTPUT INSERTED.*
        VALUES (@name, @description, @price, @image_url, @category, @is_new)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yemək əlavə edilərkən xəta baş verdi' });
  }
};

exports.updateMenuItem = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Yanlış yemək ID-si' });
  }

  const validationError = validateMenuItemBody(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, description, price, image_url, category, is_new } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar(120), name)
      .input('description', sql.NVarChar(sql.MAX), description || null)
      .input('price', sql.Decimal(10, 2), Number(price))
      .input('image_url', sql.NVarChar(sql.MAX), image_url || null)
      .input('category', sql.NVarChar(60), category)
      .input('is_new', sql.Bit, is_new ? 1 : 0)
      .query(`
        UPDATE menu_items
        SET name = @name, description = @description, price = @price,
            image_url = @image_url, category = @category, is_new = @is_new
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Yemək tapılmadı' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yemək yenilənərkən xəta baş verdi' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Yanlış yemək ID-si' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM menu_items WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Yemək tapılmadı' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yemək silinərkən xəta baş verdi' });
  }
};
