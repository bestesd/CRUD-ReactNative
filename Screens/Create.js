import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';

const Create = () => {
    const [addData, setAddData] = useState('');
    const [todos, setTodos] = useState([]);
    const todoRef = firebase.firestore().collection('todos');
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
            //   Keyboard.dismiss();
            navigation.navigate('Home',{ timestamp: Date.now() });
            console.log('sucesso')
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
                  <TextInput
                      style={styles.input}
                      placeholder="Adicione um Evento"
                      placeholderTextColor="#aaaaaa"
                      onChangeText={(heading) => setAddData(heading)}
                      value={addData}
                      underlineColorAndroid="transparent"
                      autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.button} onPress={addTodo}>
                      <Text style={styles.buttonText}>Novo</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.outContainer}></View>

          </View>
      )
}

export default Create

const styles = StyleSheet.create({
    container:{
        backgroundColor:'blue',
        flex:1,
    },
    inContainer: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 20,
        borderRadius:10
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
        marginRight: 10,
        fontSize: 18,
        borderBottomWidth: 1,
        marginBottom: 12,
        fontSize: 16,
    },
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
})