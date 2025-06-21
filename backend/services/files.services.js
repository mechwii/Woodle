const path = require('path');
const fs   = require('fs').promises;

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'profiles');

async function getImagePath(filename) {
  const filePath = path.join(UPLOAD_DIR, filename);
  await fs.access(filePath);
  return filePath;
}

async function deleteImage(filename) {
  const filePath = await getImagePath(filename);
  await fs.unlink(filePath);
  return { success: true };
}

module.exports = { getImagePath, deleteImage };
