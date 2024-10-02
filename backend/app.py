import os
import time
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import google.generativeai as genai  # Replace with the correct package if necessary
from flask_cors import CORS
import re
from database import db,TrainComplaint,StationComplaint,Appreciation,Enquiry,Suggestion

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI']="sqlite:///IESCP.db"
db.init_app(app)
app.app_context().push()
# Initialize the Google Generative AI client with your API key
api_key = "AIzaSyB69yTMIeO9VbqvlT9LR9AWipxZJfe9X6o"
genai.configure(api_key=api_key)

# Configure upload folder
UPLOAD_FOLDER = 'static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed extensions for upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4','mp3'}
import os

def extract_filename(image_path):
    # Define a regular expression pattern to capture the filename after the last directory
    pattern = re.compile(r'[^/\\]+$')
    match = pattern.search(image_path)
    return match.group(0) if match else image_path

def get_full_image_path(image_path):
    if image_path:
        # Define the base URL where images are served
        base_url = "http://localhost:5000/static/"
        # Extract the filename from the full path
        filename = extract_filename(image_path)
        # Construct the full URL path
        return os.path.join(base_url, filename)
    return None  # Return None if image_path is None or empty
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
        return jsonify({'fileUri': myfile.name, 'mimeType': file.content_type,'path':filepath}), 200

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

import json
import time

