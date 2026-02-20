from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    location: str

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class OrderResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    timestamp: datetime
    product: ProductResponse

    class Config:
        from_attributes = True

class PaginatedProducts(BaseModel):
    total: int
    page: int
    size: int
    items: List[ProductResponse]
