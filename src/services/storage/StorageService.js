const fs = require("fs");
const crypto = require("crypto");
const mime = require("mime-types");

class StorageService {
  constructor(folder) {
    this.folder = folder;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const ext = mime.extension(meta.headers["content-type"]);
    const randomName = crypto.randomUUID();
    const filename = `${randomName}.${ext}`;
    const path = `${this.folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on("error", (error) => reject(error));
      file.pipe(fileStream);
      file.on("end", () => resolve(filename));
    });
  }
}

module.exports = StorageService;
