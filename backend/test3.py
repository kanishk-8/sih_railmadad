import requests
import json

# API Base URL (Replace 'yourusername' with your actual PythonAnywhere username if hosted there)
BASE_URL = 'https://manasdhir.pythonanywhere.com'  # Update this to your actual API endpoint if deployed (e.g., 'https://yourusername.pythonanywhere.com')

# Test File Upload Endpoint
def test_upload_file(file_path):
    upload_url = f'{BASE_URL}/api/upload'
    files = {'file': open(file_path, 'rb')}

    # Send POST request with the file to the /api/upload endpoint
    response = requests.post(upload_url, files=files)
    print(response)
    if response.status_code == 200:
        print("File uploaded successfully!")
        print("Response:", response.json())
        return response.json()
    else:
        print("File upload failed!")
        print("Response:", response.json())
        return None

# Test Content Generation Endpoint
def test_generate_content(file_uri, mime_type, prompt):
    generate_url = f'{BASE_URL}/api/generate'
    payload = {
        'fileUri': file_uri,
        'mimeType': mime_type,
        'prompt': prompt
    }

    # Send POST request with the fileUri, mimeType, and prompt to the /api/generate endpoint
    response = requests.post(generate_url, json=payload)
    print(response)
    if response.status_code == 200:
        print("Content generated successfully!")
        print("Response:", response.json())
    else:
        print("Content generation failed!")
        print("Response:", response.json())

# Path to the file you want to upload
file_path = 'backend/static/badfood.jpeg'  # Replace this with the actual path to your file

# Step 1: Upload a file
upload_response = test_upload_file(file_path)

if upload_response:
    # Step 2: Use the fileUri from the upload response to generate AI content
    file_uri = upload_response.get('fileUri')
    mime_type = upload_response.get('mimeType')
    prompt = "Generate content based on this file"  # Replace with your actual prompt
    
    # Test the /api/generate endpoint
    test_generate_content(file_uri, mime_type, prompt)
