This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup

Optional: Make a `POST https://trendysnack.tk/api/mock/create` with body 
```
{
    "numRestaurants": 50,
    "numOrders": 200,
    "numProducts": 1000,
    "purchaseInterval": 2
}
```
to view fresh data.

## View Finished App in Production

Navigate to the [secure link](https://trendysnack.tk/) to view the deployed app!

The app is hosted on a custom domain via [Vercel](https://vercel.com), a cloud hosting service build for Next.js apps.

The app uses MongoDB Atlas cluster for persistent data storage.

## Development

**NOTE: Running in dev will not work until you create a .env.local with secrets used in the app...please reach out to me and I can provide you those secrets(such as MongoDB Atlas connection string)**

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
