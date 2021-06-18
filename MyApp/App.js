/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Register from './screens/Register';
import Home from './screens/Home';

import {
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';



 const Stack=createStackNavigator()

const MyStyles ={
  headerTintColor:"white",
  headerStyle:{
    backgroundColor:"green"
  },
  title:"Register",
 
}
const App= () => {
  const isDarkMode = useColorScheme() === 'dark';
  


  

  return (
    <View style={styles.sectionContainer}>
    <Stack.Navigator>
      <Stack.Screen name="Register" component= {Register}
      options={MyStyles}
      />
       <Stack.Screen name="Home" component= {Home}
        options={{...MyStyles,title:"Home"}}
      />
      
    </Stack.Navigator>
    
    </View>
  );
};

export default ()=>{
 return (
   <NavigationContainer>
     <App/>
   </NavigationContainer>
 )
}
const styles = StyleSheet.create({
  sectionContainer: {
    flex:1
    
  },
  
  
});

