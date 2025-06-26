const path = require('path');
const fs   = require('fs').promises;

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'images');

async function getImagePath(filename, mode) {
  const fileDirectory =  mode === 'profile' ? 'profiles' : 'ues'
  const filePath = path.join(UPLOAD_DIR, fileDirectory ,filename);
  await fs.access(filePath);
  return filePath;
}

async function deleteImage(filename, mode) {
  if (!filename) {
    throw new Error('Fichier manquant');
  }

  if(filename && filename.filename && filename.filename === 'default.jpg' || filename.filename === 'default-ban.jpg' )
      return { success: true };

  
  const filePath = await getImagePath(filename, mode);
  await fs.unlink(filePath);
  return { success: true };
}

/**
 * Sauvegarde une image uploadée dans le bon dossier selon son mode
 */
async function saveImage(file, mode) {
  if (!file) {
    throw new Error('Fichier manquant');
  }

  const fileDirectory = mode === 'profile' ? 'profiles' : 'ues';
  const targetDir = path.join(UPLOAD_DIR, fileDirectory);
  console.log(targetDir)
  const targetPath = path.join(targetDir, file.filename);
  const originalPath = file.path;

  await fs.mkdir(targetDir, { recursive: true });

  await fs.rename(originalPath, targetPath); // move

  return {
    filename: file.filename,
    path: `/images/${fileDirectory}/${file.filename}`,
    extension: path.extname(file.originalname).substring(1),
    taille: file.size
  };
}

async function saveCourseFile(file, codeCours) {
  if (!file) {
    throw new Error('Fichier manquant');
  }
  if (!codeCours) {
    throw new Error('Code cours manquant');
  }

  const targetDir  = path.join(UPLOAD_DIR, 'files', codeCours);
  const targetPath = path.join(targetDir, file.filename);

  await fs.mkdir(targetDir, { recursive: true });  
  await fs.rename(file.path, targetPath);          

  return {
    nom_original : file.originalname,
    nom_stockage : `uploads/files/${codeCours}/${file.filename}`,
    extension    : path.extname(file.originalname).substring(1),
    taille       : file.size
  };
}

async function getImageMetadata(name, mode)  {
    const filePath = await getImagePath(name, mode);

  try {
    const stats = await fs.stat(filePath);

    return {
      filename: name,
      extension: path.extname(name),
      path: filePath,
      size: stats.size,
    };
  } catch (err) {
    throw new Error('Fichier non trouvé');
  }
};

module.exports = { getImagePath, deleteImage , saveImage, getImageMetadata};
