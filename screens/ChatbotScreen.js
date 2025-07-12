import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  SafeAreaView, ScrollView, Animated, Easing
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const PIXEL_BOT = require('../assets/apexLearn_bot.png');

const qaPairs = [
  {
    keywords: ['enroll', 'join', 'sign up', 'register', 'learn', 'course', 'start learning', 'begin course', 'start course', 'enrollment', 'registration', 'sign up for course', 'join course', 'course enrollment', 'course registration', 'sign up for learning', 'join learning', 'start learning course', 'enroll in course', 'join learning course', 'register for course'],
    answer: 'To enroll in a course, search for the course and tap the "Enroll" button.',
  },
  {
    keywords: ['upload', 'create', 'post lesson', 'add course', 'add content', 'create course', 'upload content', 'add lesson', 'course creation', 'content upload', 'lesson upload', 'course upload', 'add course content', 'create lesson', 'upload lesson', 'add new course', 'create new course', 'upload new content', 'create new content'],
    answer: 'Use the Create Course screen from the drawer to upload content.',
  },
  {
    keywords: ['contact', 'email', 'support', 'help', 'issue', 'problem', 'question', 'inquiry', 'assistance', 'customer support', 'technical support', 'get help', 'contact us', 'reach out', 'support team', 'customer service'],
    answer: 'You can contact us at mauriciousfrimpong@gmail.com or call 0531850867.',
  },
  {
    keywords: ['mentorship', 'mentor', 'guidance', 'mentors','mentoring', 'advice', 'counsel', 'support', 'expert guidance', 'professional advice', 'career guidance', 'mentorship program', 'mentorship opportunities'],
    answer: 'You can reach out to People of high influence in your field for mentorship via the list of mentors listed below the available courses page in the home screen.',
  },
  {
    keywords: ['notification', 'notifications', 'alerts', 'updates', 'messages', 'news', 'announcements', 'reminders', 'alerts and updates', 'course notifications', 'app notifications', 'new notifications', 'notification center', 'notification screen', 'view notifications', 'check notifications'],
    answer: 'All notifications are displayed in the Notifications screen accessible by taping  the bell icon found just at the top of the all courses page.',
  },
  {
    keywords: ['note', 'notes', 'personal notes', 'my notes', 'note taking', 'write notes', 'create notes', 'add notes', 'note management', 'note organization', 'note app', 'note feature', 'note section', 'note functionality', 'note-taking feature', 'note-taking section', 'note-taking functionality'],
    answer: 'You can access your personal noted by navigating to the my class page where you can find all saved notes',
  },
  {
    keywords: ['progress', 'track progress', 'learning progress', 'course progress', 'check progress', 'monitor progress', 'view progress', 'progress tracking', 'progress report', 'progress overview', 'learning journey', 'course completion', 'track learning'],
    answer: 'You can track your progress in the My Class screen, where you can see your enrolled courses and their completion status.',
  },
  {
    keywords: ['Profile', 'profile', 'user profile', 'account settings', 'user account', 'my profile', 'edit profile', 'view profile', 'profile settings', 'account profile', 'personal profile', 'profile information', 'profile details', 'profile management', 'profile customization', 'profile update', 'profile edit','dashboard', 'user dashboard', 'profile page', 'profile section'],
    answer: 'You can view and edit you profile by navigating to the my class page via the drawer menu. There you can find your profile details and edit them by taping on the display picture or the "view profile button".',
  },
  {
    keywords: ['My Downloads', 'my downloads', 'downloaded content', 'downloaded courses', 'downloaded lessons', 'offline content', 'offline courses', 'offline lessons', 'download management', 'download section', 'download feature', 'downloaded materials', 'my downloaded materials'],
    answer: 'You can access your downloaded content in the My Downloads screen, where you can view and manage all your downloaded courses and lessons. This screen can be located by navigating to the my class page via the drawer menu.',
  },
  {
    keywords: ['settings', 'app settings', 'preferences', 'configuration', 'app configuration', 'user settings', 'account settings', 'application settings', 'settings menu', 'settings screen', 'settings page', 'settings options', 'settings features'],
    answer: 'You can access the settings screen by navigating to the my class page via the drawer',
  },
  {
    keywords:['what is the name of this app', 'app name', 'name of the app', 'application name', 'what is this app called', 'app title', 'application title', 'app identification', 'app branding', 'app identity', 'app description', 'app purpose', 'app function', 'app features'],
    answer:'This app is called ApexLearn, a platform for learning and personal development.',
  },
  {
    keywords:['developer', 'developer name', 'app developer', 'developer information', 'developer details', 'developer contact', 'developer profile', 'developer background', 'developer expertise', 'developer skills', 'developer experience', 'developer portfolio', 'developer team', 'developer group', 'developer company', 'developer organization', 'developer team members', 'developer team information', 'developer team details', 'developer team contact', 'developer team profile', 'developer team background', 'developer team expertise', 'developer team skills', 'developer team experience', 'developer team portfolio'],
    answer:'This app was developed by Mauricious Frimpong(full stack developer), Nana Poku(front end developer), Osmond(project manager), Henry(Back-end developer), Nana Baffour(Back-end developer), Eugene(UI/UX designer) and Gifty(front end developer).',
  }
];


