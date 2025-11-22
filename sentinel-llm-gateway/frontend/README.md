# Sentinel Frontend

This folder is intended for the Next.js / React frontend
that will be deployed on Vercel.

Suggested setup:

1. cd frontend
2. npx create-next-app@latest .
3. Implement a page that calls the backend:

   fetch("http://localhost:8000/moderate", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ prompt }),
   });

