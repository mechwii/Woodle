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

module.exports = { getImagePath, deleteImage };
