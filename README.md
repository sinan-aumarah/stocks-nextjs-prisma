# Stocks demo app using Next.js, NextUI & Prisma
![CI build status](https://github.com/sinan-aumarah/stocks-nextjs-prisma/actions/workflows/node.js.yml/badge.svg)
  This project uses Next.js, NextUI, and Prisma to create a stock demo application.

### 🚧 Getting started
Ensure you have **Node v18.0+** installed. Run the following commands:

```sh
yarn install      # Install dependencies

yarn test         # Run tests

yarn dev          # Start the development server
```

### 🔭 Navigating the codebase
```
├── src/
│   ├─ backend       # This where all the backened code lives apart from rest APIs
│   └─ pages
│      └── api       # REST APIs
├── prisma/          # DB schema and configurations
├── .env             # Change DATABASE_URL to your local DB
└── ...
```

## 🚩 Design Choices & Assumptions

### API design
- You can access the API documentation after you run the app by going to [/swagger](http://localhost:3000/swagger). Link is also available on the home page.
- I have used a REST API design for now as it's quick to implement. I would have preferred to use GraphQL for this project as it makes more sense. Maybe something for the future.
- I did not implement request parameter validation, error responses nor tests for the API as I believe this is just a temporary solution. I invested into the backend services instead.

### Why choose an ORM such as Prisma?
- Type safety, less boilerplate, caching strategy, readability, version control, testable and more maintainable than traditional sql clients.
- I did not implement any DB query streams, caching or anything fancy as I have no idea what the non-functional requirements are. I just went with readability and maintainability 
than catering for performance at this stage.

### Data integrity and consistency
- I used sample instead of population standard deviation as that's what most tutorials use.
 I did not go into details on why or when we should use one or the other. I need more input from the specialists on this! 
- I was not sure whether the dataset is generated via a tested and trustworthy source or not. I assumed that we might have to do sanity 
checks, but I did not know to what extent I should go. Invalid or missing DB data will most likely just fail and throw an error. I just went with the happy path for now based on the 
provided dataset. I would have loved to add a lot more tests and sanity checks.
- I would have loved to add more tests, but I did not have enough time to do so. No IT or E2E tests as of now, but I am a big fan of Cypress and Playwright

### Performance
- I spent some time adding constraints & limits to DB query and ensured that it is paginated with a max of 1000 companies returned per request. This is just a temporary solution as we
  can definitely do more to improve performance such as API + DAO level caching, cursor based pagination, insure DB is indexed correctly, DB sharding if necessary.

### Why NextJs?
- The main reason for choosing NextJS is my nostalgia feeling for isomorphic projects and I just wanted to quickly spin up a backend and frontend together.
  It is by no means the best choice for a high throughput, stand-alone production ready API, as I do not believe it can easily horizontally scale.

### Frontend
- I have not spent much time on the frontend as I wanted to focus on the backend. There are no tests and the code is a mess, I wrote it quickly
just to demo the API then I decided to use Swagger UI instead.

## 📚 References & Technologies Used

- 🔗[Stock Volatility Calculation](https://zerodha.com/varsity/chapter/volatility-calculation-historical/)
- 🔗[Next.js 14](https://nextjs.org/docs/getting-started)
- 🔗[NextUI](https://nextui.org)
- 🔗[Tailwind CSS](https://tailwindcss.com)
- 🔗[next-themes](https://github.com/pacocoursey/next-themes)
- 🔗[next-swagger-doc](https://github.com/jellydn/next-swagger-doc)
