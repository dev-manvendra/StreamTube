import multer from "multer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const tempDir = resolve("public", "temp");

mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir)
  },
  filename: function (req, file, cb) {
    const extIndex = file.originalname.lastIndexOf(".")
    const ext = extIndex >= 0 ? file.originalname.slice(extIndex) : ""
    const baseName = extIndex >= 0 ? file.originalname.slice(0, extIndex) : file.originalname
    cb(null, `${Date.now()}-${baseName}${ext}`)
  }
})

export const upload = multer({
  storage: storage
})