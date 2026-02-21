from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional

import models
import schemas
from database import engine, get_db
import auth

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="GameVault API", version="1.0.0")

# Configure CORS for the frontend
# just allowing everything for now so we dont get those annoying CORS errors during dev
# todo: def need to restrict this in prod to just the frontend url
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # checking if user exists first so we dont get db constraint errors
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/products", response_model=schemas.PaginatedProducts)
def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Items per page"), # hardcapping at 100 so nobody scrapes the whole db at once
    location: Optional[str] = Query(None, description="Filter by location (JO or SA)"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Product)
    
    if location:
        query = query.filter(models.Product.location == location)
        
    total_items = query.count()
    
    products = query.offset((page - 1) * size).limit(size).all()
    
    return {
        "total": total_items,
        "page": page,
        "size": size,
        "items": products
    }


@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/products/{product_id}/buy", response_model=schemas.OrderResponse)
def buy_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # just a very simple buy flow for now. 
    # assuming payment is handled somewhere else or its just a stub 
    # Generate the order
    new_order = models.Order(user_id=current_user.id, product_id=product.id)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    return new_order

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

