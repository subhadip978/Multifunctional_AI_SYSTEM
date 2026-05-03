# AI SaaS Media Hub

## Description
AI SaaS Media Hub is a modern, full-stack application built to handle intelligent media processing. It provides seamless tools for uploading, compressing, and transforming media assets. Key functionalities include smart image cropping tailored for social media formats (like Instagram Square and Twitter Header) and video uploading with automatic compression and metadata extraction. The project also lays the groundwork for document-based Q&A using vector embeddings.

## Features
- **User Authentication**: Secure sign-in and sign-up flows powered by Clerk.
- **Social Media Image Resizer**: Upload images and dynamically crop/resize them into predefined social media formats using Cloudinary.
- **Video Management**: Upload videos, compress them automatically via Cloudinary, and track their metadata (original vs. compressed sizes, duration).
- **Video Dashboard**: View and download all your processed videos in an intuitive dashboard.
- **Document Q&A (WIP)**: Foundation for vector-based document search and querying using PostgreSQL `pgvector`.
- **Responsive UI**: Clean, accessible, and responsive user interface built with Tailwind CSS and Radix UI components.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Radix UI (shadcn/ui)
- **Authentication**: Clerk
- **Database**: PostgreSQL with `pgvector`
- **ORM**: Prisma
- **Media Processing**: Cloudinary
- **HTTP Client**: Axios

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-saas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` (and `.env` for Prisma if needed) in the root directory and add the following keys:
   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/yourdb"

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Usage Instructions
1. **Sign up / Log in** using the Clerk authentication portal.
2. Navigate to the **Social Share** tab to upload an image and crop it specifically for platforms like Twitter or Instagram, then download the optimized version.
3. Navigate to the **Video Upload** section to upload mp4 files. They will be compressed automatically and saved to the database.
4. Go to the **Home/Dashboard** to view the list of all uploaded videos and download them.

## Project Structure
```text
ai-saas/
├── app/
│   ├── (app)/                # Main authenticated application routes
│   │   ├── ask-document/     # (WIP) Document upload & vector Q&A UI
│   │   ├── home/             # Video dashboard & listing page
│   │   ├── social-share/     # Image resizing and transformation tool
│   │   └── video-upload/     # Video uploading and processing form
│   ├── (auth)/               # Clerk authentication pages (login/signup)
│   ├── api/                  # Next.js API Routes
│   │   ├── image-upload/     # Handles Cloudinary image uploads
│   │   ├── video-upload/     # Handles video compression and DB saving
│   │   └── videos/           # Fetches video metadata from Postgres
│   └── layout.tsx & page.tsx # Root layouts and landing page
├── components/               # Reusable React components (e.g., VideoCard, shadcn UI)
├── lib/                      # Shared utility functions
├── prisma/                   # Prisma schema (PostgreSQL DB structure)
├── public/                   # Static assets (images, fonts)
├── types/                    # TypeScript interfaces and global types
└── middleware.ts             # Next.js edge middleware for route protection via Clerk
```

## API Endpoints

- `POST /api/image-upload`
  - **Description**: Uploads an image to Cloudinary and returns the public ID.
  - **Payload**: `FormData` containing the `file`.

- `POST /api/video-upload`
  - **Description**: Uploads a video to Cloudinary for compression, saves metadata to the DB.
  - **Payload**: `FormData` containing `file`, `title`, `description`, `originalSize`.

- `GET /api/videos`
  - **Description**: Retrieves all uploaded videos ordered by creation date descending.

## Screenshots

*(Placeholders for future screenshots)*

| Dashboard / Video List | Social Media Image Resizer |
|:---:|:---:|
| ![Dashboard Placeholder]() | ![Resizer Placeholder]() |

## Contribution Guidelines
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License.
