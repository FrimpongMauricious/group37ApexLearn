import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { CourseContext } from '../context/CourseContext';

const defaultImage = require('../assets/apexLearn2.png');

const WishList = ({ navigation }) => {
  const { wishlist, removeFromWishlist } = useContext(CourseContext);

  const renderRightActions = (courseId) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => removeFromWishlist(courseId)}
    >
      <Text style={styles.deleteText}>Remove</Text>
    </RectButton>
  );

  const renderCourse = ({ item }) => {
    const imageSource =
      typeof item.image === 'string' || item.image?.uri
        ? { uri: item.image.uri || item.image }
        : item.image || defaultImage;

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity
          style={styles.courseItem}
          onPress={() =>
            navigation.navigate('payForWishCourse', {
              screen: 'Payment',
              params: { newCourse: item },
            })
          }
        >
          <Image source={imageSource} style={styles.courseImage} />
          <View style={styles.courseInfo}>
            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.courseAbout} numberOfLines={2}>
              {item.about}
            </Text>
            <Text style={styles.courseMeta}>
              {item.amount} • {item.time}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Your Wish List</Text>
        {wishlist.length === 0 ? (
          <Text style={styles.empty}>No saved courses yet.</Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={wishlist}
            keyExtractor={(item) => item.id}
            renderItem={renderCourse}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default WishList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f8fc',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e7898',
  },
  empty: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
  },
  courseItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  courseName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  courseAbout: {
    fontSize: 13,
    color: '#666',
  },
  courseMeta: {
    marginTop: 6,
    color: '#4CAF50',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
