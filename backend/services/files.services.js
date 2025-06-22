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
  const originalPath = file.path; // Le chemin où Multer a stocké temporairement le fichier

  // Assure que le dossier cible existe
  await fs.mkdir(targetDir, { recursive: true });

  // Déplace le fichier (ou copie et supprime si nécessaire)
  await fs.rename(originalPath, targetPath); // move

  return {
    filename: file.filename,
    path: `/images/${fileDirectory}/${file.filename}`
  };
}

module.exports = { getImagePath, deleteImage , saveImage};
