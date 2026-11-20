import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const unlinkFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error("Failed to delete temp file:", filePath, error)
  }
}

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null

  if (!fs.existsSync(localFilePath)) {
    console.error(`Cloudinary upload skipped: file not found at ${localFilePath}`)
    return null
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })

    unlinkFile(localFilePath)
    return response

  } catch (error) {
    console.error("Cloudinary upload failed:", error?.message || error)
    unlinkFile(localFilePath)
    return null
  }
}

export default uploadOnCloudinary