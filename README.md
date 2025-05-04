# Rugby Fixtures Application

A web application built with **Next.js**, **Prisma**, and **MongoDB**, hosted on Vercel:  
🔗 [https://v0-rugby-fixture-app.vercel.app](https://v0-rugby-fixture-app.vercel.app)

This app allows users to **upload**, **store**, and **search** rugby fixtures from CSV files.

---

## Features

- **Upload Page**: Upload CSV files containing rugby fixture data (supports large files up to 10MB).
- **Search Page**: Search fixtures by team name. Click a fixture to view its details.
- **Navigation Bar**: Includes links to Home, Upload, and Search pages.  
  Also features a **Delete Fixtures** button to remove all records from the database.
- **Database**: Stores fixtures in **MongoDB Atlas**, integrated via **Prisma** using a server component.

---

## Running the Application

```bash
npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
```
