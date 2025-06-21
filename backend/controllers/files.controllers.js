const  FileServices = require('../services/files.services');

exports.getImage = async (req, res) => {
  try {
    const filePath = await FileServices.getImagePath(req.params.name);
    // Exoress gère le contetn type
    res.sendFile(filePath, { headers: { 'Cache-Control': 'public,max-age=31536000' } });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Image introuvable' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await FileServices.deleteImage(req.params.name);
    res.status(200).json({ success: true, message: 'Image supprimée' });
  } catch (e) {
    console.error(e);
    res.status(404).json({ success: false, message: 'Image introuvable' });
  }
};