import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import formidable from "formidable";
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for handling file uploads
  },
};

const formidable = require("formidable"); // For file parsing

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Failed to parse the file" });
        return;
      }

      const file = files.file; // Get the uploaded file from the request
      // If no file is uploaded, just return an empty response with success status.
      if (!file) {
        res.status(200).json({ fileUri: null, mimeType: null });
        return;
      }

      try {
        const fileManager = new GoogleAIFileManager('AIzaSyB69yTMIeO9VbqvlT9LR9AWipxZJfe9X6o'); // Use your environment variable
        const uploadResult = await fileManager.uploadFile(file.filepath, {
          mimeType: file.mimetype,
          displayName: file.originalFilename,
        });
        console.log(uploadResult)

        let uploadedFile = await fileManager.getFile(uploadResult.file.name);
        
        // Polling for the file state to check if it's finished processing
        while (uploadedFile.state === FileState.PROCESSING) {
          await new Promise((resolve) => setTimeout(resolve, 10_000)); // Sleep for 10 seconds
          uploadedFile = await fileManager.getFile(uploadResult.file.name);
        }

        if (uploadedFile.state === FileState.FAILED) {
          throw new Error("File processing failed.");
        }

        // Send back the file URI and mimeType for further use
        res.status(200).json({
          fileUri: uploadResult.file.uri,
          mimeType: file.mimetype,
        });
      } catch (error) {
        console.error("Error uploading file to Google Generative AI:", error);
        res.status(500).json({ error: "File upload failed" });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
