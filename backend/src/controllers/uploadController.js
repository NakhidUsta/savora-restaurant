exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Şəkil tapılmadı' });
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
};
