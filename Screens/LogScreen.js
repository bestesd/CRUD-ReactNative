import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const LogScreen = () => {
  const [logData, setLogData] = useState([]);
  const logRef = firebase.firestore().collection('log');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = logRef
      .orderBy('timestamp', 'desc')
      .onSnapshot((querySnapshot) => {
        const logEntries = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.timestamp) {
            logEntries.push({
              id: doc.id,
              action: data.action || '',
              timestamp: data.timestamp.toDate().toLocaleString(),
            });
          }
        });
        setLogData(logEntries);
      });

    return () => unsubscribe();
  }, []);

  const clearLogs = () => {
    logRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          logRef.doc(doc.id).delete();
        });
      })
      .catch((error) => {
        console.error('Erro ao limpar os logs:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log de Atividades</Text>
      <FlatList
        data={logData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.logEntry}>
            <Text>{item.action}</Text>
            <Text>{item.timestamp}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={clearLogs}>
        <Text style={styles.buttonText}>Limpar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  logEntry: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingVertical: 8,
  },
  button: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#788eec',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LogScreen;
