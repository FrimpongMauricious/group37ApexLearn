import { StyleSheet, Text, View, Image, TextInput, ScrollView,
         FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fuse from 'fuse.js';
import {
  courses as staticCourses,
  Recommended,
  trending,
  categories,
  mentors
} from './AvailableCourses';
import { CourseContext } from '../context/CourseContext';
import { NotificationContext } from '../context/NotificationContext';

const screenWidth = Dimensions.get('window').width;

const fuseOptions = {
  keys: [
    'name', 'CourseName', 'institution', 'tutor', 'tutorName'
  ],
  threshold: 0.3,
};

const Courses = ({ navigation }) => {
  const [selected, setSelected] = useState('Courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const { userCourses } = useContext(CourseContext);
  const { notifications } = useContext(NotificationContext);
  const unreadCount = notifications?.length || 0;

  const combinedCourses = [...staticCourses, ...userCourses];
  const allCourses = [
    ...staticCourses,
    ...userCourses,
    ...trending,
    ...Recommended
  ];

  const [filteredCourses, setFilteredCourses] = useState(combinedCourses);
  const [filteredTrending, setFilteredTrending] = useState(trending);
  const [filteredRecommended, setFilteredRecommended] = useState(Recommended);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    const fuse = new Fuse(allCourses, fuseOptions);

    if (!q) {
      setFilteredCourses(combinedCourses);
      setFilteredTrending(trending);
      setFilteredRecommended(Recommended);
      setSuggestions([]);
    } else {
      const results = fuse.search(q).map(result => result.item);
      setSuggestions(results.slice(0, 5));
      setFilteredCourses(results.filter(item => item.name));
      setFilteredTrending(results.filter(item => item.CourseName));
      setFilteredRecommended(results.filter(item => item.CourseName));
    }
  }, [searchQuery, userCourses]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.view1}>
              <View style={styles.inView1}>
                <Text style={styles.inviewText1}>ApexLearn</Text>
                <Text style={styles.inviewText2}>Discover new skills</Text>
              </View>

              <View style={{ position: 'relative', marginRight: 1 }}>
                <Icon
                  name="bell"
                  size={30}
                  color={unreadCount > 0 ? 'red' : 'black'}
                  onPress={() => navigation.navigate('Notifications')}
                  style={{ marginLeft: 35, marginRight: 3 }}
                />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image source={require('../assets/apexLearn2.png')} style={styles.tutorVieImage} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Search for courses"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {searchQuery.length > 0 && suggestions.length > 0 && (
              <View style={{ paddingHorizontal: 20 }}>
                {suggestions.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => setSearchQuery(item.name || item.CourseName)}>
                    <Text style={{ paddingVertical: 6, color: 'blue' }}>{item.name || item.CourseName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.view2}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selected === item.id;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelected(item.id);
                        navigation.navigate(`${item.id}`);
                      }}
                      style={[styles.catview, { backgroundColor: isSelected ? 'blue' : '#FFFFFE' }]}
                    >
                      <Text style={{ color: isSelected ? 'white' : 'black' }}>{item.category}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <Text style={styles.sectionTitle}>Most viewed Courses</Text>
            <View style={styles.view3}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={filteredCourses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.courseView} onPress={() => navigation.navigate(`${item.id}`)}>
                    <Image style={styles.courseImage} source={item.image} />
                    <View style={styles.tutorBioView}>
                      <Image source={item.tutorBio} style={styles.tutorView} />
                      <View>
                        <Text style={styles.tutorName}>{item.tutor}</Text>
                        <Text>{item.institution}</Text>
                      </View>
                    </View>
                    <Text style={styles.courseName}>{item.name}</Text>
                    <Text style={styles.about}>{item.about}</Text>
                    <View style={styles.amountView}>
                      <Text style={styles.amount}>{item.amount}</Text>
                      <Text style={styles.duration}>{item.time}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            <Text style={styles.sectionTitle}>New And Trending</Text>
            <View style={styles.view4}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={filteredTrending}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.trendingView} onPress={() => navigation.navigate('Enroll', { courseId: item.id })}>
                    <Image style={styles.trendingImage} source={item.image} />
                    <View style={styles.tutorBioView}>
                      <Image source={item.tutorImage} style={styles.tutorView} />
                      <View>
                        <Text style={styles.tutorName}>{item.tutorName}</Text>
                        <Text>{item.tutorDescription}</Text>
                      </View>
                    </View>
                    <Text style={styles.courseName}>{item.CourseName}</Text>
                    <View style={styles.amountView}>
                      <Text style={styles.amount}>{item.time}</Text>
                      <Text style={styles.duration}>{item.lessons}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <View style={styles.view4}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={filteredRecommended}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.trendingView} onPress={() => navigation.navigate('Enroll', { courseId: item.id })}>
                    <Image style={styles.trendingImage} source={item.image} />
                    <View style={styles.tutorBioView}>
                      <Image source={item.tutorImage} style={styles.tutorView} />
                      <View>
                        <Text style={styles.tutorName}>{item.tutorName}</Text>
                        <Text>{item.tutorDescription}</Text>
                      </View>
                    </View>
                    <Text style={styles.courseName}>{item.CourseName}</Text>
                    <View style={styles.amountView}>
                      <Text style={styles.amount}>{item.time}</Text>
                      <Text style={styles.duration}>{item.lessons}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            <Text style={styles.sectionTitle}>Top Mentors</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={mentors}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.mentors}>
                  <View style={{ marginRight: 10 }}>
                    <Image source={item.image} style={styles.mentorImage} />
                    <Text style={styles.menorName}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>

        {/* Floating Chat Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatBot')}
          style={styles.chatIcon}
        >
          <Icon name="robot" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: { marginTop: 30, backgroundColor: '#e9f5f9', flex: 1 },
  view1: {
    flexDirection: 'row', marginTop: 20, backgroundColor: 'white',
    height: 70, borderRadius: 10, paddingHorizontal: 10,
    alignItems: 'center', marginBottom: 40, marginHorizontal: 15,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 25, fontWeight: 'bold', paddingHorizontal: 20,
    marginBottom: 20, marginTop: 8, color: 'black'
  },
  tutorName: { fontWeight: '600', flexShrink: 1 },
  courseName: {
    fontWeight: 'bold', fontSize: 20, paddingHorizontal: 10,
    marginTop: 5, flexShrink: 1
  },
  courseImage: { height: 150, width: '100%', borderRadius: 12 },
  tutorView: { height: 50, width: 50, borderRadius: 30, marginRight: 10, marginTop: 5 },
  about: { color: 'grey', fontSize: 10, paddingHorizontal: 10 },
  inView1: { marginRight: 20 },
  inviewText1: { fontWeight: 'bold', fontSize: 20, color: 'green' },
  inviewText2: { fontWeight: '400', fontSize: 14 },
  bellIcons: { marginHorizontal: 60 },
  tutorVieImage: { height: 50, width: 50, borderRadius: 30, marginLeft: 70 },
  input: {
    backgroundColor: 'white', borderRadius: 12, borderColor: 'grey',
    height: 55, width: '90%', marginHorizontal: '5%', paddingHorizontal: 20,
  },
  catview: {
    flexDirection: 'row', marginRight: 20, height: 40, width: 100,
    backgroundColor: '#beeceb', borderRadius: 12, justifyContent: 'center',
    alignItems: 'center',
  },
  view4: { paddingHorizontal: 20 },
  view2: { flexDirection: 'row', marginTop: 40, paddingHorizontal: 20 },
  view3: { marginTop: 20, marginHorizontal: 20, marginBottom: 0 },
  courseView: {
    width: '100%', marginBottom: 20, backgroundColor: 'white', height: 300,
    borderRadius: 12,
  },
  trendingView: {
    width: screenWidth * 0.8, marginBottom: 20, backgroundColor: 'white', height: 300,
    borderRadius: 12, marginRight: 15, elevation: 0,
  },
  trendingImage: { height: 150, width: screenWidth * 0.8, borderRadius: 12 },
  tutorBioView: { flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' },
  amountView: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10 },
  amount: { fontSize: 18, fontWeight: 'bold' },
  duration: { color: 'grey' },
  mentors: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 20, justifyContent: 'center' },
  mentorImage: { height: 100, width: 100, borderRadius: 50, marginBottom: 6 },
  menorName: { fontWeight: '600', fontSize: 16, marginBottom: 10, textAlign: 'center' },

  // Floating Chat Icon
  chatIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
});
