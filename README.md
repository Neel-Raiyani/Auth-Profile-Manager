# Auth-Profile-Manager
## This is simple Express.js server that :
- Registers a user and generate access token.
- Login user and generate both access & refresh token.
- Get current user(Me).
- Get user profile.
- Update profile.
- Change password.
- Allow user to upload profile image.

---

## Installation
1. Clone the Repo
``` bash
git clone <repo url>
cd <project folder>
```
2. Install dependencies
``` bash
npm install
```
3. Create .env file
``` bash
PORT = 3018
MONGO_URI = "Your MongoDB URL"
JWT_SECRET = "JWT Secret Key"
REFRESH_SECRET = "Refresh Secret Key"
JWT_ACCESS_EXPIRES_IN = Access Token Expiry Time (example: 15m or 1h)
JWT_REFRESH_EXPIRES_IN = Refresh Token Expiry Time
```
4. Start server
``` bash
npm start
```
---

## API Endpoints

1. Register - **POST**/auth/register
``` bash
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret123"
}
```
2. Login - **POST**/auth/login
``` bash

```

