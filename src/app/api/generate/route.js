import { GoogleGenerativeAI } from "@google/generative-ai";

// Named export for the POST method
export async function POST(req, res) {
  try {
    const { fileUri, mimeType, prompt } = await req.json(); // Parse JSON body

    // Initialize with the API key from environment variables
    const genAI = new GoogleGenerativeAI('AIzaSyB69yTMIeO9VbqvlT9LR9AWipxZJfe9X6o');
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

    // Return the AI-generated content
    return new Response(JSON.stringify({ message: result.response.text() }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(
      JSON.stringify({ error: "AI content generation failed" }),
      {
        status: 500,
      }
    );
  }
}

// For unsupported HTTP methods
export async function OPTIONS() {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405,
  });
}
