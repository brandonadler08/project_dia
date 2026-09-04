import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';

import { DashboardPage } from './pages/DashboardPage';
import { RankingPage } from './pages/RankingPage';
import { OfertasPage } from './pages/OfertasPage';
import { CarterasPage } from './pages/CarterasPage';
import { ComisionistasPage } from './pages/ComisionistasPage';
import { CuentasPage } from './pages/CuentasPage';
import { TorreControlPage } from './pages/TorreControlPage';
import { ReportesPage } from './pages/ReportesPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center bg-[#10182E] text-gold-400">Cargando EAD BPO...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="ofertas" element={<OfertasPage />} />
        <Route path="carteras" element={<CarterasPage />} />
        <Route path="comisionistas" element={<ComisionistasPage />} />
        <Route path="cuentas" element={<CuentasPage />} />
        <Route path="torre-control" element={<TorreControlPage />} />
        <Route path="reportes" element={<ReportesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#131E3A',
              color: '#F4E9BE',
              border: '1px solid rgba(212, 163, 59, 0.3)',
            }
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
