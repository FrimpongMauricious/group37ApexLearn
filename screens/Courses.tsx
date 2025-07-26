import { StyleSheet, Text, View, Image, TextInput, ScrollView,
         FlatList, TouchableOpacity, Dimensions, Modal, Linking, RefreshControl } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fuse from 'fuse.js';
import axios from 'axios';
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
  const [newCourses, setNewCourses] = useState([]);

  //const { userCourses } = useContext(CourseContext);
  const { notifications } = useContext(NotificationContext);
  const unreadCount = notifications?.length || 0;
  const { userCourses, wishlist, addToWishlist, removeFromWishlist } = useContext(CourseContext);


  const combinedCourses = [...staticCourses, ...userCourses];
  const allCourses = [
    ...staticCourses,
    ...userCourses,
    ...trending,
    ...Recommended
  ];
  const [refreshing, setRefreshing] = useState(false);


  const [filteredCourses, setFilteredCourses] = useState(combinedCourses);
  const [filteredTrending, setFilteredTrending] = useState(trending);
  const [filteredRecommended, setFilteredRecommended] = useState(Recommended);

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showMentorModal, setShowMentorModal] = useState(false);

  const openMentorModal = (mentor) => {
    setSelectedMentor(mentor);
    setShowMentorModal(true);
  };

  const closeMentorModal = () => {
    setSelectedMentor(null);
    setShowMentorModal(false);
  };

  const handleSendEmail = () => {
    if (selectedMentor?.email) {
      const subject = `Mentorship Request - ApexLearn`;
      const body = `Dear ${selectedMentor.name},\n\nI am interested in mentorship. Kindly consider my proposal.\n\nRegards,\n[Your Name]`;
      const emailUrl = `mailto:${selectedMentor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      Linking.openURL(emailUrl);
    }
  };
  const onRefresh = async () => {
  setRefreshing(true);
  try {
    const response = await axios.get('https://updatedapexlearnbackend-1.onrender.com/api/courses');
    console.log("✅ Refreshed Courses:", response.data);
    setNewCourses(response.data);
  } catch (error) {
    console.error('❌ Error refreshing courses:', error.response?.data || error.message);
  }
  setTimeout(() => setRefreshing(false), 2000); // Ensure indicator shows for 3 seconds
};


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

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      // const response = await axios.get('http://10.132.178.11:8081/api/courses');
      // const response = await axios.get('http://10.132.178.11:8081/api/courses');
// Fetch courses
const response = await axios.get('https://updatedapexlearnbackend-1.onrender.com/api/courses');

      console.log("✅ New Courses Fetched:", response.data);
      setNewCourses(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch new courses:', error.response?.data || error.message);
    }
  };

  fetchCourses();
}, []);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4A90E2']} />
  }>
          <View style={styles.container}>
            {/* HEADER */}
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

            {/* SEARCH */}
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

            {/* CATEGORIES */}
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

            {/* MOST VIEWED */}
            <Text style={styles.sectionTitle}>Most viewed Courses</Text>
<View style={styles.view3}>
  <FlatList
    showsHorizontalScrollIndicator={false}
    data={filteredCourses}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => {
      const isWishlisted = wishlist.some(c => c.id === item.id);
      return (
        <View style={styles.courseView}>
          <TouchableOpacity onPress={() => navigation.navigate('Enroll', { newCourse: item })}>
            <Image
              style={styles.courseImage}
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            />
            <View style={styles.tutorBioView}>
              <Image
                source={typeof item.tutorBio === 'string' ? { uri: item.tutorBio } : item.tutorBio}
                style={styles.tutorView}
              />
              <View>
                <Text style={styles.tutorName}>{item.tutor}</Text>
                <Text>{item.institution}</Text>
              </View>

              {/* ✅ Bookmark Button */}
              <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={() =>
                  isWishlisted ? removeFromWishlist(item.id) : addToWishlist(item)
                }
              >
                <Icon
                  name="bookmark"
                  size={18}
                  color={isWishlisted ? '#cccc00' : 'gray'}
                  solid
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.about}>{item.about}</Text>
            <View style={styles.amountView}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text style={styles.duration}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }}
  />
</View>


            {/* TRENDING */}


            <Text style={styles.sectionTitle}>New And Trending</Text>
<View style={styles.view4}>
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={filteredTrending}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => {
      const isWishlisted = wishlist.some(course => course.id === item.id);

      return (
        <TouchableOpacity
          style={styles.trendingView}
          onPress={() => navigation.navigate('Enroll', { newCourse: item })}
        >
          <Image
            style={styles.trendingImage}
            source={
              typeof item.image === 'string'
                ? { uri: item.image }
                : item.image
            }
          />
          <View style={styles.tutorBioView}>
            <Image
              source={
                typeof item.tutorImage === 'string'
                  ? { uri: item.tutorImage }
                  : item.tutorImage
              }
              style={styles.tutorView}
            />
            <View>
              <Text style={styles.tutorName}>{item.tutorName}</Text>
              <Text>{item.tutorDescription}</Text>
            </View>
          </View>

          <View style={styles.bookmarkRow}>
            <Text style={styles.courseName}>{item.CourseName}</Text>
            <TouchableOpacity
              onPress={() =>
                isWishlisted
                  ? removeFromWishlist(item.id)
                  : addToWishlist(item)
              }
            >
              <Icon
                name="bookmark"
                solid={isWishlisted}
                color={isWishlisted ? '#cccc00' : '#B0B0B0'}
                size={18}
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.amountView}>
            <Text style={styles.amount}>{item.time}</Text>
            <Text style={styles.duration}>{item.lessons}</Text>
          </View>
        </TouchableOpacity>
      );
    }}
  />
</View>

           
            {/* RECOMMENDED */}
            <Text style={styles.sectionTitle}>Recommended For You</Text>
<View style={styles.view4}>
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={filteredRecommended}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => {
      const isWishlisted = wishlist.some(course => course.id === item.id);

      return (
        <TouchableOpacity
          style={styles.trendingView}
          onPress={() => navigation.navigate('Enroll', { newCourse: item })}
        >
          <Image
            style={styles.trendingImage}
            source={
              typeof item.image === 'string'
                ? { uri: item.image }
                : item.image
            }
          />
          <View style={styles.tutorBioView}>
            <Image
              source={
                typeof item.tutorImage === 'string'
                  ? { uri: item.tutorImage }
                  : item.tutorImage
              }
              style={styles.tutorView}
            />
            <View>
              <Text style={styles.tutorName}>{item.tutorName}</Text>
              <Text>{item.tutorDescription}</Text>
            </View>
          </View>

          <View style={styles.bookmarkRow}>
            <Text style={styles.courseName}>{item.CourseName}</Text>
            <TouchableOpacity
              onPress={() =>
                isWishlisted
                  ? removeFromWishlist(item.id)
                  : addToWishlist(item)
              }
            >
              <Icon
                name="bookmark"
                solid={isWishlisted}
                color={isWishlisted ? '#cccc00' : '#B0B0B0'}
                size={18}
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.amountView}>
            <Text style={styles.amount}>{item.time}</Text>
            <Text style={styles.duration}>{item.lessons}</Text>
          </View>
        </TouchableOpacity>
      );
    }}
  />
</View>






           
            {/* NEW COURSES (BACKEND) */}
            <Text style={styles.sectionTitle}>Newly Uploaded Courses</Text>
<View style={styles.view4}>
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={newCourses}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => {
      const isWishlisted = wishlist.some(course => course.id === item.id);

      return (
        <TouchableOpacity
          style={styles.trendingView}
          onPress={() => navigation.navigate('Enroll', { newCourse: item })}
        >
          <Image
            style={styles.trendingImage}
            source={{ uri: item.imageUrl }}
          />
          <View style={styles.tutorBioView}>
            <Image
              source={require('../assets/apple.png')}
              style={styles.tutorView}
            />
            <View>
              <Text style={styles.tutorName}>{item.tutorName}</Text>
              <Text>{item.organizationName}</Text>
            </View>
          </View>

          <View style={styles.bookmarkRow}>
            <Text style={styles.courseName}>{item.title}</Text>
            <TouchableOpacity
              onPress={() =>
                isWishlisted
                  ? removeFromWishlist(item.id)
                  : addToWishlist(item)
              }
            >
              <Icon
                name={isWishlisted ? 'bookmark' : 'bookmark'}
                solid={isWishlisted}
                color={isWishlisted ? '#cccc00' : '#B0B0B0'}
                size={18}
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.about}>{item.description?.slice(0, 40)}...</Text>
          <View style={styles.amountView}>
            <Text style={styles.amount}>Free</Text>
            <Text style={styles.duration}>Online</Text>
          </View>
        </TouchableOpacity>
      );
    }}
  />
</View>

            {/* MENTORS */}
            <Text style={styles.sectionTitle}>Top Mentors</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={mentors}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.mentors} onPress={() => openMentorModal(item)}>
                  <View style={{ marginRight: 10 }}>
                    <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.mentorImage} />
                    <Text style={styles.menorName}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => navigation.navigate('ChatBot')}
          style={styles.chatIcon}
        >
          <Icon name="robot" size={24} color="white" />
        </TouchableOpacity>

        {selectedMentor && (
          <Modal
            visible={showMentorModal}
            animationType="slide"
            transparent
            onRequestClose={closeMentorModal}
          >
            <View style={modalStyles.overlay}>
              <View style={modalStyles.container}>
                <Image source={typeof selectedMentor.image === 'string' ? { uri: selectedMentor.image } : selectedMentor.image} style={modalStyles.image} />
                <Text style={modalStyles.name}>{selectedMentor.name}</Text>
                <Text style={modalStyles.detail}>   Expertise: {selectedMentor.expertise}</Text>
                <Text style={modalStyles.detail}>   Workplace: {selectedMentor.workplace}</Text>
                <Text style={modalStyles.detail}>   {selectedMentor.phone}</Text>
                <Text style={modalStyles.detail}>   {selectedMentor.email}</Text>

                <TouchableOpacity style={modalStyles.button} onPress={handleSendEmail}>
                  <Text style={modalStyles.buttonText}>Send Mentorship Proposal</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={closeMentorModal}>
                  <Text style={{ color: 'red', marginTop: 10 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
  bookmarkButton: {
  marginLeft: 'auto',
  padding: 5,

},
bookmarkRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: 10,
},

bookmarkIcon: {
  paddingLeft: 10,
  marginTop: -5,
},

});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    marginVertical: 2,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  bookmarkRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: 10,
},

bookmarkIcon: {
  paddingLeft: 10,
  marginTop: -5,
},

  


});
