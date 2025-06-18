

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList,
  TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import { SafeAreaProvider } from 'react-native-safe-area-context';

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
    keywords: ['mentorship', 'mentor', 'guidance', 'mentors','mentoring',   'advice', 'counsel', 'support', 'expert guidance', 'professional advice', 'career guidance', 'mentorship program', 'mentorship opportunities'],
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
    answer: 'You can view and edit you profile by navigating to the my class page via the drawer menu. There you can find your profile details and edit themby taping on the display picture or the "view prfile button".',
  },
  {
    keywords: ['My Downloads', 'my downloads', 'downloaded content', 'downloaded courses', 'downloaded lessons', 'offline content', 'offline courses', 'offline lessons', 'download management', 'download section', 'download feature', 'downloaded materials', 'my downloaded materials'],
    answer: 'You can access your downloaded content in the My Downloads screen, where you can view and manage all your downloaded courses and lessons. This screen can be located by navigating to the my class page via the drawer menu.',
  },
  
];

const suggestionsList = [
  'How do I enroll in a course?',
  'How can I upload content?',
  'Where can I track my progress?',
  'How to reset my password?',
  'Contact support',
  'How can I get mentorship?',
];

const ChatbotScreen = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const getBotResponse = (userInput) => {
    const cleanedInput = userInput.toLowerCase();
    for (const pair of qaPairs) {
      if (pair.keywords.some(keyword => cleanedInput.includes(keyword))) {
        return pair.answer;
      }
    }
    return "I'm not sure how to help with that yet. Try rephrasing your question or use precise keywords.";
  };

  const handleFeedback = (index, isHelpful) => {
    const feedbackMsg = isHelpful ? "Thanks for the feedback! 😊" : "We’ll improve this soon!";
    const botMessage = { text: feedbackMsg, sender: 'bot' };
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
    // Removed: Speech.speak(botReply);
  };

  const renderMessage = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={400}
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
        >
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            keyboardShouldPersistTaps="handled"
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
