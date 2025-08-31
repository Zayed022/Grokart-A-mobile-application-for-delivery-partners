import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Vibration,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import axios from 'axios';
import PushNotification, { Importance } from 'react-native-push-notification';
import Sound from 'react-native-sound';

// enable playback
Sound.setCategory('Playback');

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'Grokart needs permission to send you alerts for new orders.',
            buttonPositive: 'Allow',
          }
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

const AssignedOrdersScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const prevOrderIds = useRef<string[]>([]);
  const alarmSoundRef = useRef<Sound | null>(null);

  useEffect(() => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION:', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: 'grokart-orders',
        channelName: 'Grokart Orders',
        channelDescription: 'Notifications for new and assigned orders',
        importance: Importance.HIGH,
        vibrate: true,
        soundName: 'default',
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    requestPermissions();

    // 🔔 Test: start alarm after 5 sec so you know it's working
    const testTimeout = setTimeout(() => {
      console.log('🔔 Manual test alarm trigger');
      startAlarm({ _id: 'test123' });
      setTimeout(stopAlarm, 10000); // auto-stop after 10 sec
    }, 5000);

    return () => clearTimeout(testTimeout);
  }, []);

  /** Fetch assigned orders */
  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'https://grokart-2.onrender.com/api/v1/delivery/assigned-orders',
        { withCredentials: true }
      );

      if (res.data?.data) {
        const newOrders = res.data.data;
        const newOrderIds = newOrders.map((o: any) => o._id);

        const addedOrders = newOrders.filter(
          (order: any) => !prevOrderIds.current.includes(order._id)
        );

        if (addedOrders.length > 0) {
          triggerLocalNotification(addedOrders[0]);
        }

        const activeAlarmOrder = newOrders.find((o: any) =>
          ['Assigned', 'Confirmed', 'Ready to Collect'].includes(o.status)
        );

        if (activeAlarmOrder) {
          startAlarm(activeAlarmOrder);
        } else {
          stopAlarm();
        }

        prevOrderIds.current = newOrderIds;
        setOrders(newOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  /** Start continuous alarm (sound + vibration) */
  const startAlarm = (order: any) => {
    if (alarmSoundRef.current) return; // already running

    console.log('🔔 Alarm started for order:', order._id);

    // Start continuous vibration
    Vibration.vibrate([1000, 1000], true);

    // Play looping sound
    const sound = new Sound(
      'alarm.mp3',
      Platform.OS === 'android' ? Sound.ANDROID : Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log('❌ Failed to load sound', error);
          return;
        }
        sound.setNumberOfLoops(-1);
        sound.play((success) => {
          if (!success) console.log('❌ Playback failed');
        });
      }
    );

    alarmSoundRef.current = sound;
  };

  /** Stop alarm */
  const stopAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.stop(() => {
        alarmSoundRef.current?.release();
        alarmSoundRef.current = null;
      });
    }
    Vibration.cancel();
    console.log('✅ Alarm stopped');
  };

  /** One-time notification for new order */
  const triggerLocalNotification = (order: any) => {
    PushNotification.localNotification({
      channelId: 'grokart-orders',
      title: '🚀 New Order Assigned!',
      message: `Order #${order._id} from ${order.userId?.name}`,
      playSound: true,
      soundName: 'default',
      vibrate: true,
      priority: 'high',
    });

    Alert.alert('New Order Assigned', `Order ID: ${order._id}`);
  };

  useEffect(() => {
    fetchAssignedOrders();
    const interval = setInterval(fetchAssignedOrders, 10000);
    return () => {
      clearInterval(interval);
      stopAlarm();
    };
  }, []);
  useEffect(() => {
  setTimeout(() => {
    console.log("⏰ Testing alarm manually");
    startAlarm({ _id: "test" });
  }, 3000);
}, []);


  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.header}>Order ID: {item._id}</Text>
      <Text>User: {item.userId?.name}</Text>
      <Text>Address: {item.userId?.address}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Ordered At: {new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default AssignedOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  header: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
});
