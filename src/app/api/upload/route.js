// pages/api/upload.js

import formidable from "formidable";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const form = new formidable.IncomingForm({
  keepExtensions: true, // Keep the file extensions
  uploadDir: path.join(process.cwd(), "public/uploads"), // Directory to save the files
});

const mkdir = promisify(fs.mkdir);

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const file = files.file[0]; // Assuming 'file' is the field name

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate a unique file name
      const fileName = `${Date.now()}-${file.originalFilename}`;
      const filePath = path.join(uploadDir, fileName);

      // Move the file to the desired location
      fs.renameSync(file.filepath, filePath);

      // Respond with the file URL
      const fileUri = `/uploads/${fileName}`;
      res.status(200).json({ fileUri, mimeType: file.mimetype });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ error: "File upload failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
