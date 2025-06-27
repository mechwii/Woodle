const  FileServices = require('../services/files.services');


exports.getImage = async (req, res) => {
  try {
    const mode = req.params.mode; 
    const name = req.params.name;  

    const filePath = await FileServices.getImagePath(name, mode);
    // Exoress gère le contetn type
    res.sendFile(filePath, { headers: { 'Cache-Control': 'public,max-age=31536000' } });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Image introuvable' });
  }
};

exports.getImageMetadata = async (req, res) => {
  try {
    const mode = req.params.mode;
    const name = req.params.name;

    const metadata = await FileServices.getImageMetadata(name, mode);

    res.status(200).json(
      metadata
    );
  } catch (e) {
    console.error(e);
    res.status(404).json({
      message: 'Image introuvable',
    });
  }
};


exports.deleteImage = async (req, res) => {
  try {
    const mode = req.params.mode; 
    const name = req.params.name; 
    await FileServices.deleteImage(name, mode);
    res.status(200).json({ success: true, message: 'Image supprimée' });
  } catch (e) {
    console.error(e);
    res.status(404).json({ success: false, message: 'Image introuvable' });
  }
};

exports.uploadImage = async (req, res) => {
    const mode = req.params.mode; 

  try {
    const metadata = await FileServices.saveImage(req.file, mode);
    console.log(metadata)
    res.status(201).json({ success: true, ...metadata });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.uploadCourseFile = async (req, res) => {
  const codeCours = req.params.code;   
  try {
    const metadata = await FileServices.saveCourseFile(req.file, codeCours);
    return res.status(201).json({
      metadata
    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      success : false,
      message : e.message
    });
  }
};

exports.getCourseFile = async (req, res) => {
  const { code, name } = req.params;
  try {
    const filePath = await FileServices.getCourseFilePath(code, name);
    res.sendFile(filePath, {
      headers: { 'Cache-Control': 'public, max-age=31536000' }
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: 'Fichier introuvable' });
  }
};