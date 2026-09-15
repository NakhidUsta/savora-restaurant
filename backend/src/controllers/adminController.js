const { poolPromise } = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const pool = await poolPromise;
    const query = (table) => pool.request().query(`SELECT COUNT(*) AS count FROM ${table}`);

    const [menuItems, reservations, orders, pendingReviews, messages] = await Promise.all([
      query('menu_items'),
      query('reservations'),
      query('orders'),
      pool.request().query('SELECT COUNT(*) AS count FROM reviews WHERE is_approved = 0'),
      query('contact_messages'),
    ]);

    res.json({
      menuItems: menuItems.recordset[0].count,
      reservations: reservations.recordset[0].count,
      orders: orders.recordset[0].count,
      pendingReviews: pendingReviews.recordset[0].count,
      messages: messages.recordset[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Statistika alınarkən xəta baş verdi' });
  }
};
