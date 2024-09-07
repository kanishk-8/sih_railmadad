import fs from 'fs';
import path from 'path';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const fileManager = new GoogleAIFileManager('AIzaSyB69yTMIeO9VbqvlT9LR9AWipxZJfe9X6o');

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle multipart form manually
  },
};

// Helper to handle saving uploaded files
async function saveUploadedFile(req) {
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const boundary = req.headers['content-type'].split('boundary=')[1];
  let body = '';

  // Collect the file upload data
  await new Promise((resolve, reject) => {
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => resolve());
    req.on('error', err => reject(err));
  });

  // Extract file content from the multipart form-data
  const fileData = body.split(`--${boundary}`).filter(part => part.includes('Content-Disposition'))[0];
  const [header, content] = fileData.split('\r\n\r\n');
  const filenameMatch = /filename="([^"]+)"/.exec(header);
  const filename = filenameMatch ? filenameMatch[1] : `file-${Date.now()}`;

  // Save the file locally
  const filePath = path.join(uploadDir, filename.trim());
  fs.writeFileSync(filePath, content.split('\r\n')[0], 'binary');

  return filePath;
}

// Named export for the POST method
export async function POST(req) {
  try {
    // Save the uploaded file locally
    const savedFilePath = await saveUploadedFile(req);
    console.log(`File saved locally at: ${savedFilePath}`);

    // Upload the file to Google Generative AI (Gemini)
    const uploadResult = await fileManager.uploadFile(savedFilePath, {
      mimeType: 'image/png', // Adjust based on the file type
      displayName: path.basename(savedFilePath),
    });

    console.log(`Uploaded file: ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

    // Initialize Google Generative AI (Gemini)
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Send the uploaded file to Google Generative AI for content generation
    const result = await model.generateContent([
      'Tell me about this image.',
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    // Respond with the generated content
    return new Response(
      JSON.stringify({
        message: result.response.text(),
        fileUri: uploadResult.file.uri,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error during file upload or processing:', error);
    return new Response(
      JSON.stringify({ error: 'File upload or processing failed.', details: error.message }),
      {
        status: 500,
      }
    );
  }
}

// For unsupported HTTP methods
export async function OPTIONS() {
  return new Response(
    JSON.stringify({ message: 'Method not allowed' }),
    {
      status: 405,
    }
  );
}
