# Smart Bookmark App

A simple, elegant bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google Authentication**: Secure login without passwords.
- **Private Bookmarks**: Your data is yours alone.
- **Real-time Updates**: Add a bookmark in one tab, see it appear instantly in another.
- **Responsive Design**: Looks great on desktop and mobile.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed.
- A Supabase account.

### Setup

1.  **Clone the repository** (if you haven't already).

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Supabase Setup**:
    - Create a new project at [database.new](https://database.new).
    - Go to the **SQL Editor** and run the contents of `schema.sql`.
    - Go to **Authentication > Providers** and enable **Google**.
    - Go to **Authentication > URL Configuration** and add `http://localhost:3000/auth/callback` to the **Redirect URLs**.

4.  **Environment Variables**:
    - Rename `.env.local.example` to `.env.local`.
    - Fill in your Supabase URL and Anon Key from your access settings.

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1.  Push this code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in Vercel.
4.  **Important**: Add your Vercel production URL (e.g., `https://your-app.vercel.app/auth/callback`) to the **Redirect URLs** in your Supabase Authentication settings.

## Challenges & Solutions

-   **Real-time Updates**: Implemented using Supabase's `postgres_changes` subscription in a client component (`BookmarkManager`), allowing the UI to reflect changes instantly without manual revalidation.
-   **Security**: Used Row Level Security (RLS) policies in PostgreSQL to ensure users can only access and modify their own data, regardless of the API access level.
-   **Path Configuration**: Standardized project structure and `tsconfig.json` path mappings to ensure consistent module resolution across component and utility imports.
