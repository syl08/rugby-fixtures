Rugby Fixtures Application
A web application built with Next.js, Prisma, and MongoDB, hosted on Vercel at https://v0-rugby-fixture-app.vercel.app It allows users to upload, store, and search rugby fixtures from CSV files.

Features

Upload Page: Upload CSV files with rugby fixture data, supporting large files (up to 10MB).
Search Page: Search fixtures by team name. Clicking a fixture to display the details.
Navigation Bar: Navigation with links to Home, Upload, and Search pages. Delete Fixtures button to delete all fixtures in database.
Database: Stores fixtures in MongoDB Atlas using Prisma in server component.

Prerequisites

Node.js: Version 20 or higher.

Set Up Environment Variables:Create a .env file in the root directory with your MongoDB Atlas connection string:
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"

Replace <username>, <password>, <cluster> and <dbname> with your MongoDB Atlas credentials.

Initialize Prisma:Generate the Prisma client:
npx prisma generate

Ensure the Prisma schema (prisma/schema.prisma) defines the Fixture model:
model Fixture {
id String @id @default(auto()) @map("\_id") @db.ObjectId
fixture_mid String @unique
season String
competition_name String?
fixture_datetime DateTime
fixture_round String
home_team String
away_team String
}

Running the Application

Development Mode:Start the Next.js development server:npm run dev

Open http://localhost:3000 with your browser to see the result.
