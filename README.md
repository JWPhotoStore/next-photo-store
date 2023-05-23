# next-photo-store 🎞️

Online photo store, branded as "Kushi Photos". This is a fullstack project written in TypeScript.

## Technologies Used

- Next.js
- React
- Redux Toolkit + RTK Query
- Prisma
- PostgreSQL
- NextAuth / OAuth
- Stripe API

## Features

### Photo Grid

The homepage features all six of our products in a fully responsive and mobile-friendly UI.

### Integration with Stripe Products

We rely heavily on Stripe for our application. All our products and product information are stored in Stripe.

### Add to cart, no matter who you are

Logged in / authenticated users' cart items will save to our database. This way, users can access their cart no matter what device they are logged in with.

For guests, we use local storage to store the items in your cart. Upon logging in, which you'll be required to do to checkout your order, items in local storage will be concatenated with any cart items that have been saved against your user account on on the database.

### Contact form

We used EmailJS to implement the contact form. Feel free to reach out to us there, or through Github if you have any suggestions or comments!

###

## Known Issues

### Stripe Checkout

Checkout through Stripe is currently disabled while we work through operationalizing the store. We are also working through some bugs related to webhooks on our deployed site.

### Loading UI

Loading screens, such as rendering assets (photos) and refetching data (cart) may appear buggy or glitchy. As we finish up with the key features of the app, we may implement a component library to smoothen the UI/UX, as we are currently using vanilla CSS.

## 🚧 We are currently still under construction. More details, including a link to the live site, will be posted here shortly! 🚧
