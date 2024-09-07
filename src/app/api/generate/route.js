import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    console.log(req.method)
  if (req.method === "POST") {
    const { fileUri, mimeType, prompt } = req.body;

    try {
      // Initialize with the API key from environment variables
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let result;
      if (fileUri && mimeType) {
        // Send both file URI and text prompt to the AI model for analysis
        result = await model.generateContent([
          prompt, // Use the dynamic user prompt
          {
            fileData: {
              fileUri,
              mimeType,
            },
          },
        ]);
      } else {
        // No file, just send the prompt for text-based generation
        result = await model.generateContent([prompt]);
      }

      // Make sure to extract the content correctly based on the API response format
      res.status(200).json({ message: result.response.text() });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ error: "AI content generation failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

