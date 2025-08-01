# main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Initialize FastAPI app
app = FastAPI(
    title="TasteTrip API",
    description="Backend for the TasteTrip food delivery service.",
    version="1.0.0",
)

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you can restrict this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# In-memory database for menu items.
# In a real application, this would be a connection to a database like PostgreSQL or MongoDB.
menu_db = [
    {
        'id': '1', 'name': 'Margherita Pizza', 'description': 'Classic tomato, mozzarella, and fresh basil.', 'price': 12.50, 'category': 'pizza', 'rating': 4.5, 'isFeatured': True,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Pizza'
    },
    {
        'id': '2', 'name': 'Pasta Carbonara', 'description': 'Creamy sauce with pancetta and egg yolk.', 'price': 15.00, 'category': 'pasta', 'rating': 5.0, 'isFeatured': True,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Pasta'
    },
    {
        'id': '3', 'name': 'Caesar Salad', 'description': 'Crisp romaine, croutons, and parmesan.', 'price': 9.75, 'category': 'salad', 'rating': 4.0, 'isFeatured': False,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Salad'
    },
    {
        'id': '4', 'name': 'Cheeseburger', 'description': 'Juicy beef patty with cheddar cheese and pickles.', 'price': 11.25, 'category': 'burger', 'rating': 4.8, 'isFeatured': False,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Burger'
    },
    {
        'id': '5', 'name': 'Spaghetti Bolognese', 'description': 'Rich meat sauce with fine herbs.', 'price': 14.50, 'category': 'pasta', 'rating': 4.3, 'isFeatured': False,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Bolognese'
    },
    {
        'id': '6', 'name': 'Veggie Pizza', 'description': 'Assorted seasonal vegetables on a thin crust.', 'price': 13.75, 'category': 'pizza', 'rating': 4.2, 'isFeatured': False,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Veggie+Pizza'
    },
    {
        'id': '7', 'name': 'Grilled Chicken Salad', 'description': 'Grilled chicken breast on a bed of mixed greens.', 'price': 12.00, 'category': 'salad', 'rating': 4.6, 'isFeatured': False,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Chicken+Salad'
    },
    {
        'id': '8', 'name': 'Tiramisu', 'description': 'Classic coffee-flavored Italian dessert.', 'price': 7.50, 'category': 'dessert', 'rating': 5.0, 'isFeatured': False,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Tiramisu'
    },
    {
        'id': '9', 'name': 'Chocolate Lava Cake', 'description': 'Warm chocolate cake with a molten center.', 'price': 8.00, 'category': 'dessert', 'rating': 4.9, 'isFeatured': False,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Lava+Cake'
    },
    {
        'id': '10', 'name': 'Double Bacon Burger', 'description': 'Double beef patties with crispy bacon and special sauce.', 'price': 14.00, 'category': 'burger', 'rating': 4.7, 'isFeatured': False,
        'imageUrl': 'https://placehold.co/400x300/f97316/ffffff?text=Bacon+Burger'
    }
]

# Pydantic models for request body and response data validation
class MenuItem(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    rating: float
    isFeatured: bool
    imageUrl: str

class OrderItem(BaseModel):
    item_id: str
    quantity: int

class OrderRequest(BaseModel):
    items: List[OrderItem]

@app.get("/api/menu", response_model=List[MenuItem])
async def get_menu():
    """
    Returns the list of all menu items.
    """
    return menu_db

@app.post("/api/order")
async def place_order(order: OrderRequest):
    """
    Receives and processes a new order.
    """
    if not order.items:
        raise HTTPException(status_code=400, detail="Order cannot be empty.")

    print("Received new order:")
    for item in order.items:
        print(f"  - Item ID: {item.item_id}, Quantity: {item.quantity}")

    # In a real app, you would save this order to a database
    # and perform further processing (e.g., notify a restaurant).

    return {"message": "Order received successfully!"}

