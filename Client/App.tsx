/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';


import SignUp from './screens/SignUp';
import Login from './screens/Login';
import NewBooking from './screens/NewBooking';
import PrevBooking from './screens/PrevBooking';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarView from './screens/calenderView';
import TimeLineview from './screens/timelineView';
import SplashScreen from './screens/SplashScreen';
import { Provider } from 'react-redux';
import store from './store/store';


const App: React.FC=()=> {
  const Stack = createNativeStackNavigator();
  return (
  <Provider store={store}>

    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen'>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
         <Stack.Screen name="Calendar" component={CalendarView} options={{headerShown:false}}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name="prevBooking" component={PrevBooking} options={{headerShown:false}}/>
        <Stack.Screen name="newBooking"  component={NewBooking} options={{headerShown:false}}/>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    
   </Provider>
  );
}


export default App;

