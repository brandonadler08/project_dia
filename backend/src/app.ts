import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase } from './models';

// Import Routes
import authRoutes from './routes/auth.routes';
import comisionistasRoutes from './routes/comisionistas.routes';
import cuentasRoutes from './routes/cuentas.routes';
import carterasRoutes from './routes/carteras.routes';
import gestionesRoutes from './routes/gestiones.routes';
import torreRoutes from './routes/torre.routes';
import reportesRoutes from './routes/reportes.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/comisionistas', comisionistasRoutes);
app.use('/api/cuentas', cuentasRoutes);
app.use('/api/carteras', carterasRoutes);
app.use('/api/gestiones', gestionesRoutes);
app.use('/api/torre', torreRoutes);
app.use('/api/reportes', reportesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Initialize DB and start server
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });

export default app;
