import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const dbDialect = (process.env.DB_DIALECT || 'sqlite') as 'sqlite' | 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
const dbName = process.env.DB_NAME || 'crm_gestores';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbStorage = process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite');

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : dbDialect === 'sqlite'
  ? new Sequelize({
      dialect: 'sqlite',
      storage: dbStorage,
      logging: false,
    })
  : new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'postgres',
      logging: false,
    });
