// pages/api/chat.js

import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { Configuration, OpenAIApi } from "openai";

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new IncomingForm();
    form.uploadDir = "./public/uploads"; // Ensure this directory exists
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Error parsing the file." });
        return;
      }

      const { input } = fields;
      const file = files.file[0];
      const filePath = path.join("./public/uploads", file.newFilename);

      try {
        // Read file content or process as needed
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Call Gemini API (example: OpenAI GPT-3)
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `${input}\n\nFile content: ${fileContent}`,
          max_tokens: 150,
        });

        res.status(200).json({ reply: response.data.choices[0].text });
      } catch (error) {
        res.status(500).json({ error: "Error processing the request." });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
