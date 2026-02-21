from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# going with sqlite for now to keep things simple for the assessment. 
# might need to switch to postgres if we scale up later
SQLALCHEMY_DATABASE_URL = "sqlite:///./gamevault.db"

# connect_args={"check_same_thread": False} is needed only for SQLite
# otherwise fastapi freaks out with multiple threads
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
