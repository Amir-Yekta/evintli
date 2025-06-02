
EVINTLI PROJECT README


Clone & Install
---------------
1. Clone this repository from GitHub.
2. Navigate into the folder in your terminal.
3. Run: yarn install

Environment Variables
---------------------
1. Create a file named .env in the project's root.
2. Add your MongoDB connection string and JWT secret, for example:

   DATABASE_URL="mongodb+srv://username:password@cluster0.mongodb.net/evintli?retryWrites=true&w=majority"
   JWT_SECRET="somethingsecret"

Database Sync
-------------
1. Run: npx prisma db push
2. Then: npx prisma generate

Starting the Server
-------------------
1. Run: yarn dev
2. Open http://localhost:3000 in your browser.

Default Routes
--------------
• Home:   /  
• Login:  /login  
• Signup: /signup

