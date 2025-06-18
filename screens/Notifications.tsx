import React, { useContext } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Alert
} from 'react-native';
import moment from 'moment';
import { NotificationContext } from '../context/NotificationContext';
import { Swipeable } from 'react-native-gesture-handler';

const Notifications = () => {
  const {
    notifications,
    deleteNotification,
    markAllAsRead
  } = useContext(NotificationContext);

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() =>
        Alert.alert(
          'Delete Notification',
          'Are you sure you want to delete this notification?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteNotification(id) }
          ]
        )
      }
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.card}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{moment(item.timestamp).fromNow()}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.clearText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <Text style={styles.empty}>You have no notifications yet.</Text>
      ) : (
        <FlatList
        showsVerticalScrollIndicator={false}
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  clearText: {
    color: 'blue',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#e8f4fc',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  empty: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: 50,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '95%',
    borderRadius: 10,
    marginVertical: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
