import React ,{useState , useEffect} from 'react'
import {Text, View, StyleSheet,LogBox} from 'react-native'
import {Button, TextInput} from 'react-native-paper'
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { version } from '@babel/core';

export default function Register(props) {
     
    const [token,setToken]=useState("");

    const storeData = async (value) => {
        console.log("rah dkhal")
        try {
          await AsyncStorage.setItem('@storage_Key', value)
         
        } catch (e) {
          // saving error
        }
      }

      const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('@storage_Key')
          if(value !== null) {
            props.navigation.navigate("Home",{data:value})
          }
        } catch(e) {
          // error reading value
        }
      }
 
    const styles=StyleSheet.create(
        {
            TextInput:{
                padding:15,
                marginTop:200
               }
        });

    const Verifier=()=>{
        console.log(token)
        database()
  .ref(token+'/')
  .on('value', snapshot => {
      if (snapshot.val()!=null) 
      {  storeData(token)
          console.log('User data: ', snapshot.val().Allumer);
          props.navigation.navigate("Home",{data:token})
        }
      else console.log("Token Error ")
  });
    }

    useEffect(() => {
        getData();

          });
    
        
    return (
     <View>
         {LogBox.ignoreLogs(['Setting a timer'])}
        
         <TextInput
         style={styles.TextInput}
         label="Token"
         value={token}
         mode="outlined"
         onChangeText={text=>
            {
                setToken(text)
                console.log(text)
            }
            }
         >

         </TextInput>
         <Button
         onPress={()=>
            {
               Verifier();
            }}
         >
             Inscrir
         </Button>
     </View>
    )
   }

