import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

interface Todo {
  id: string;
  description: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState('');

  const addTodo = () => {
    if (description.trim() === '') return;
    setTodos([
      ...todos,
      { id: Date.now().toString(), description, completed: false }
    ]);
    setDescription('');
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <Text style={item.completed ? styles.todoTextCompleted : styles.todoText}>
        {item.description}
      </Text>
      <View style={styles.todoActions}>
        <Button title={item.completed ? "Undo" : "Complete"} onPress={() => toggleComplete(item.id)} />
        <Button title="Delete" onPress={() => removeTodo(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoText: {
    fontSize: 18,
  },
  todoTextCompleted: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  todoActions: {
    flexDirection: 'row',
  },
});
