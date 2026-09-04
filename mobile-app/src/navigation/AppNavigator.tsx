import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { NotificationProvider, useNotifications } from '../contexts/NotificationContext';

import { LoginScreen } from '../screens/LoginScreen';
import { CuentasListScreen } from '../screens/CuentasListScreen';
import { CuentaDetailScreen } from '../screens/CuentaDetailScreen';
import { NuevaGestionScreen } from '../screens/NuevaGestionScreen';
import { RutaGuiadaScreen } from '../screens/RutaGuiadaScreen';
import { OfertasScreen } from '../screens/OfertasScreen';
import { MiAvanceScreen } from '../screens/MiAvanceScreen';
import { HistorialScreen } from '../screens/HistorialScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { NotificacionesScreen } from '../screens/NotificacionesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Notification Bell Component in Top Bar
const NotificationBell = ({ navigation }: any) => {
  const { unreadCount } = useNotifications();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Notificaciones')}
      style={styles.bellBtn}
      activeOpacity={0.7}
    >
      <Text style={styles.bellIcon}>🔔</Text>
      {unreadCount > 0 && (
        <View style={styles.bellBadge}>
          <Text style={styles.bellBadgeText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const CuentasStack = ({ navigation }: any) => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700', fontSize: 15, color: colors.text },
        headerRight: () => <NotificationBell navigation={navigation} />,
      }}
    >
      <Stack.Screen 
        name="CuentasList" 
        component={CuentasListScreen} 
        options={{ title: 'Rutas & Paradas' }} 
      />
      <Stack.Screen 
        name="RutaGuiada" 
        component={RutaGuiadaScreen} 
        options={{ title: 'Asistente en Ruta (GPS)' }} 
      />
      <Stack.Screen 
        name="CuentaDetail" 
        component={CuentaDetailScreen} 
        options={{ title: 'Ficha del Deudor' }} 
      />
      <Stack.Screen 
        name="NuevaGestion" 
        component={NuevaGestionScreen} 
        options={{ title: 'Registro de Visita' }} 
      />
      <Stack.Screen 
        name="Notificaciones" 
        component={NotificacionesScreen} 
        options={{ title: 'Notificaciones' }} 
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { 
          backgroundColor: colors.headerBg, 
          borderBottomColor: colors.headerBorder, 
          borderBottomWidth: 1 
        },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700', fontSize: 15, color: colors.text },
        headerRight: () => <NotificationBell navigation={navigation} />,
        tabBarStyle: {
          backgroundColor: colors.tabBg,
          borderTopColor: colors.tabBorder,
          borderTopWidth: 1,
          height: 56,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      })}
    >
      <Tab.Screen 
        name="Rutas" 
        component={CuentasStack} 
        options={{ 
          headerShown: false, 
          tabBarLabel: 'Rutas',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>🗺️</Text>
        }} 
      />
      <Tab.Screen 
        name="ModoRuta" 
        component={RutaGuiadaScreen} 
        options={{ 
          title: 'Asistente en Conducción',
          tabBarLabel: 'En Ruta',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>🧭</Text>
        }} 
      />
      <Tab.Screen 
        name="Ofertas" 
        component={OfertasScreen} 
        options={{ 
          title: 'Bolsa de Recolección',
          tabBarLabel: 'Bolsa',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>⚡</Text>,
          tabBarBadge: 3,
          tabBarBadgeStyle: { 
            backgroundColor: colors.primary, 
            color: colors.primaryText, 
            fontWeight: 'bold', 
            fontSize: 9, 
            minWidth: 16, 
            height: 16 
          }
        }} 
      />
      <Tab.Screen 
        name="Avance" 
        component={MiAvanceScreen} 
        options={{ 
          title: 'Mi Avance & Ganancias',
          tabBarLabel: 'Avance',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>📊</Text>
        }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ 
          title: 'Configuraciones & Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: () => <Text style={{ fontSize: 16 }}>👤</Text>
        }} 
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) return null;

  const navTheme = colors.isDark ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      card: colors.headerBg,
      text: colors.text,
      border: colors.headerBorder,
      primary: colors.primary,
    }
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.headerBg,
      text: colors.text,
      border: colors.headerBorder,
      primary: colors.primary,
    }
  };

  return (
    <NotificationProvider>
      <NavigationContainer theme={navTheme}>
        {user ? <MainTabs /> : <LoginScreen />}
      </NavigationContainer>
    </NotificationProvider>
  );
};

const styles = StyleSheet.create({
  bellBtn: {
    paddingHorizontal: 12,
    position: 'relative',
  },
  bellIcon: {
    fontSize: 18,
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
