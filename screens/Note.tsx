import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../context/UserContext';

const DEFAULT_NOTE = {
  id: 'default_note_apexlearn',
  title: 'Team ApexLearn',
  content: 'Hey learner, you can keep your personal notes here for future reference..\nHappy learning 🥳🥳',
  timestamp: new Date().toISOString(),
  isDefault: true,
};

const Note = () => {
  const { user } = useContext(UserContext);
  const userEmail = user?.email || 'guest';
  const STORAGE_KEY = `user_notes_${userEmail}`;

  const [notes, setNotes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        let loadedNotes = stored ? JSON.parse(stored) : [];

        // Add default note if it doesn't exist
        const hasDefault = loadedNotes.some(note => note.id === DEFAULT_NOTE.id);
        if (!hasDefault) {
          loadedNotes = [DEFAULT_NOTE, ...loadedNotes];
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loadedNotes));
        }

        setNotes(loadedNotes);
      } catch (err) {
        console.error('Error loading notes:', err);
      }
    };
    loadNotes();
  }, [STORAGE_KEY]);

  const saveNotesToStorage = async (notesToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notesToSave));
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const handleSave = () => {
    if (!title || !content) {
      Alert.alert('Missing Fields', 'Please enter both a title and content.');
      return;
    }

    const timestamp = new Date().toISOString();

    if (editingNoteId !== null) {
      const noteToEdit = notes.find(n => n.id === editingNoteId);
      if (noteToEdit?.isDefault) {
        Alert.alert('Not Editable', 'This note is protected and cannot be edited.');
        return;
      }

      const updatedNotes = notes.map((n) =>
        n.id === editingNoteId ? { ...n, title, content, timestamp } : n
      );
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
    } else {
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
        timestamp,
      };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
    }

    setTitle('');
    setContent('');
    setShowEditor(false);
    setEditingNoteId(null);
  };

  const handleEdit = (note) => {
    if (note.isDefault) {
      Alert.alert('Not Editable', 'This note is protected and cannot be edited.');
      return;
    }
    setTitle(note.title);
    setContent(note.content);
    setShowEditor(true);
    setEditingNoteId(note.id);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedNotes = notes.filter((n) => n.id !== id);
          setNotes(updatedNotes);
          saveNotesToStorage(updatedNotes);
        },
      },
    ]);
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.noteDate}>
          {moment(item.timestamp).format('MMM Do, YYYY [at] h:mm A')}
        </Text>
      </View>
      <Text numberOfLines={3} style={styles.noteContent}>
        {item.content}
      </Text>
      <View style={styles.actions}>
        {!item.isDefault && (
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
            <Icon name="edit" size={18} color="#0077cc" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
          <Icon name="trash" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {showEditor && (
          <View style={styles.editor}>
            <TextInput
              style={styles.input}
              placeholder="Note Title (max 30 chars)"
              value={title}
              maxLength={30}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your note here..."
              value={content}
              onChangeText={setContent}
              multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {editingNoteId ? 'Update Note' : 'Save Note'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>You have no saved notes yet.</Text>
          }
        />

        {!showEditor && (
          <TouchableOpacity style={styles.createButtonBottom} onPress={() => setShowEditor(true)}>
            <Text style={styles.createButtonText}>+ Create Note</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Note;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff' },
  list: { padding: 16, paddingBottom: 100 },
  editor: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    elevation: 3,
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#0077cc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  createButtonBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#0077cc',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  noteDate: { fontSize: 12, color: '#777' },
  noteContent: { fontSize: 14, color: '#444' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    marginLeft: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    color: '#999',
    fontSize: 16,
  },
});
