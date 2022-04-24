# Description
This is a responsive first project made for Ensolvers challenge. The product’s main goal is to help users to create To-Do tasks grouped by folders/directories to improve their organization.

# How its Made
This Proyect its made using Vite with React Typescript, React-Router-Dom, Styled-Components, Nestjs, Sequelize ORM and tested with MySQL and PostgreSQL.

# Dependencies
## Frontend

```json
"dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "styled-components": "^5.3.5"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/react-router-dom": "^5.3.3",
    "@types/styled-components": "^5.1.25",
    "@vitejs/plugin-react": "^1.3.0",
    "axios": "^0.26.1",
    "react-router-dom": "^6.3.0",
    "typescript": "^4.6.3",
    "vite": "^2.9.5"
  }
```

## Backend

```json
  "dependencies": {
    "@nestjs/common": "^8.0.0",
    "@nestjs/config": "^2.0.0",
    "@nestjs/core": "^8.0.0",
    "@nestjs/platform-express": "^8.0.0",
    "@nestjs/sequelize": "^8.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.13.2",
    "dotenv": "^16.0.0",
    "mysql2": "^2.3.3",
    "pg": "^8.7.3",
    "pg-hstore": "^2.3.4",
    "reflect-metadata": "^0.1.13",
    "rimraf": "^3.0.2",
    "rxjs": "^7.2.0",
    "sequelize-typescript": "^2.1.3"
  },
  "devDependencies": {
    "@nestjs/cli": "^8.0.0",
    "@nestjs/schematics": "^8.0.0",
    "@nestjs/testing": "^8.0.0",
    "@types/express": "^4.17.13",
    "@types/jest": "27.4.1",
    "@types/node": "^16.0.0",
    "@types/sequelize": "^4.28.11",
    "@types/supertest": "^2.0.11",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "eslint": "^8.0.1",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-prettier": "^4.0.0",
    "jest": "^27.2.5",
    "prettier": "^2.3.2",
    "sequelize": "^6.19.0",
    "sequelize-cli": "^6.4.1",
    "source-map-support": "^0.5.20",
    "supertest": "^6.1.3",
    "ts-jest": "^27.0.3",
    "ts-loader": "^9.2.3",
    "ts-node": "^10.0.0",
    "tsconfig-paths": "^3.10.1",
    "typescript": "^4.3.5"
  },
```

# Commands

## Installation


Note:
If your local database user credentials aren't username=root and password=root. Please create a new .env file in api/.env 

### api/.env
```
DB_USERNAME=<YOUR_DB_USERNAME>
DB_PASSWORD=<YOUR_DB_PASSWORD>
```
Also you can change the default database dialect "mysql", to "postgres", "sqllite", "mariadb", etc. With:

### api/.env
```
DB_DIALECT=<YOUR_DB_DIALECT>
```

For MacOS or Unix Linux run the linux-mac.bash file or double click in the file.
```bash
$ bash linux-MacOS.bash
```

For Windows run the windows.bat file or double click in the file.
```bash
$ windows.bat
```

#
Open http://localhost:3000 to view it in the browser.

## Live Demo using PostgreSQL
https://ensolvers-challenge-ds.herokuapp.com/