const suggestionsList = [
  'How do I enroll in a course?',
  'How can I upload content?',
  'Where can I track my progress?',
  'Tell me something about the app',
  'Contact support',
  'How can I get mentorship?',
];

const ChatbotScreen = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const orbitAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbitAnim, {
          toValue: -10,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(orbitAnim, {
          toValue: 10,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    const welcomeMsg = {
      text: "Hi there! I'm Pixxxel, your personal assistant for ApexLearn. I'm here to guide you through anything you need. Just ask me a question and I’ll do my best. If I can’t answer, I’ll let you know politely!",
      sender: 'bot',
    };
    setMessages([welcomeMsg]);
  }, []);

  const getBotResponse = (userInput) => {
    const cleanedInput = userInput.toLowerCase();
    let bestMatch = { score: 0, answer: null };

    for (const pair of qaPairs) {
      for (const keyword of pair.keywords) {
        const similarity = fuzzyMatch(cleanedInput, keyword);
        if (similarity > bestMatch.score) {
          bestMatch = { score: similarity, answer: pair.answer };
        }
      }
    }

    return bestMatch.score > 0.3
      ? bestMatch.answer
      : "I'm not sure how to help with that yet. Try rephrasing your question or use precise keywords.";
  };

  const fuzzyMatch = (input, keyword) => {
    const common = input.split(' ').filter(word => keyword.includes(word)).length;
    return common / keyword.split(' ').length;
  };

  const handleFeedback = (index, isHelpful) => {
    const botMessage = {
      text: isHelpful ? "Thanks for the feedback! 😊" : "We’ll improve this soon!",
      sender: 'bot',
    };
    setMessages(prev => [...prev.slice(0, index + 1), botMessage]);
  };

  const sendMessage = (customInput) => {
    const text = customInput || input;
    if (!text.trim()) return;

    const userMessage = { text, sender: 'user' };
    const botReply = getBotResponse(text);
    const botMessage = { text: botReply, sender: 'bot', showFeedback: true };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 10}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.botIntroContainer}>
                <Animated.Image
                  source={PIXEL_BOT}
                  style={[styles.botImage, { transform: [{ translateX: orbitAnim }] }]}
                />
                <Animatable.Text animation="fadeInUp" delay={300} style={styles.botIntroText}>
                  Hi, I'm <Text style={{ fontWeight: 'bold' }}>Pixxxel</Text> 👋 — your ApexLearn AI buddy.
                  Ask me anything and I’ll try my best to help you out!
                </Animatable.Text>
              </View>

              <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => {
                  const animation = index === 0 ? 'fadeInDownBig' : 'fadeInUp';
                  return (
                    <Animatable.View
                      animation={animation}
                      duration={600}
                      style={[
                        styles.messageBubble,
                        item.sender === 'user' ? styles.userBubble : styles.botBubble,
                      ]}
                    >
                      <Text style={styles.messageText}>{item.text}</Text>
                      {item.showFeedback && (
                        <View style={styles.feedbackContainer}>
                          <Text style={styles.feedbackText}>Was this helpful?</Text>
                          <TouchableOpacity onPress={() => handleFeedback(index, true)}>
                            <Text style={styles.thumb}>👍</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleFeedback(index, false)}>
                            <Text style={styles.thumb}>👎</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </Animatable.View>
                  );
                }}
                contentContainerStyle={styles.messageList}
              />

              <View style={styles.suggestionWrap}>
                {suggestionsList.map((text, i) => (
                  <TouchableOpacity key={i} onPress={() => sendMessage(text)} style={styles.suggestion}>
                    <Text style={styles.suggestionText}>{text}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Ask me anything..."
                  style={styles.input}
                  onSubmitEditing={() => sendMessage()}
                  returnKeyType="send"
                />
                <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()}>
                  <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 30,
  },
  container: {
    flex: 1,
  },
  botIntroContainer: {
    alignItems: 'center',
    padding: 20,
  },
  botImage: {
    width: 250,
    height: 200,
    borderRadius: 50,
    marginBottom: 10,
  },
  botIntroText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#444',
  },
  messageList: {
    padding: 10,
    paddingBottom: 120,
  },
  messageBubble: {
    marginVertical: 6,
    maxWidth: '80%',
    padding: 12,
    borderRadius: 14,
  },
  userBubble: {
    backgroundColor: '#0078fe',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: 'grey',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: 'green',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  suggestionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  suggestion: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  suggestionText: {
    fontSize: 12,
    color: '#333',
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  feedbackText: {
    color: '#fff',
    marginRight: 10,
    fontSize: 12,
  },
  thumb: {
    fontSize: 18,
    marginHorizontal: 5,
  },
});
