const FileServices = require('../services/files.services');

// ─── Images ──────────────────────────────────────────────────────────────────

exports.getImage = async (req, res) => {
  try {
    const { mode, name } = req.params;
    const url = await FileServices.getImagePath(name, mode); // retourne secure_url Cloudinary
    res.status(200).json({ url });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Image introuvable' });
  }
};

exports.getImageMetadata = async (req, res) => {
  try {
    const { mode, name } = req.params;
    const metadata = await FileServices.getImageMetadata(name, mode);
    res.status(200).json(metadata);
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Image introuvable' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { mode, name } = req.params;
    await FileServices.deleteImage(name, mode);
    res.status(200).json({ success: true, message: 'Image supprimée' });
  } catch (e) {
    console.error(e);
    res.status(404).json({ success: false, message: 'Image introuvable' });
  }
};

exports.uploadImage = async (req, res) => {
  const { mode } = req.params;
  try {
    const metadata = await FileServices.saveImage(req.file, mode);
    res.status(201).json({ success: true, ...metadata });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: e.message });
  }
};

// ─── Fichiers de cours ───────────────────────────────────────────────────────

exports.uploadCourseFile = async (req, res) => {
  const { code } = req.params;
  try {
    const metadata = await FileServices.saveCourseFile(req.file, code);
    res.status(201).json(metadata);
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.getCourseFile = async (req, res) => {
  const { code, name } = req.params;
  try {
    const url = await FileServices.getCourseFilePath(code, name); // retourne secure_url Cloudinary
    res.redirect(url); // redirige directement vers Cloudinary
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Fichier introuvable' });
  }
};

exports.deleteCourseFile = async (req, res) => {
  const { code, name } = req.params;
  try {
    await FileServices.deleteCourseFile(code, name);
    res.status(200).json({ success: true, message: 'Fichier supprimé' });
  } catch (e) {
    console.error(e);
    res.status(404).json({ success: false, message: e.message });
  }
};