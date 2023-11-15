import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Adiciona informações adicionais do usuário à coleção 'users'
        firebase.firestore().collection('users').doc(user.uid).set({
          email: email,
          // Outras informações que você deseja armazenar
        });

        Alert.alert('Cadastro realizado com sucesso!');
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert(`Erro no cadastro: ${errorMessage}`);
      });
  };

  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Login realizado com sucesso!');
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert(`Erro no login: ${errorMessage}`);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Cadastrar" onPress={handleSignUp} />
      <Button title="Entrar" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default AuthComponent;
