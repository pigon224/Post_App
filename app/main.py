from fastapi import FastAPI, Depends, Form, HTTPException, Request, Response
import jwt
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import models
from auth import ALGORITHM, SECRET_KEY, create_access_token, verify_password
from crud import add_padding, create_user, remove_prefix_from_token
from database import get_db
from models import Post, User
from schemas import PostCreate, PostResponse, UserCreate
# FastAPI app instance
app = FastAPI()

# CORS configuration
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    create_user(db, user)
    return {"message": "User created successfully"}


@app.post("/login")
def login(
    username: str = Form(...), 
    password: str = Form(...), 
    response: Response = None, 
    db: Session = Depends(get_db)
):
    # Query the user from the database
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify the provided password matches the hashed password in the database
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate the token for the authenticated user
    access_token = create_access_token({"sub": user.username})

    # Set the token in a secure cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Prevent JavaScript access
        secure=True,    # Use HTTPS in production
        samesite="Strict",
        expires= 30 * 60
    )

    return {"message": "Login successful"}



@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}


@app.get("/my-posts")
def get_my_posts(request: Request, db: Session = Depends(get_db)):
    # Retrieve the JWT token from the cookie
    token = request.cookies.get("access_token")
    print("Received token: ", token)

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # If the token is in bytes, decode it into a string
    if isinstance(token, bytes):
        token = token.decode('utf-8')  # Decode bytes to string
    token = remove_prefix_from_token(token)

    # Debugging to confirm token before any modification
    


    # Fix padding if necessary
    token = add_padding(token)
    
    try:
        # Decode the JWT token (validates signature and expiration)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")  # Extract the username from the token payload

        if not username:
            raise HTTPException(status_code=401, detail="Invalid token payload")

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Retrieve the user from the database based on the username
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Fetch posts associated with the authenticated user
    posts = db.query(Post).filter(Post.user_id == user.id).all()

    return posts





@app.post("/createPost")
def create_post(request: Request, data: PostCreate, db: Session = Depends(get_db)):
    # Retrieve token from cookies
    token = request.cookies.get("access_token")
    
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    token = remove_prefix_from_token(token)
    try:
        # Decode the token
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")  # Get the username from token's payload
        print("WTF")
        # Fetch user from the database using the username
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Proceed with creating the post
    post = Post(title=data.title, content=data.content, user_id=user.id)
    db.add(post)
    db.commit()
    return {"message": "Post created successfully!"}

@app.get("/", response_model=list[PostResponse])
def get_all_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()




@app.post("/rate/{post_id}")
def rate_post(
    post_id: int,
    rating: int,
    request: Request,
    db: Session = Depends(get_db)
):
    if rating < 1 or rating > 5:  # Assuming a 1 to 5 rating scale
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5.")
    
    # Retrieve token from cookies
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = remove_prefix_from_token(token)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Check if the user has already rated this post
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check if the user already rated this post (using a simple check via a new ratings table)
    existing_rating = db.query(models.Rating).filter(
        models.Rating.post_id == post_id,
        models.Rating.user_id == user.id
    ).first()
    
    if existing_rating:
        raise HTTPException(status_code=400, detail="You have already rated this post.")

    # Add a new rating and update average rating
    new_rating = models.Rating(post_id=post_id, user_id=user.id, rating=rating)
    db.add(new_rating)
    db.commit()

    # Recalculate the average rating for the post
    avg_rating = db.query(func.avg(models.Rating.rating)).filter(models.Rating.post_id == post_id).scalar()
    post.rating = avg_rating
    db.commit()

    return {"average_rating": avg_rating}

@app.get("/averageRating/{post_id}")
def get_average_rating(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return {"average_rating": post.rating}
