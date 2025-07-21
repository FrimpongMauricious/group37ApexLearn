import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Welcome from './screens/Welcome';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import SignInWithEmail from './screens/SignInWithEmail';
import Courses from './screens/Courses';
import AI from './screens/AI';
import UI from './screens/UI';
import DA from './screens/DA';
import SE from './screens/SE';
import PM from './screens/PM';
import MyClass from './screens/MyClass';
import Notification from './screens/Notifications';
import Progress from './screens/Progress';
import Download from './screens/Download';
import WishList from './screens/WishList';
import Note from './screens/Note';
import CourseCreation from './screens/CourseCreation';
import PaymentScreen from './screens/PaymentScreen';
import ProfileScreen from './screens/ProfileScreen';
import Licencse from './screens/Licencse';
import ChatbotScreen from './screens/ChatbotScreen';
import OnboardingScreen from './screens/OnboardingScreen';

import { CourseProvider } from './context/CourseContext';
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import CourseVideoScreen from './screens/CourseVideoSceen';
import CourseDetailDynamicScreen from './screens/CourseDetailDynamicScreen';
import QuizCenter from './screens/QuizCenter';
import QuizCenterScreen from './screens/QuizCenter';
import QuizScreen from './screens/QuizScreen';
import LearnSchedulerScreen from './screens/LearnSchedulerScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ---------------- Stacks ----------------

function CoursesStack() {
  return (
    <Stack.Navigator initialRouteName="AllCourses" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllCourses" component={Courses} />
      <Stack.Screen name="AI" component={AI} />
      <Stack.Screen name="UI" component={UI} />
      <Stack.Screen name="DA" component={DA} />
      <Stack.Screen name="SE" component={SE} />
      <Stack.Screen name="PM" component={PM} />
      <Stack.Screen name="Notifications" component={Notification} />
      <Stack.Screen name="Enroll" component={PaymentScreen} />
      <Stack.Screen name="WishList" component={WishList} />
      <Stack.Screen name="ChatBot" component={ChatbotScreen} />
      <Stack.Screen name="Progress" component={MyProgressStack} />
    </Stack.Navigator>
  );
}
// function MyProgressStack(){
//   return(
//   <Stack.Navigator initialRouteName='Progress' screenOptions={{headerShown:false}}>
//     <Stack.Screen name='Progress' component={Progress}/>
//     <Stack.Screen name='CourseVideo' component={CourseVideoScreen}/>
   


//   </Stack.Navigator>
//   );
//}
function CourseVideoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="CourseVideo">
      <Stack.Screen name="CourseVideo" component={CourseVideoScreen} />
      <Stack.Screen name="QuizCenter" component={QuizCenterScreen} />
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
    </Stack.Navigator>
  );
}
function MyProgressStack() {
  return (
    <Stack.Navigator initialRouteName="Progress" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Progress" component={Progress} />
      <Stack.Screen
        name="CourseVideoStack"
        component={CourseVideoStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="LearnSchedulerScreen" component={LearnSchedulerScreen} />
    </Stack.Navigator>
  );
}

function MyClassStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MyClass">
      <Stack.Screen name="MyClass" component={MyClass} />
      <Stack.Screen name="Progress" component={MyProgressStack} />
      <Stack.Screen name="Note" component={Note} />
      <Stack.Screen name="WishList" component={WishListStack} />
      <Stack.Screen name="Download" component={Download} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Logout" component={SignInWithEmail}/>
      <Stack.Screen name=" Available Courses" component={CoursesStack} />
      <Stack.Screen name="Bot" component={ChatbotScreen} />
      <Stack.Screen name="Help" component={Licencse} />
    </Stack.Navigator>
  );
}

function CourseCreationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Create Course">
      <Stack.Screen name="Create Course" component={CourseCreation} />
      <Stack.Screen name="makePayment" component={PaymentStack} />
    </Stack.Navigator>
  );
}

function PaymentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Payment">
      <Stack.Screen name="Courses" component={CoursesStack} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      
      {/* <Stack.screen name='TrendingOrRecommended' component={CourseDetailDynamicScreen}/> */}
    </Stack.Navigator>
  );
}

function WishListStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="WishList">
      <Stack.Screen name="WishList" component={WishList} />
      <Stack.Screen name="payForWishCourse" component={PaymentStack} />
    </Stack.Navigator>
  );
}

// ---------------- Drawers ----------------

function LoggedInDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Available Courses"
      screenOptions={{ headerShown: false, drawerStyle: { width: 300 } }}
    >
      <Drawer.Screen name="Available Courses" component={CoursesStack} />
      <Drawer.Screen name="My Profile" component={MyClassStack} />
      <Drawer.Screen name="Create a Course" component={CourseCreationStack} />
    </Drawer.Navigator>
  );
}

function PreLoginDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Sign In"
      screenOptions={{ headerShown: false, drawerStyle: { width: 300 } }}
    >
      <Drawer.Screen name="SignUp" component={SignUp} />
      <Drawer.Screen name="Log out" component={AboutScreenStack} />
      <Drawer.Screen name="Sign In" component={SignInWithEmail} />
    </Drawer.Navigator>
  );
}

function AboutScreenStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="About">
      <Stack.Screen name="Terms" component={Licencse} />
      <Stack.Screen name="About" component={Login} />
    </Stack.Navigator>
  );
}

// ---------------- Main App Flow ----------------

function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="PreLogin" component={PreLoginDrawerNavigator} />
      <Stack.Screen name="LoggedIn" component={LoggedInDrawerNavigator} />
    </Stack.Navigator>
  );
}

// ---------------- App Container ----------------

export default function App() {
  return (
    <NotificationProvider>
      <UserProvider>
        <CourseProvider>
          <NavigationContainer>
            <MainStackNavigator />
          </NavigationContainer>
        </CourseProvider>
      </UserProvider>
    </NotificationProvider>
  );
}
