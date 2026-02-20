import csv
import os
from database import SessionLocal, engine
import models

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

def import_csv_to_db(filepath):
    db = SessionLocal()
    with open(filepath, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        # Create default user regardless of product seed status
        if not db.query(models.User).filter(models.User.username == "admin").first():
             import auth
             hashed_password = auth.get_password_hash("password")
             default_user = models.User(username="admin", hashed_password=hashed_password)
             db.add(default_user)
             db.commit()
             print("Created default user 'admin' with password 'password'")

        # Check if DB is already seeded to prevent duplication
        if db.query(models.Product).first():
            print("Database already seeded with products. Skipping import.")
            db.close()
            return

        print("Importing items.csv...")
        count = 0
        for row in reader:
            db_product = models.Product(
                title=row['title'],
                description=row['description'],
                price=float(row['price']),
                location=row['location']
            )
            db.add(db_product)
            count += 1
        
        db.commit()
        print(f"Successfully imported {count} products.")
    db.close()

if __name__ == "__main__":
    # items.csv is located in the parent directory
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'items.csv')
    if os.path.exists(csv_path):
        import_csv_to_db(csv_path)
    else:
        print(f"CSV file not found at {csv_path}")
