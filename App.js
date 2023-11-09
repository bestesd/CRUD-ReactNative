import{ NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Screens/Home';
import Detail from './Screens/Detail';
import Create from './Screens/Create';

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
     </Stack.Navigator>
    </NavigationContainer>
)
} 
