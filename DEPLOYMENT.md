# Deployment Guide (Vercel + Supabase)

This guide will help you deploy your application for **free** using Vercel (hosting) and Supabase (database & images).

## Prerequisites
- A [GitHub](https://github.com) account.
- A [Vercel](https://vercel.com) account.
- A [Supabase](https://supabase.com) account.

## Step 1: Supabase Setup (Database & Storage)

1.  **Create a Project:**
    -   Log in to Supabase and create a new project.
    -   Save your **Database Password** securely!

2.  **Get Database Connection String:**
    -   Go to **Project Settings > Database > Connection parameters**.
    -   Copy the **URI** (Mode: Transaction).
    -   Replace `[YOUR-PASSWORD]` with your actual password.
    -   This is your `DATABASE_URL`.

3.  **Get API Keys:**
    -   Go to **Project Settings > API**.
    -   Copy the `Project URL` -> This is `NEXT_PUBLIC_SUPABASE_URL`.
    -   Copy the `anon` `public` key -> This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

4.  **Create Storage Bucket:**
    -   Go to **Storage** in the sidebar.
    -   Create a new bucket named `uploads`.
    -   **IMPORTANT:** Make it a **Public** bucket.
    -   **Policies:** You may need to add a policy to allow uploads.
        -   Click "Configuration" or "Policies" for the `uploads` bucket.
        -   Add a new policy for "INSERT" (Upload) allowing "All" (or authenticated users if you implement auth later). For now, allowing "All" (anon) is easiest but less secure.
        -   *Recommended Policy:* Allow `SELECT` for public. Allow `INSERT` for public (for this demo).

## Step 2: Push Code to GitHub

1.  Create a new repository on GitHub.
2.  Push your code to this repository.

## Step 3: Deploy to Vercel

1.  Log in to Vercel and click **"Add New..." > "Project"**.
2.  Import your GitHub repository.
3.  **Environment Variables:**
    -   Expand the "Environment Variables" section.
    -   Add the following variables (using values from Step 1):
        -   `DATABASE_URL`
        -   `NEXT_PUBLIC_SUPABASE_URL`
        -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4.  **Build & Deploy:**
    -   Click **Deploy**.
    -   Vercel will build your app. It might fail initially if the database isn't migrated.

## Step 4: Database Migration (Completed!)

I have already applied the database schema and seeded the initial data for you using the MCP tool. You **do not** need to run `prisma db push` manually.

## Step 5: Verify

1.  Visit your Vercel URL.
2.  Go to `/admin` (password: `admin123`).
3.  Try uploading a logo in **Settings > General**.
4.  If it works, you're live!
