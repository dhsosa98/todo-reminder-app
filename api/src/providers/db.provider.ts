import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import { TodoItem } from 'src/entities/todoItem.entity';

export const DatabaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: process.env.DB_DIALECT as Dialect,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      sequelize.addModels([TodoItem]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
