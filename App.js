import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Screens/Home';
import Detail from './Screens/Detail';
import Create from './Screens/Create';
import AuthComponent from './Screens/AuthComponent';
import LogScreen from './Screens/LogScreen';

import { firebase } from './config';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='Detail' component={Detail} />
            <Stack.Screen name='Create' component={Create} />
            <Stack.Screen name='LogScreen' component={LogScreen} />
          </>
        ) : (
          <Stack.Screen name='AuthComponent' component={AuthComponent} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}