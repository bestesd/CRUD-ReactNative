import{ NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Screens/Home';
import Detail from './Screens/Detail';
import Create from './Screens/Create';
import AuthComponent from './Screens/AuthComponent';
import LogScreen from './Screens/LogScreen';

const Stack = createStackNavigator ();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
       <Stack.Screen
         name= 'Home'
         component= {Home }
       /> 
       <Stack.Screen
         name='Detail'
         component={Detail}
       />
       <Stack.Screen
         name='Create'
         component={Create}
       />
       <Stack.Screen
         name='AuthComponent'
         component={AuthComponent}
       />
        <Stack.Screen
         name='LogScreen'
         component={LogScreen}
       />
     </Stack.Navigator>
    </NavigationContainer>
)
} 
