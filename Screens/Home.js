import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { firebase } from '../config';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const todoRef = firebase.firestore().collection('todos');
  const logRef = firebase.firestore().collection('log');
  const [addData, setAddData] = useState('');
  const [addDateTime, setAddDateTime] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    todoRef
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
          const { heading, completed, dateTime } = doc.data();
          todos.push({
            id: doc.id,
            heading,
            completed,
            dateTime,
          });
        });
        setTodos(todos);
      });
  }, []);

  const deleteTodo = (todo) => {
    todoRef
      .doc(todo.id)
      .delete()
      .then(() => {
        alert('Deletado');

        logRef.add({
          action: `Evento deletado: ${todo.heading}`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const toggleTaskCompletion = (todo) => {
    const updatedTodos = todos.map((item) =>
      item.id === todo.id ? { ...item, completed: !item.completed } : item
    );
    setTodos(updatedTodos);

    todoRef
      .doc(todo.id)
      .update({ completed: !todo.completed })
      .then(() => {
        logRef.add({
          action: `Estado do evento alterado: ${todo.heading}`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const addTodo = () => {
    if (addData && addData.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: addData,
        completed: false,
        createdAt: timestamp,
        dateTime: addDateTime || '',
      };

      todoRef
        .add(data)
        .then(() => {
          setAddData('');
          setAddDateTime('');
          Keyboard.dismiss();

          logRef.add({
            action: `Evento criado: ${addData}`,
            timestamp,
          });
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      alert('Por favor, preencha o campo "Adicione um Evento".');
    }
  };

  const goToLogScreen = () => {
    navigation.navigate('LogScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicione um Evento"
          placeholderTextColor="#aaaaaa"
          onChangeText={(heading) => setAddData(heading)}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInputMask
          style={styles.input}
          placeholder="Data e Hora (opcional)"
          placeholderTextColor="#aaaaaa"
          keyboardType="numeric"
          onChangeText={(dateTime) => setAddDateTime(dateTime)}
          value={addDateTime}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          textAlign="right"
          type={'datetime'}
          options={{
            format: 'DD/MM/YYYY HH:mm',
          }}
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Novo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Pressable
              style={styles.innerContainer}
              onPress={() => navigation.navigate('Detail', { item })}
            >
              <FontAwesome
                name="trash-o"
                color="red"
                onPress={() => deleteTodo(item)}
                style={styles.todoIcon}
              />
              <FontAwesome
                name="check"
                color={item.completed ? 'green' : 'gray'}
                onPress={() => toggleTaskCompletion(item)}
                style={styles.todoIcon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.itemHeading} numberOfLines={null} ellipsizeMode="tail">
                  {item.heading && item.heading.length > 47
                    ? item.heading.match(/.{1,47}/g).join('\n')
                    : item.heading}
                </Text>
                <Text>{item.dateTime}</Text>
              </View>
            </Pressable>
          </View>
        )}
      />
      <TouchableOpacity onPress={goToLogScreen} style={styles.logButton}>
        <FontAwesome name="list-alt" size={24} color="black" />
        <Text style={styles.logButtonText}>Logs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flexDirection: 'row',
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 100,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  itemContainer: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    margin: 5,
    marginHorizontal: 10,
    width: '100%',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
  },
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 22,
  },
  dateTimeContainer: {
    marginLeft: 'auto',
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14,
  },
  logButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    elevation: 3,
  },
  logButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default Home;
