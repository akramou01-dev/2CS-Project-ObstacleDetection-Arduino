import React ,{useState , useEffect} from 'react'
import { View,LogBox,BackHandler} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Progres(props) {

  
  var state=null;
  const [user,setUser]=useState();
   const [token,setToken]=useState();
   const [lang,setLang]=useState({
     lang:'',
     index:0
   })
  
   const getLang = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Lang')
      if(value !== null) {
      
         if (value=="fr" ) 
         {  
             state=value
             
           setLang({...lang,lang:value,index:0})
         
          }
         else setLang({...lang,lang:value,index:1 })
      }
      else {
       state=lang
      }
    } catch(e) {
     console.log(e)
    }
  }
   const getData = async () => {
     try {
       const value = await AsyncStorage.getItem('@storage_Key')
       if(value !== null) {
           
           setToken(value)
            getLang();
          
            if (state=='fr')
           props.navigation.navigate("HomeAveugle",{data:value,lang:{lang:state,index:0}})
           else  props.navigation.navigate("HomeAveugle",{data:value,lang:{lang:'en',index:1}})
           state=null
           setUser('')
           setLang(null)
           setToken(null)
       }
       else {
       
       }
     } catch(e) {
       // error reading value
     }
   }
  
 const getUser = async () => {
   
   try {
     
     const value = await AsyncStorage.getItem('@storage_User')
     
     if(value != null) {
       
       setUser(value)
       console.log(value)
       if (value=='deaf')
       { state=null
        setUser('')
           setLang(null)
           setToken(null)
        props.navigation.navigate('HomeDeaf') 
      // props.navigation.dispatch(resetAction); 
      
       }
       else if (value=='blind')
       {
         if (token!=null)
         {
           getLang()
        
          props.navigation.navigate('HomeAveugle',{data:token,lang:lang})
          
         }
         else {
          getData()  
         }
       }
       else {
        console.log(value)
        console.log('here1')
        props.navigation.navigate('Choose') 
   
       }
     
    
   } 
   else { 
           setUser('')
           setLang(null)
           setToken(null) 
           console.log('here2')
    props.navigation.navigate('Choose')
  state=null }
 }catch(e) {
    console.group(e)
   }}
   const backAction=()=>{
 
   BackHandler.exitApp()
   
  }
   useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
     getLang();
     getUser();
     getData();       
     
           },[]);
    return (

        <View>
         
        </View>
    )
}