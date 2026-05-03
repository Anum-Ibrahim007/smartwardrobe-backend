# SmartWardrobe Backend – Setup Guide

## Step 1 — Open this folder in VS Code terminal

## Step 2 — Install dependencies
```
npm install
```

## Step 3 — Setup MySQL database
Open MySQL Workbench, paste and run everything inside `schema.sql`
OR run in terminal:
```
mysql -u root -p < schema.sql
```

## Step 4 — Edit .env file
Open `.env` and change only this line:
```
DB_PASSWORD=your_actual_mysql_password
```

## Step 5 — Start the server
```
node server.js
```
You should see: ✅ Server running on http://localhost:5000

## Step 6 — Test it's working
Open browser and go to: http://localhost:5000
You should see: {"message":"SmartWardrobe API is running!"}

---

## API Endpoints Quick Reference

| Method | URL                        | What it does            |
|--------|----------------------------|-------------------------|
| POST   | /api/auth/register         | Register new user       |
| POST   | /api/auth/login            | Login, returns token    |
| GET    | /api/auth/profile          | Get profile             |
| PUT    | /api/auth/profile          | Update profile/season   |
| GET    | /api/closet                | Get all clothes         |
| POST   | /api/closet                | Add clothing item       |
| PUT    | /api/closet/:id            | Edit clothing item      |
| PATCH  | /api/closet/:id/status     | Update laundry status   |
| PATCH  | /api/closet/:id/wear       | Increment wear count    |
| DELETE | /api/closet/:id            | Delete clothing item    |
| GET    | /api/outfits               | Get saved outfits       |
| POST   | /api/outfits               | Save outfit             |
| DELETE | /api/outfits/:id           | Delete saved outfit     |

## All protected routes need this header:
```
Authorization: Bearer <token>
```
Token is returned when you login.
