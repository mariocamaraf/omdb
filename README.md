This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Movie Database Application

## Overview

The **Movie Database Application** is a web-based platform that allows users to search for movies using various filters and view detailed information about them. Built with modern technologies, this application leverages React, Next.js, Apollo Client, and GraphQL to provide a responsive and interactive user experience.

## Features

- **Movie Search**: Search for movies by title and filter results based on the release year.
- **Suggestions**: Get movie title suggestions as you type in the search field.
- **Detailed View**: View movie details including the title, release year, type, and poster.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Loading States**: Visual feedback during data fetching and error handling.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Next.js**: Framework for server-side rendering and static site generation.
- **Apollo Client**: State management library for GraphQL.
- **GraphQL**: Query language for APIs, used to fetch and manipulate movie data.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
