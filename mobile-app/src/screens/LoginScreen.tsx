import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { saveToken } from '../services/auth';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = (loginEmail?: string, loginPass?: string) => {
    const targetEmail = loginEmail || email;
    const targetPass = loginPass || password;

    if (!targetEmail) {
      alert('Por favor ingresa usuario o correo');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const dummyToken = 'ead-bpo-jwt-token';
      saveToken(dummyToken);
      login({
        id: 1,
        nombre: targetEmail.includes('admin') ? 'Torre de Control EAD' : 'Carlos Mendoza Cruz',
        email: targetEmail,
        rol: targetEmail.includes('admin') ? 'ADMIN' : 'GESTOR'
      });
      setLoading(false);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10182E" />
      <LoadingOverlay visible={loading} message="Iniciando sesión..." />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Exact Double-Layered Gold Diamond Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.diamondOuter}>
            <View style={styles.diamondInner} />
          </View>
          <Text style={styles.logoEAD}>E  A  D</Text>
          <Text style={styles.logoBPO}>B  P  O</Text>
          <Text style={styles.logoTagline}>OPERACIONES & GESTIÓN DE CAMPO</Text>
        </View>

        {/* Navy Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>
          <Text style={styles.cardSubtitle}>Accede a la plataforma de operaciones</Text>

          {/* User Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Usuario o Correo"
              placeholderTextColor="#64748B"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Contraseña"
              placeholderTextColor="#64748B"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={() => handleLogin()} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>

          {/* Quick Demo Access */}
          <View style={styles.quickSection}>
            <Text style={styles.quickTitle}>ACCESO RÁPIDO DE DEMOSTRACIÓN</Text>
            <View style={styles.quickRow}>
              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() => handleLogin('admin@crm.com', 'admin123')}
                activeOpacity={0.7}
              >
                <Text style={styles.quickBtnText}>👑 Torre Control</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() => handleLogin('gestor@crm.com', 'gestor123')}
                activeOpacity={0.7}
              >
                <Text style={styles.quickBtnTextGestor}>🏃 Gestor Campo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10182E', // Exact corporate navy
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 26,
  },
  diamondOuter: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderColor: '#D4A33B',
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 163, 59, 0.12)',
    marginBottom: 14,
    borderRadius: 2,
  },
  diamondInner: {
    width: 20,
    height: 20,
    backgroundColor: '#D4A33B',
    borderRadius: 1,
  },
  logoEAD: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    fontFamily: 'sans-serif',
  },
  logoBPO: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E0E6F0',
    letterSpacing: 6,
    marginTop: 2,
    fontFamily: 'sans-serif',
  },
  logoTagline: {
    fontSize: 10,
    color: '#D4A33B',
    marginTop: 8,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#131E3A',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 59, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10182E',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 59, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 46,
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
  },
  eyeBtn: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#D4A33B',
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#D4A33B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#10182E',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quickSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 163, 59, 0.15)',
  },
  quickTitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: '#10182E',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 59, 0.3)',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  quickBtnText: {
    color: '#D4A33B',
    fontSize: 11,
    fontWeight: '700',
  },
  quickBtnTextGestor: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
  },
});
