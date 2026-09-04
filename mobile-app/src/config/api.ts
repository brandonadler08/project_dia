import { Platform } from 'react-native';

// Cambia esta URL por la URL de tu servidor en Render cuando esté desplegado
// Ejemplo: 'https://ead-bpo-backend.onrender.com/api'
export const RENDER_PRODUCTION_URL = 'https://ead-bpo-backend.onrender.com/api';

// Configuración de desarrollo local (por IP en la misma red Wi-Fi)
const DEV_IP = '192.168.100.156';
const DEV_URL = `http://${DEV_IP}:3000/api`;

// Si estás en producción usa RENDER_PRODUCTION_URL, si estás en local usa DEV_URL
export const IS_PRODUCTION = false; // Cambiar a true al desplegar en Render

export const API_URL = IS_PRODUCTION
  ? RENDER_PRODUCTION_URL
  : Platform.select({
      web: 'http://localhost:3000/api',
      android: DEV_URL,
      ios: DEV_URL,
      default: DEV_URL,
    });

export const TIMEOUT = 15000;
