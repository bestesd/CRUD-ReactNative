import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';

const Detail = ({ route }) => {
  const todoRef = firebase.firestore().collection('todos');
  const [textHeading, onChangeHeadingText] = useState(route.params.item.heading);
  const [textDateTime, onChangeTextDateTime] = useState(route.params.item.dateTime);
  const navigation = useNavigation();

  const updateTodo = () => {
    if (textHeading && textHeading.length > 0) {
      const updatedData = {
        heading: textHeading,
        dateTime: textDateTime,
      };

      todoRef
        .doc(route.params.item.id)
        .update(updatedData)
        .then(() => {
          navigation.navigate('Home');

          const logRef = firebase.firestore().collection('log');
          logRef.add({
            action: `Evento atualizado: ${textHeading}`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textField}
        onChangeText={onChangeHeadingText}
        value={textHeading}
        placeholder="Update Todo"
      />
      <TextInputMask
        style={styles.textField}
        placeholder="Update Date/Time"
        placeholderTextColor="#aaaaaa"
        keyboardType="numeric"
        onChangeText={onChangeTextDateTime}
        value={textDateTime}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        textAlign="right"
        type={'datetime'}
        options={{
          format: 'DD/MM/YYYY HH:mm',
        }}
      />
      <Pressable style={styles.buttonUpdate} onPress={() => updateTodo()}>
        <Text>Renomear</Text>
      </Pressable>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },
  textField: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: '#000000',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  buttonUpdate: {
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: '#0de065',
  },
});
