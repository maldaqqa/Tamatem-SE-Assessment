# GameVault Backend API

This is the Python FastAPI backend for GameVault. It provides a RESTful API for user authentication, product listing, and purchasing.

## Technologies Used
- **Python 3.10+**
- **FastAPI**: A modern, fast web framework for building APIs.
- **SQLite & SQLAlchemy**: A lightweight local database and ORM for easy data handling.
- **PyJWT & Passlib**: Used for secure token-based authentication and password hashing.

## Setup Instructions

1. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   ```
2. **Activate the Virtual Environment**:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. **Import the Seed Data**:
   Ensure `items.csv` is in the parent directory. From the `gamevault-backend` folder, run:
   ```bash
   python import_data.py
   ```
   This will populate the SQLite database.

2. **Start the API Server**:
   ```bash
   uvicorn main:app --reload
   ```
3. **Explore the Interactive Documentation**:
   Open a browser and go to `http://127.0.0.1:8000/docs`. You can interact with and test all the endpoints seamlessly.

## Design Decisions
- **FastAPI**: Chosen for its inherent speed, readability, and ease of learning through auto-generated types and interactive Swagger documentation.
- **SQLite**: Using a local `.db` file eliminates the need to set up and manage a separate database server, allowing a focus strictly on Python schema definition and backend logic.
- **RESTful Endpoints**: Adheres strictly to standard operations (`POST /login`, `GET /products`, `POST /products/{id}/buy`) making integration with the Angular frontend fluid.
