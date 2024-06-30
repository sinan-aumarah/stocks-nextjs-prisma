# Stocks demo app using Next.js, NextUI & Prisma
![CI build status](https://github.com/sinan-aumarah/stocks-nextjs-prisma/actions/workflows/node.js.yml/badge.svg)

### 🚧 Getting started
**Prerequisite:** Node v20+

```sh
yarn install      # Install dependencies

yarn test         # Run tests

yarn dev          # Start the development server
```

### 🔭 Navigating the codebase
```
├── src/
│   ├─ backend       <--- This where all the backened code lives apart from API
│   └─ pages
│      └── api       <––– REST APIs
├── prisma/          <--- DB schema and configurations
├── .env             <--- Change DATABASE_URL to your local DB
└── ...
```

## 🚩 Design choices & assumptions
### Why NextJs?
- The main reason for choosing NextJs is my nostalgia feeling for isomorphic projects and I just wanted to quickly spin up a backend and frontend together. 
It is by no means the best choice for a high throughput, stand-alone production ready API, as it cannot easily horizontally scale. 

### API design
- You can access the API documentation after you run the app by going to [/swagger](http://localhost:3000/swagger). Link is also available on the home page.
- I have used a REST API design for now as it's quick to implement. I would have preferred to use GraphQL for this project.

### Why choose an ORM such as Prisma?
- Type safety, less boilerplate, caching strategy, readability, version control, testable and more maintainable than traditional sql clients.
- I did not implement any DB query streams, caching or anything fancy as I have no idea what the non-functional requirements are. I just went with readability and maintainability 
than catering for performance.

### Data integrity and consistency
- Volatility check and the choice of sample standard deviation. I used sample instead of population standard deviation as that's what most tutorials use.
 I did not go into details on why or when we should use one or the other. I need more input from the specialists on this! 
- I was not sure whether the dataset is generated via a tested and trustworthy source or not. I assumed that we might have to do sanity 
checks, but I did not know to what extent I should go. Invalid or missing DB data will most likely just fail and throw an error. I just went with the happy path for now based on the 
provided dataset. I would have loved to add a lot more tests and sanity checks.


### Performance? db pagination, constraints

### Frontend
- I have not spent much time on the frontend as I wanted to focus on the backend. There are no tests and the code is a mess, I wrote it quickly
just to demo the API then I decided to use Swagger UI instead.

## 📚 References & Technologies Used

- 🔗[Next.js 14](https://nextjs.org/docs/getting-started)
- 🔗[NextUI](https://nextui.org)
- 🔗[Tailwind CSS](https://tailwindcss.com)
- 🔗[Tailwind Variants](https://tailwind-variants.org)
- 🔗[TypeScript](https://www.typescriptlang.org)
- 🔗[Framer Motion](https://www.framer.com/motion)
- 🔗[next-themes](https://github.com/pacocoursey/next-themes)
- 🔗[next-swagger-doc](https://github.com/jellydn/next-swagger-doc)
