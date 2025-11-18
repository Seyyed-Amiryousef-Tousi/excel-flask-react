
# Excel Uploader Project

## Backend (Flask)
- Navigate to backend/
- Install dependencies: pip install -r requirements.txt
- Run: python app.py

## Frontend (React)
- Navigate to frontend/
- Install dependencies: npm install
- Run: npm start

The frontend runs on http://localhost:3000 and sends to backend at http://localhost:5000/upload.

The Excel data is saved to data.db in the backend directory.
Assume the Excel has headers matching the table schema; adjust as needed.
