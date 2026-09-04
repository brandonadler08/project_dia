import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EADLogo } from '../components/common/EADLogo';
import { User, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    try {
      await login({ email: loginEmail, password: loginPass });
      toast.success('Acceso autorizado a EAD BPO');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error de credenciales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-[#080A0F] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="mb-8">
        <EADLogo size="lg" showSubtitle={true} />
      </div>

      {/* Minimal Card */}
      <div className="w-full max-w-sm">
        <div className="bg-[#0E121B] p-7 rounded-2xl border border-white/[0.08] shadow-2xl">
          <div className="mb-5 text-center">
            <h2 className="text-base font-semibold text-white">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Accede a la plataforma de operaciones
            </p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Usuario o Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080A0F] border border-white/[0.1] rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-400/80 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080A0F] border border-white/[0.1] rounded-xl py-2.5 pl-9 pr-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-400/80 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-navy-950 bg-gold-500 hover:bg-gold-400 shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

          {/* Quick Demo buttons */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Acceso Rápido Demo:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLogin('admin@crm.com', 'admin123')}
                className="p-2.5 rounded-xl bg-[#080A0F] border border-white/[0.08] hover:border-gold-500/40 text-left transition-all"
              >
                <div className="text-gold-400 font-semibold text-xs mb-0.5">Torre Control</div>
                <div className="text-[10px] text-slate-500 font-mono">admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleLogin('gestor@crm.com', 'gestor123')}
                className="p-2.5 rounded-xl bg-[#080A0F] border border-white/[0.08] hover:border-sky-500/40 text-left transition-all"
              >
                <div className="text-sky-400 font-semibold text-xs mb-0.5">Gestor Campo</div>
                <div className="text-[10px] text-slate-500 font-mono">gestor123</div>
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center space-x-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>EAD BPO Cloud · Conexión Encriptada</span>
          </div>
        </div>
      </div>
    </div>
  );
};
