import { Platform } from 'react-native';

// Servidor de Producción en Vivo en Render
export const RENDER_PRODUCTION_URL = 'https://project-dia.onrender.com/api';

// Configuración de desarrollo local
const DEV_IP = '192.168.100.156';
const DEV_URL = `http://${DEV_IP}:3000/api`;

// En producción para que el APK siempre se conecte a la nube
export const IS_PRODUCTION = true;

export const API_URL = IS_PRODUCTION
  ? RENDER_PRODUCTION_URL
  : Platform.select({
      web: 'http://localhost:3000/api',
      android: DEV_URL,
      ios: DEV_URL,
      default: DEV_URL,
    });

export const TIMEOUT = 15000;
