from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Model for Train Complaints
import uuid

class TrainComplaint(db.Model):
    __tablename__ = 'train_complaints'

    complaint_number = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')
    image_path = db.Column(db.String(255), nullable=True)
    pnr_number = db.Column(db.String(10), nullable=False)
    user_email = db.Column(db.String(120), nullable=False)
    user_userid = db.Column(db.String(100), nullable=False)

class StationComplaint(db.Model):
    __tablename__ = 'station_complaints'

    complaint_number = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')
    image_path = db.Column(db.String(255), nullable=True)
    station_location = db.Column(db.String(200), nullable=False)
    incident_date = db.Column(db.String(50), nullable=False)
    user_email = db.Column(db.String(120), nullable=False)
    user_userid = db.Column(db.String(100), nullable=False)



# Model for Appreciation (Rail Anubhav)
class Appreciation(db.Model):
    __tablename__ = 'appreciations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    sentiment = db.Column(db.String(50), nullable=False)


# Model for Enquiry
class Enquiry(db.Model):
    __tablename__ = 'enquiries'

    enquiry_number = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.Text, nullable=False)


# Model for Suggestions
class Suggestion(db.Model):
    __tablename__ = 'suggestions'

    suggestion_number = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.Text, nullable=False)