@app.route('/api/train-complaint', methods=['POST'])
def train_complaint():
    data = request.get_json()
    user_id = data.get('userId')
    email = data.get('email')
    pnr = data.get('pnr')
    file_uri = data.get('fileUri')
    mime_type = data.get('mimeType')
    prompt = data.get('prompt')
    path = data.get('path')

    # Ensure required data is present
    if not user_id or not email or not prompt:
        return jsonify({'error': 'User ID, email, and prompt are required'}), 400

    try:
        # Initialize the Generative AI model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Construct the prompt for the AI model with strict category enforcement and relevance flag
        ai_prompt = (
            f"You are a rail assistance chatbot. The user has given the following complaint with an associated file:\n"
            f"Complaint Description: {prompt}\n\n"
            f"Based on the above details, please provide a categorized response in the following JSON format:\n"
            f"{{'description': '', 'category': '', 'priority': '', 'isRelevant': true/false}}.\n\n"
            f"The 'description' should be a summary of the problem description which can be shown to the user, it should contain any metadata or textual data present in the added files also. The 'category' must be one of the "
            f"following strictly:Medical Assistance,Security,Divyangjan Facilities,Facilities for Women with Special needs,Electrical Equipment,Coach - Cleanliness,Punctuality,Water Availability,Coach - Maintenance,Catering & Vending Services,Staff Behaviour,Corruption / Bribery,Bed Roll,Miscellaneous. "
            f"Any category not in this list should not be provided. The 'priority' should be High, Medium, or Low. If the prompt or the request or the file content is not relevant to rail assistance, set 'isRelevant' to false.Dont include any apostrophe in the description"
        )

        # Prepare input data
        input_data = [ai_prompt]

        # Add file if available
        if file_uri:
            file = genai.get_file(file_uri)  # Fetch the file from the AI service
            input_data.append(file)

        # Generate AI response
        print(f"Sending request to Generative AI with input: {input_data}")
        response = model.generate_content(input_data)
        
        # Extract JSON response from AI
        print(f"AI Response: {response.text}")
        json_match = re.search(r'\{.*?\}', response.text, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON object found in the AI response.")
        json_string = json_match.group(0).replace("'", '"')

        # Safely parse the AI response using json.loads
        ai_response = json.loads(json_string)

        # Check if the complaint is relevant
        if not ai_response.get('isRelevant', True):
            return jsonify({
                'message': 'The complaint is not relevant to rail assistance. Please enter information related to rail assistance.',
                'isRelevant': False
            }), 200

        # Add a random complaint number for now
        new_complaint = TrainComplaint(
            category=ai_response.get('category'),
            priority=ai_response.get('priority'),
            description=ai_response.get('description'),
            status='Pending',  # Default status
            image_path=path,  # Path to the image
            pnr_number=pnr,
            user_email=email,
            user_userid=user_id
        )

        # Add the complaint to the database
        db.session.add(new_complaint)
        db.session.commit()
        ai_response['complaintNumber'] = new_complaint.complaint_number

        # Return the AI-generated response
        return jsonify(ai_response), 200

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from AI response: {e}")
        return jsonify({'error': 'Invalid JSON format in AI response'}), 500
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({'error': 'Error generating AI response'}), 500

@app.route('/api/validate-station-complaint', methods=['POST'])
def validate_station_complaint():
    data = request.get_json()
    input_text = data.get('input')

    if not input_text:
        return jsonify({'error': 'Input text is required'}), 400

    try:
        # Initialize the Generative AI model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Prompt for extracting station name and incident date
        ai_prompt = (
            f"You are a helpful assistant. Extract the station name and incident date from the following input:, the date should be in (day/month/year) format, this should be strictly followed, if no year is given assume 2024 \n\n"
            f"Input: {input_text}\n\n"
            f"Please return a JSON object in the following format:\n"
            f"{{'stationName': '', 'incidentDate': ''}}.\n\n"
            f"If the station name or date cannot be found, set the value to null."
        )

        # Send the input to the AI model
        input_data = [ai_prompt]
        print(f"Sending request to Gemini AI with input: {input_data}")
        response = model.generate_content(input_data)

        # Extract JSON response from AI
        print(f"AI Response: {response.text}")
        json_match = re.search(r'\{.*?\}', response.text, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON object found in the AI response.")
        json_string = json_match.group(0).replace("'", '"')

        # Safely parse the AI response using json.loads
        ai_response = json.loads(json_string)

        # Ensure stationName and incidentDate are present
        station_name = ai_response.get('stationName')
        incident_date = ai_response.get('incidentDate')

        # Return the extracted values or null if not found
        return jsonify({
            'stationName': station_name if station_name else None,
            'incidentDate': incident_date if incident_date else None
        }), 200

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from AI response: {e}")
        return jsonify({'error': 'Invalid JSON format in AI response'}), 500
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({'error': 'Error generating AI response'}), 500

@app.route('/api/station-complaint', methods=['POST'])
def station_complaint():
    data = request.get_json()
    user_id = data.get('userId')
    email = data.get('email')
    location = data.get('location')
    incident_date = data.get('incidentDate')
    file_uri = data.get('fileUri')
    mime_type = data.get('mimeType')
    prompt = data.get('prompt')
    path = data.get('path')
    
    # Ensure required data is present
    if not user_id or not email or not prompt or not location or not incident_date:
        return jsonify({'error': 'User ID, email, prompt, location, and incident date are required'}), 400

    try:
        # Initialize the Generative AI model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Construct the prompt for the AI model with strict category enforcement and relevance flag
        ai_prompt = (
            f"You are a rail assistance chatbot. The user has given the following station-related complaint with an associated file:\n"
            f"Complaint Description: {prompt}\n\n"
            f"Incident Location: {location}\n"
            f"Incident Date: {incident_date}\n\n"
            f"Based on the above details, please provide a categorized response in the following JSON format:\n"
            f"{{'description': '', 'category': '', 'priority': '', 'isRelevant': true/false}}.\n\n"
            f"The 'description' should be a summary of the problem description which can be shown to the user, it can contain any metadata or textual data present in the added files also. The 'category' must be one of the "
            f"following strictly:Medical Assistance,Security,Divyangjan Facilities,Facilities for Women with Special needs,Unreserved Ticketing,Luggage / Parcels,Reserved Ticketing,Refund of Tickets,Passenger Amenities,Electrical Equipment,Staff Behaviour,Cleanliness,Catering & Vending Services,Water Availability,Goods,Corruption / Bribery,Miscellaneous. "
            f"Any category not in this list should not be provided. The 'priority' should be High, Medium, or Low. If the prompt or the request or the file content is not relevant to rail assistance, set 'isRelevant' to false.Dont include any apostrophe in the description"
        )

        # Prepare input data
        input_data = [ai_prompt]

        # Add file if available
        if file_uri:
            file = genai.get_file(file_uri)  # Fetch the file from the AI service
            input_data.append(file)

        # Generate AI response
        print(f"Sending request to Generative AI with input: {input_data}")
        response = model.generate_content(input_data)
        
        # Extract JSON response from AI
        print(f"AI Response: {response.text}")
        json_match = re.search(r'\{.*?\}', response.text, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON object found in the AI response.")
        json_string = json_match.group(0).replace("'", '"')

        # Safely parse the AI response using json.loads
        ai_response = json.loads(json_string)

        # Check if the complaint is relevant
        if not ai_response.get('isRelevant', True):
            return jsonify({
                'message': 'The complaint is not relevant to rail assistance. Please enter information related to rail assistance.',
                'isRelevant': False
            }), 200

        # Add a random complaint number for now
        new_complaint = StationComplaint(
            category=ai_response.get('category'),
            priority=ai_response.get('priority'),
            description=ai_response.get('description'),
            status='Pending',  # Default status
            image_path=path,  # Path to the image
            station_location=location,
            incident_date=incident_date,
            user_email=email,
            user_userid=user_id
        )

        # Add the complaint to the database
        db.session.add(new_complaint)
        db.session.commit()
        ai_response['complaintNumber'] = new_complaint.complaint_number

        # Return the AI-generated response
        return jsonify(ai_response), 200

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from AI response: {e}")
        return jsonify({'error': 'Invalid JSON format in AI response'}), 500
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({'error': 'Error generating AI response'}), 500

@app.route('/api/show-train-complaints', methods=['GET'])
def get_train_complaints():
    try:
        # Query all train complaints
        train_complaints = TrainComplaint.query.all()
        
        # Format the data to be returned as JSON
        complaints_list = []
        for complaint in train_complaints:
            complaints_list.append({
                'complaint_number': complaint.complaint_number,
                'category': complaint.category,
                'priority': complaint.priority,
                'description': complaint.description,
                'status': complaint.status,
                'image_path': get_full_image_path(complaint.image_path) if complaint.image_path else None,  # Full path for image if exists
                'pnr_number': complaint.pnr_number,
                'user_email': complaint.user_email,
                'user_userid': complaint.user_userid
            })
        
        return jsonify({'train_complaints': complaints_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/show-station-complaints', methods=['GET'])
def get_station_complaints():
    try:
        # Query all station complaints
        station_complaints = StationComplaint.query.all()

        # Format the data to be returned as JSON
        complaints_list = []
        for complaint in station_complaints:
            complaints_list.append({
                'complaint_number': complaint.complaint_number,
                'category': complaint.category,
                'priority': complaint.priority,
                'description': complaint.description,
                'status': complaint.status,
                'image_path': get_full_image_path(complaint.image_path) if complaint.image_path else None,  # Full path for image if exists
                'station_location': complaint.station_location,
                'incident_date': complaint.incident_date,
                'user_email': complaint.user_email,
                'user_userid': complaint.user_userid
            })
        
        return jsonify({'station_complaints': complaints_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/update-train-complaint/<complaint_number>', methods=['PUT'])
def update_train_complaint_status(complaint_number):
    try:
        # Get the complaint from the database by complaint number
        complaint = TrainComplaint.query.filter_by(complaint_number=complaint_number).first()

        if not complaint:
            return jsonify({'error': 'Train complaint not found'}), 404

        # Get the new status from the request body
        new_status = request.json.get('status')
        if new_status not in ['Under Review', 'Resolved']:
            return jsonify({'error': 'Invalid status. Status must be "Under Review" or "Resolved".'}), 400

        # Update the complaint status
        complaint.status = new_status
        db.session.commit()

        return jsonify({'message': f'Train complaint {complaint_number} status updated to {new_status}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Function to update the status of a station complaint
@app.route('/api/update-station-complaint/<complaint_number>', methods=['PUT'])
def update_station_complaint_status(complaint_number):
    try:
        # Get the complaint from the database by complaint number
        complaint = StationComplaint.query.filter_by(complaint_number=complaint_number).first()

        if not complaint:
            return jsonify({'error': 'Station complaint not found'}), 404

        # Get the new status from the request body
        new_status = request.json.get('status')
        if new_status not in ['Under Review', 'Resolved']:
            return jsonify({'error': 'Invalid status. Status must be "Under Review" or "Resolved".'}), 400

        # Update the complaint status
        complaint.status = new_status
        db.session.commit()

        return jsonify({'message': f'Station complaint {complaint_number} status updated to {new_status}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/track-complaint-status', methods=['POST'])
def track_complaint_status():
    data = request.get_json()
    input_text = data.get('input')

    if not input_text:
        return jsonify({'error': 'Input text is required'}), 400

    try:
        # Initialize the Generative AI model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Prompt for extracting complaint number from the input
        ai_prompt = (
            f"You are a helpful assistant. Extract the complaint number from the following input. Note that this is a fake detail and not actual. "
            f"Input: {input_text}\n\n"
            f"Please return the complaint number in the following format:\n"
            f"{{'complaintNumber': ''}}.\n\n"
            f"If the complaint number cannot be found, set the value to null."
        )

        # Send the input to the AI model
        input_data = [ai_prompt]
        print(f"Sending request to Gemini AI with input: {input_data}")
        response = model.generate_content(input_data)

        # Extract JSON response from AI
        print(f"AI Response: {response.text}")
        json_match = re.search(r'\{.*?\}', response.text, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON object found in the AI response.")
        json_string = json_match.group(0).replace("'", '"')

        # Safely parse the AI response using json.loads
        ai_response = json.loads(json_string)

        # Extract complaint number
        complaint_number = ai_response.get('complaintNumber')
        print(complaint_number)
        if not complaint_number:
            return jsonify({'error': 'Complaint number not found'}), 400
        print(complaint_number)
        # Fetch the complaint from the database
        complaint = TrainComplaint.query.filter_by(complaint_number=complaint_number).first() or \
                    StationComplaint.query.filter_by(complaint_number=complaint_number).first()

        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404

        # Return the status of the complaint
        return jsonify({
            'complaintNumber': complaint.complaint_number,
            'status': complaint.status
        }), 200

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from AI response: {e}")
        return jsonify({'error': 'Invalid JSON format in AI response'}), 500
    except Exception as e:
        print(f"Error tracking complaint status: {e}")
        return jsonify({'error': 'Error tracking complaint status'}), 500

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    print(f"Upload folder created at: {UPLOAD_FOLDER}")
    app.run(debug=True, port=5000)
