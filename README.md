# Forex Trading Backend

## Demo

Server hosted on Vercel: [https://forex-trading-backend.vercel.app/](https://forex-trading-backend.vercel.app/)

## Technologies used

NestJS, MongoDB

## Run Locally

Clone the project

```bash
git clone https://github.com/SrirajBehera/Forex-Trading-Backend.git
```

Install dependencies

```bash
yarn
```

Start the server

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

Test

```bash
# unit tests
yarn test

# watch mode
yarn test:watch

# test coverage
yarn test:cov
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`MONGODB_URI`

`JWT_SECRET`

`ALPHA_VANTAGE_API_KEY`

## Dependencies

```json
"dependencies": {
  "@nestjs/cache-manager": "^2.2.2",
  "@nestjs/common": "^10.0.0",
  "@nestjs/config": "^3.2.2",
  "@nestjs/core": "^10.0.0",
  "@nestjs/jwt": "^10.2.0",
  "@nestjs/mongoose": "^10.0.6",
  "@nestjs/passport": "^10.0.3",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/serve-static": "^4.0.2",
  "@nestjs/swagger": "^7.3.1",
  "@types/passport-jwt": "^4.0.1",
  "@types/passport-local": "^1.0.38",
  "axios": "^1.6.8",
  "bcrypt": "^5.1.1",
  "cache-manager": "^5.5.1",
  "class-transformer": "^0.5.1",
  "class-validator": "^0.14.1",
  "mongoose": "^8.3.1",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "passport-local": "^1.0.0",
  "reflect-metadata": "^0.2.0",
  "rxjs": "^7.8.1",
  "swagger-ui-express": "^5.0.0",
  "uuid": "^9.0.1"
},
"devDependencies": {
  "@nestjs/cli": "^10.0.0",
  "@nestjs/schematics": "^10.0.0",
  "@nestjs/testing": "^10.0.0",
  "@types/express": "^4.17.17",
  "@types/jest": "^29.5.2",
  "@types/node": "^20.3.1",
  "@types/supertest": "^6.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "@typescript-eslint/parser": "^6.0.0",
  "eslint": "^8.42.0",
  "eslint-config-prettier": "^9.0.0",
  "eslint-plugin-prettier": "^5.0.0",
  "jest": "^29.5.0",
  "prettier": "^3.0.0",
  "source-map-support": "^0.5.21",
  "supertest": "^6.3.3",
  "ts-jest": "^29.1.0",
  "ts-loader": "^9.4.3",
  "ts-node": "^10.9.1",
  "tsconfig-paths": "^4.2.0",
  "typescript": "^5.1.3"
},
```


## API Reference

API reference can be found in the Swagger documentation: [https://forex-trading-backend.vercel.app/api](https://forex-trading-backend.vercel.app/api)
