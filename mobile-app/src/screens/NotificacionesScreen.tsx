import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNotifications, AppNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';

export const NotificacionesScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationPress = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.tipo === 'oferta') {
      navigation.navigate('Ofertas');
    } else if (notif.tipo === 'comision') {
      navigation.navigate('Avance');
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[
        styles.notifCard, 
        { 
          backgroundColor: colors.surface, 
          borderColor: item.leido ? colors.cardBorder : colors.primary 
        },
        !item.leido && { backgroundColor: colors.badgeBg }
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.badgeBg }]}>
        <Text style={styles.iconText}>
          {item.tipo === 'oferta' ? '⚡' : item.tipo === 'comision' ? '💰' : '🔔'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: colors.text }]}>{item.titulo}</Text>
          {!item.leido && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
        </View>
        <Text style={[styles.message, { color: colors.textSecondary }]}>{item.mensaje}</Text>
        <Text style={[styles.time, { color: colors.textMuted }]}>{new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerRow, { backgroundColor: colors.surface, borderBottomColor: colors.headerBorder }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Centro de Notificaciones</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={[styles.markAllText, { color: colors.primary }]}>Marcar leídas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Sin notificaciones nuevas</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Aquí recibirás avisos de nuevas recolecciones y pagos.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  markAllText: {
    fontSize: 11,
    fontWeight: '700',
  },
  listContent: {
    padding: 14,
    gap: 10,
  },
  notifCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginLeft: 6,
  },
  message: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  time: {
    fontSize: 10,
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
