import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View } from 'react-native';
import { Input, Button, ListItem, CheckBox, Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksString = await AsyncStorage.getItem('tasks');
      if (tasksString) {
        const loadedTasks: Task[] = JSON.parse(tasksString);
        setTasks(loadedTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  const saveTasks = async (tasks: Task[]) => {
    try {
      const tasksString = JSON.stringify(tasks);
      await AsyncStorage.setItem('tasks', tasksString);
    } catch (error) {
      console.error('Failed to save tasks', error);
    }
  };

  const addTask = () => {
    if (taskText.trim().length === 0) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveTasks(newTasks);
    setTaskText('');
  };

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Add a task"
          value={taskText}
          onChangeText={setTaskText}
          containerStyle={styles.input}
        />
        <Button
          title="Add"
          onPress={addTask}
          buttonStyle={styles.addButton}
        />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <CheckBox
              checked={item.completed}
              onPress={() => toggleTaskCompletion(item.id)}
            />
            <ListItem.Content>
              <ListItem.Title style={item.completed ? styles.completedTask : null}>
                {item.text}
              </ListItem.Title>
            </ListItem.Content>
            <Icon
              name="delete"
              onPress={() => deleteTask(item.id)}
            />
          </ListItem>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
  },
  addButton: {
    marginLeft: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through',
  },
});

export default HomeScreen;
