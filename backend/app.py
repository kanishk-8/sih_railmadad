import os
import time
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import google.generativeai as genai  # Replace with the correct package if necessary
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize the Google Generative AI client with your API key
api_key = "AIzaSyB69yTMIeO9VbqvlT9LR9AWipxZJfe9X6o"
genai.configure(api_key=api_key)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed extensions for upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4'}

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Endpoint to handle file uploads
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("No file part in request")
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']

    if file.filename == '':
        print("No selected file")
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Confirm file upload success
        print(f"File uploaded successfully: {filepath}")

        # Upload file to Google Generative AI
        myfile = genai.upload_file(filepath)
        print(f"File uploaded to Generative AI: {myfile.name}")

        # Handle video processing
        while myfile.state.name == "PROCESSING":
            print("Processing video...")
            time.sleep(5)
            myfile = genai.get_file(myfile.name)
        # Confirm that the video has finished processing
        print(f"Video processing completed for: {myfile.name}")
        
        # Return fileUri and mimeType for the client
        return jsonify({'fileUri': myfile.name, 'mimeType': file.content_type}), 200

    print(f"File not allowed: {file.filename}")
    return jsonify({'error': 'File not allowed'}), 400

# Endpoint to generate AI response based on file and prompt# Endpoint to generate AI response based on file and prompt
@app.route('/api/generate', methods=['POST'])
def generate_content():
    data = request.get_json()

    # Extract the fileUri, prompt, and mimeType from the request
    file_uri = data.get('fileUri')
    prompt = data.get('prompt')
    mime_type = data.get('mimeType')

    print(f"Received generate request - fileUri: {file_uri}, prompt: {prompt}, mimeType: {mime_type}")

    if not prompt and not file_uri:
        print("No prompt or fileUri provided")
        return jsonify({'error': 'Prompt or fileUri is required'}), 400

    try:
        # Call the Generative AI API with both file and text
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Prepare input, combining the file and the prompt
        input_data = []
        
        # Handle the case where there's a file
        if file_uri:
            file_uri = genai.get_file(file_uri)  # Fetch the file from the AI service
            input_data.append(file_uri)

        # Handle the case where there's a text prompt
        if prompt:
            input_data.append("\n\n" + prompt)  # Add prompt with proper formatting

        # Check if input_data is empty (should not happen due to earlier validation)
        if not input_data:
            print("No valid input data")
            return jsonify({'error': 'No valid input data'}), 400

        print(f"Sending request to Generative AI with input: {input_data}")
        result = model.generate_content(input_data)

        # Confirm the response from the AI
        print(f"AI Response: {result.text}")

        # Return the generated response to the client
        return jsonify({'message': result.text}), 200

    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({'error': 'Error generating AI response'}), 500


if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    print(f"Upload folder created at: {UPLOAD_FOLDER}")
    app.run(debug=True, port=5000)
