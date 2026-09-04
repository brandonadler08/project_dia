import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';

export interface AppNotification {
  id: string;
  tipo: 'oferta' | 'asignacion' | 'comision' | 'alerta';
  titulo: string;
  mensaje: string;
  comision?: number;
  cuentaId?: number | string;
  fecha: Date;
  leido: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'fecha' | 'leido'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  activeToast: AppNotification | null;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      tipo: 'oferta',
      titulo: '⚡ Nueva Recolección Disponible',
      mensaje: 'Toyota Hilux en Coyoacán (a 3.4 km). Comisión: +$500.00 MXN',
      comision: 500,
      cuentaId: 5,
      fecha: new Date(Date.now() - 5 * 60000),
      leido: false,
    },
    {
      id: '2',
      tipo: 'comision',
      titulo: '💰 ¡Comisión Acreditada!',
      mensaje: 'Visita exitosa registrada en KVK-2918093. Se sumaron +$400.00 MXN a tu balance.',
      comision: 400,
      fecha: new Date(Date.now() - 45 * 60000),
      leido: true,
    }
  ]);

  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [slideAnim] = useState(new Animated.Value(-120));

  const unreadCount = notifications.filter(n => !n.leido).length;

  const addNotification = (notif: Omit<AppNotification, 'id' | 'fecha' | 'leido'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Date.now().toString(),
      fecha: new Date(),
      leido: false,
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Trigger in-app toast
    setActiveToast(newNotif);
    Animated.spring(slideAnim, {
      toValue: 20,
      useNativeDriver: true,
      friction: 8,
    }).start();

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      dismissToast();
    }, 6000);
  };

  const dismissToast = () => {
    Animated.timing(slideAnim, {
      toValue: -140,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setActiveToast(null);
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, leido: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, leido: true })));
  };

  // Simulate periodic real-time alert broadcasts from Torre de Control for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        tipo: 'oferta',
        titulo: '⚡ Nueva Recolección en tu Zona',
        mensaje: 'Motocicleta Colt 300 en Benito Juárez (a 1.8 km). Comisión: +$380.00 MXN',
        comision: 380,
        cuentaId: 6,
      });
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        activeToast,
        dismissToast,
      }}
    >
      {children}

      {/* Floating In-App Real-Time Notification Toast */}
      {activeToast && (
        <Animated.View
          style={[
            styles.toastContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity
            style={styles.toastCard}
            onPress={dismissToast}
            activeOpacity={0.9}
          >
            <View style={styles.toastIconBox}>
              <Text style={styles.toastIcon}>
                {activeToast.tipo === 'oferta' ? '⚡' : activeToast.tipo === 'comision' ? '💰' : '🔔'}
              </Text>
            </View>

            <View style={styles.toastContent}>
              <View style={styles.toastTopRow}>
                <Text style={styles.toastTitle} numberOfLines={1}>{activeToast.titulo}</Text>
                <Text style={styles.toastTime}>Ahora</Text>
              </View>
              <Text style={styles.toastMsg} numberOfLines={2}>{activeToast.mensaje}</Text>
            </View>

            <TouchableOpacity onPress={dismissToast} style={styles.toastCloseBtn}>
              <Text style={styles.toastCloseText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 14,
    right: 14,
    zIndex: 9999,
  },
  toastCard: {
    backgroundColor: '#0E121B',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  toastIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  toastIcon: {
    fontSize: 18,
  },
  toastContent: {
    flex: 1,
  },
  toastTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  toastTime: {
    fontSize: 10,
    color: '#D4AF37',
    fontWeight: '600',
    marginLeft: 6,
  },
  toastMsg: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  toastCloseBtn: {
    padding: 6,
    marginLeft: 6,
  },
  toastCloseText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
