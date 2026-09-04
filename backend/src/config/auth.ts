import dotenv from 'dotenv';

dotenv.config();

export const authConfig = {
  secret: process.env.JWT_SECRET || 'supersecretjwtkey123',
  expiresIn: '24h',
  refreshExpiresIn: '7d'
};
