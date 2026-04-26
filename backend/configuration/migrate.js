// migrate.js - Run only once to migrate image references from local filenames to Cloudinary URLs in ues.json and script.sql
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ues = JSON.parse(fs.readFileSync(path.join(__dirname, 'ues.json'), 'utf8'));

async function migrate() {
  const updated = [];

  for (const ue of ues) {
    const prefixe = ue.images.nom_original.split('.')[0]; 

    try {
      const searchResult = await cloudinary.search
        .expression(`public_id:${prefixe}*`) 
        .execute();

      if (searchResult.resources.length > 0) {
        const found = searchResult.resources[0]; 
        
        updated.push({
          ...ue,
          images: {
            nom_original: found.public_id,
            nom_stockage: found.secure_url, // "marie_atgpgz"
            extension: found.format,
          }
        });
        console.log(`Match : ${prefixe} -> ${found.public_id}`);
      } else {
        console.log(`Not found : ${prefixe}`);
        updated.push(ue); 
      }

    } catch (err) {
      console.error(`Error while searching ${prefixe}:`, err.message);
      updated.push(ue);
    }
  }

  fs.writeFileSync('./ues-migrated.json', JSON.stringify(updated, null, 2));
  console.log('\n🚀 Finished! Import ues-migrated.json into Atlas.');
}

async function migrateSql() {
    const sqlPath = path.join(__dirname, 'script.sql');
    let sqlContent = fs.readFileSync(sqlPath, 'utf8');

    const imageRegex = /'([^']+\.(?:jpg|jpeg|png))'/g;
    const matches = [...sqlContent.matchAll(imageRegex)];

    console.log(`🔎 ${matches.length} images trouvées dans le SQL. Recherche sur Cloudinary...`);

    for (const match of matches) {
        const fullMatch = match[0];
        const fileName = match[1]; 
        const prefix = fileName.split('.')[0]; 

        try {
            const searchResult = await cloudinary.search
                .expression(`public_id:${prefix}*`)
                .execute();

            if (searchResult.resources.length > 0) {
                const cloudinaryUrl = searchResult.resources[0].secure_url;
                sqlContent = sqlContent.split(fullMatch).join(`'${cloudinaryUrl}'`);
                console.log(`Replaced : ${fileName} -> ${cloudinaryUrl}`);
            } else {
                console.log(`Not found on Cloudinary : ${prefix}`);
            }
        } catch (err) {
            console.error(`Error for ${prefix}:`, err.message);
        }
    }

    fs.writeFileSync(path.join(__dirname, 'script_migrated.sql'), sqlContent);
    console.log('\n🚀 Finished! The file script_migrated.sql is ready.');
}

migrateSql();
migrate();