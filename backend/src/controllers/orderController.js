const { sql, poolPromise } = require('../config/db');

const PHONE_RE = /^[+\d][\d\s\-()]{6,}$/;

exports.createOrder = async (req, res) => {
  const { table_number, customer_name, phone, items } = req.body;

  if (!customer_name || !String(customer_name).trim()) {
    return res.status(400).json({ error: 'Müştəri adı tələb olunur' });
  }
  if (!phone || !PHONE_RE.test(String(phone).trim())) {
    return res.status(400).json({ error: 'Düzgün telefon nömrəsi tələb olunur' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Sifarişdə ən azı bir yemək olmalıdır' });
  }
  for (const item of items) {
    const qty = Number(item.quantity);
    if (!Number.isInteger(item.menu_item_id) || !Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Hər sifariş elementi düzgün menu_item_id və quantity daşımalıdır' });
    }
  }

  let transaction;
  try {
    const pool = await poolPromise;
    transaction = new sql.Transaction(pool);
    await transaction.begin();
    const request = new sql.Request(transaction);

    let total = 0;
    const priceRows = [];
    for (const item of items) {
      const priceResult = await new sql.Request(transaction)
        .input('id', sql.Int, item.menu_item_id)
        .query('SELECT id, price FROM menu_items WHERE id = @id');

      if (priceResult.recordset.length === 0) {
        throw Object.assign(new Error(`Menyu elementi tapılmadı: ${item.menu_item_id}`), { status: 400 });
      }
      const price = Number(priceResult.recordset[0].price);
      total += price * item.quantity;
      priceRows.push({ menu_item_id: item.menu_item_id, quantity: item.quantity, price });
    }

    const orderResult = await request
      .input('table_number', sql.Int, table_number || null)
      .input('customer_name', sql.NVarChar(120), customer_name)
      .input('phone', sql.NVarChar(30), phone)
      .input('total', sql.Decimal(10, 2), total)
      .query(`
        INSERT INTO orders (table_number, customer_name, phone, total)
        OUTPUT INSERTED.*
        VALUES (@table_number, @customer_name, @phone, @total)
      `);

    const order = orderResult.recordset[0];

    for (const row of priceRows) {
      await new sql.Request(transaction)
        .input('order_id', sql.Int, order.id)
        .input('menu_item_id', sql.Int, row.menu_item_id)
        .input('quantity', sql.Int, row.quantity)
        .input('price_at_order', sql.Decimal(10, 2), row.price)
        .query(`
          INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order)
          VALUES (@order_id, @menu_item_id, @quantity, @price_at_order)
        `);
    }

    await transaction.commit();
    res.status(201).json({ ...order, items: priceRows });
  } catch (err) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackErr) {
        console.error('Rollback xətası:', rollbackErr);
      }
    }
    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Sifariş yaradılarkən xəta baş verdi' });
  }
};

exports.getOrderById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Yanlış sifariş ID-si' });
  }

  try {
    const pool = await poolPromise;
    const orderResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM orders WHERE id = @id');

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Sifariş tapılmadı' });
    }

    const itemsResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT oi.id, oi.menu_item_id, mi.name, oi.quantity, oi.price_at_order
        FROM order_items oi
        LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
        WHERE oi.order_id = @id
      `);

    res.json({ ...orderResult.recordset[0], items: itemsResult.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sifariş məlumatı alınarkən xəta baş verdi' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sifarişlər alınarkən xəta baş verdi' });
  }
};

const VALID_ORDER_STATUSES = ['qəbul edildi', 'hazırlanır', 'hazırdır', 'çatdırıldı', 'ləğv edildi'];

exports.updateOrderStatus = async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Yanlış sifariş ID-si' });
  }
  if (!VALID_ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status bunlardan biri olmalıdır: ${VALID_ORDER_STATUSES.join(', ')}` });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar(20), status)
      .query('UPDATE orders SET status = @status OUTPUT INSERTED.* WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Sifariş tapılmadı' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sifariş yenilənərkən xəta baş verdi' });
  }
};
