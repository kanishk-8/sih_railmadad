import requests

# Base URL for your Flask app
BASE_URL = "http://localhost:5000/api"  # Change to your actual URL if hosted elsewhere

def test_train_complaints():
    url = f"{BASE_URL}/show-train-complaints"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            print("Train Complaints:")
            for complaint in data['train_complaints']:
                print(f"Complaint Number: {complaint['complaint_number']}")
                print(f"Category: {complaint['category']}")
                print(f"Priority: {complaint['priority']}")
                print(f"Description: {complaint['description']}")
                print(f"Status: {complaint['status']}")
                print(f"Image Path: {complaint['image_path']}")
                print(f"PNR Number: {complaint['pnr_number']}")
                print(f"User Email: {complaint['user_email']}")
                print(f"User ID: {complaint['user_userid']}")
                print("-" * 50)
        else:
            print(f"Failed to fetch train complaints. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error fetching train complaints: {e}")


def test_station_complaints():
    url = f"{BASE_URL}/show-station-complaints"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            print("Station Complaints:")
            for complaint in data['station_complaints']:
                print(f"Complaint Number: {complaint['complaint_number']}")
                print(f"Category: {complaint['category']}")
                print(f"Priority: {complaint['priority']}")
                print(f"Description: {complaint['description']}")
                print(f"Status: {complaint['status']}")
                print(f"Image Path: {complaint['image_path']}")
                print(f"Station Location: {complaint['station_location']}")
                print(f"Incident Date: {complaint['incident_date']}")
                print(f"User Email: {complaint['user_email']}")
                print(f"User ID: {complaint['user_userid']}")
                print("-" * 50)
        else:
            print(f"Failed to fetch station complaints. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error fetching station complaints: {e}")


if __name__ == "__main__":
    # Run tests for both endpoints
    print("Testing Train Complaints Endpoint")
    test_train_complaints()
    print("\nTesting Station Complaints Endpoint")
    test_station_complaints()
