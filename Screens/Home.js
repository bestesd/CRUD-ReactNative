import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const todoRef = firebase.firestore().collection('todos');
  const [addData, setAddData] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    todoRef
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
          const { heading, completed, createdAt } = doc.data();
          todos.push({
            id: doc.id,
            heading,
            completed,
            createdAt,
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
      })
      .catch((error) => {
        alert(error);
      });
  };

  const toggleTaskCompletion = (todo) => {
    const updatedTodos = todos.map((item) =>
      item.id === todo.id
        ? { ...item, completed: !item.completed }
        : item
    );
    setTodos(updatedTodos);

    todoRef
      .doc(todo.id)
      .update({ completed: !todo.completed })
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
      };
      todoRef
        .add(data)
        .then(() => {
          setAddData('');
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.outContainer}></View>
      <View style={styles.inContainer}>
      <View style={styles.formContainer}>
        {/* <TextInput
          style={styles.input}
          placeholder="Adicione um Evento"
          placeholderTextColor="#aaaaaa"
          onChangeText={(heading) => setAddData(heading)}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        /> */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create')}>
          <Text style={styles.buttonText}>Novo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        numColumns={1}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Pressable style={styles.todoContainer} onPress={() => navigation.navigate('Detail', { item })}>
              <FontAwesome name="trash-o" color="red" onPress={() => deleteTodo(item)} style={styles.todoIcon} />
              <FontAwesome name="check" color={item.completed ? 'green' : 'gray'} onPress={() => toggleTaskCompletion(item)} style={styles.todoIcon} />
              <View style={styles.textContainer}>
                <Text style={styles.itemHeading}>{item.heading[0].toUpperCase() + item.heading.slice(1)}</Text>
                <Text style={styles.itemDate}>{new Date(item.createdAt?.toDate()).toLocaleString()}</Text>
              </View>
            </Pressable>
          </View>
        )}
      />
      </View>
      <View style={styles.outContainer}></View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',  },
  inContainer: {
    flex: 5,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius:10
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 30,
  },
  outContainer:{
    flex:1,
    backgroundColor:'blue',
  },
  input: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    paddingLeft: 10,
    flex: 1,
    marginRight: 10,
    fontSize: 18,
  },
  // button: {
  //   height: 40,
  //   borderRadius: 5,
  //   backgroundColor: '#3498db',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: 60,
  // },
  button: {
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
},
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoIcon: {
    marginRight: 10,
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  itemDate: {
    color: '#666',
    fontSize: 16,
  },
});

export default Home;
