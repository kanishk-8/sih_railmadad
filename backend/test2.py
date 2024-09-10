import requests
import json

def test_track_complaint(input_text):
    url = "http://localhost:5000/api/track-complaint-status"  # URL for the track complaint endpoint
    headers = {"Content-Type": "application/json"}     # Headers specifying the request type

    # JSON payload containing the input text for tracking complaints
    payload = {
        "input": input_text
    }

    try:
        # Send the POST request to the server
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        
        # Check the status code of the response
        if response.status_code == 200:
            print("Test Passed: Complaint status retrieved successfully!")
            print("Response JSON:", response.json())
        elif response.status_code == 404:
            print(response)
        elif response.status_code == 400:
            print("Test Failed: Bad request, possible input error.")
        else:
            print(f"Test Failed: Unexpected status code {response.status_code}")
        
    except requests.exceptions.RequestException as e:
        print(f"Test Failed: Unable to connect to the server. Error: {e}")

if __name__ == "__main__":
    # Example input for tracking complaint
    test_input = "Please track complaint number 4c67c692-5615-4a47-ba9f-4f2ae2e8ea91"
    
    # Call the test function with the input text
    test_track_complaint(test_input)
