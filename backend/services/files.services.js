/*
OLD VERSION - IGNORE => Now we are using a cloud storage (Cloudinary) for image management, so this local file handling code is no longer relevant.

const path = require('path');
const fs   = require('fs').promises;

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'images');
const UPLOAD = path.join(__dirname, '..', 'uploads');

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

  const targetDir  = path.join(UPLOAD, 'files', codeCours);
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

async function getCourseFilePath(codeCours, filename) {
  if (!codeCours || !filename) throw new Error('Paramètres manquants');

  const filePath = path.join(UPLOAD, 'files', codeCours, filename);
  await fs.access(filePath);           
  return filePath;
}

async function deleteCourseFile(codeCours, filename) {
  if (!codeCours || !filename) {
    throw new Error('Paramètres manquants');
  }

  const filePath = path.join(UPLOAD, 'files', codeCours, filename);

  await fs.access(filePath);
  await fs.unlink(filePath); 

  return { success: true, message: 'Fichier supprimé' };
}

*/

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary organize folder structure as "images/profiles/abc123" or "images/ues/def456" (as the previous local structure), so we can derive the folder from the mode
function getFolder(mode) {
  return ''
  //return mode === 'profile' ? 'images/profiles' : 'images/ues';
}

// Buffer to Cloudinary upload stream
function uploadStream(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/**
 * Save an image to Cloudinary
 * file: { buffer, originalname, size }
 * mode: 'profile' or 'ue' (determines folder)
 * Returns: { filename, path, extension, taille }
 */
async function saveImage(file, mode) {
  if (!file) throw new Error('Fichier manquant');

  const folder = getFolder(mode);
  const result = await uploadStream(file.buffer, {
    folder,
    resource_type: 'image',
    use_filename: false,  // Cloudinary will generate a unique filename
  });

  return {
    filename:  result.public_id,          // ex: "images/profiles/abc123"
    path:      result.secure_url,         // URL HTTPS publique
    extension: result.format,
    taille:    file.size,
  };
}

/**
 * Remove an image from Cloudinary
 * filename = public_id Cloudinary (ex: "images/profiles/abc123")
 */
async function deleteImage(filename, mode) {
  if (!filename) throw new Error('Fichier manquant');

  // We want to ignore deletion of default images, which can be passed as either a string or an object with .filename
  if (filename === 'default.jpg' || filename === 'default-ban.jpg') {
    return { success: true };
  }
  // If filename is an object with a .filename property, use that. Otherwise, use filename directly.
  const publicId = filename?.filename ?? filename;
  if (publicId === 'default.jpg' || publicId === 'default-ban.jpg') {
    return { success: true };
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  return { success: true };
}

function normalizePublicId(name, mode) {
  const folder = getFolder(mode);
  const nameWithoutExt = name.replace(/\.[^.]+$/, '');
  return `${folder}/${nameWithoutExt}`;
}

/**
 * Get image metadata from Cloudinary
 * name = public_id Cloudinary
 */
async function getImageMetadata(name, mode) {
  if (!name) throw new Error('Nom manquant');
  try {
    const publicId = normalizePublicId(name, mode);
    const result = await cloudinary.api.resource(publicId, { resource_type: 'image' });
    return {
      filename:  result.public_id,
      extension: result.format,
      path:      result.secure_url,
      size:      result.bytes,
    };
  } catch {
    throw new Error('Fichier non trouvé');
  }
}

/**
 * Get image URL from Cloudinary (replaces getImagePath)
 * filename = public_id Cloudinary
 */
async function getImagePath(filename, mode) {
  const meta = await getImageMetadata(filename, mode);
  return meta.path;
}

// ─── Class File ──────────────────────────────────────────────────────

/**
 * Save a course file to Cloudinary
 * file: { buffer, originalname, size }
 * codeCours: string (used as folder name)
 * Returns: { nom_original, nom_stockage, extension, taille, url }
 */
async function saveCourseFile(file, codeCours) {
  if (!file)      throw new Error('Fichier manquant');
  if (!codeCours) throw new Error('Code cours manquant');

  const folder = `files/${codeCours}`;
  const result = await uploadStream(file.buffer, {
    folder,
    resource_type: 'raw',           // PDF, DOCX, etc.
    use_filename:  true,
    unique_filename: true,
  });

  return {
    nom_original: file.originalname,
    nom_stockage: result.public_id, // ex: "files/INFO101/rapport_abc123"
    extension:    result.format || file.originalname.split('.').pop(),
    taille:       file.size,
    url:          result.secure_url,
  };
}

/**
 * Get course file URL from Cloudinary (replaces getCourseFilePath)
 */
async function getCourseFilePath(codeCours, filename) {
  if (!codeCours || !filename) throw new Error('Paramètres manquants');
  const publicId = `files/${codeCours}/${filename}`;
  try {
    const result = await cloudinary.api.resource(publicId, { resource_type: 'raw' });
    return result.secure_url;
  } catch {
    throw new Error('Fichier non trouvé');
  }
}

/**
 * Remove a course file from Cloudinary
 * filename = public_id Cloudinary (ex: "files/INFO101/rapport_abc123")
 */
async function deleteCourseFile(codeCours, filename) {
  if (!codeCours || !filename) throw new Error('Paramètres manquants');
  const publicId = `files/${codeCours}/${filename}`;
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  return { success: true, message: 'Fichier supprimé' };
}

module.exports = {
  getImagePath,
  deleteImage,
  saveImage,
  getImageMetadata,
  saveCourseFile,
  getCourseFilePath,
  deleteCourseFile,
};