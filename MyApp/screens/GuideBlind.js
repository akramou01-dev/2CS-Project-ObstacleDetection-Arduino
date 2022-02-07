import React ,{useState,useEffect} from 'react';
import {View,SafeAreaView,ScrollView,Image,Text,Dimensions ,LogBox,TextInput,Pressable, Feather} from 'react-native';
import guideBlindStyle from '../Styles/guideBlindStyle';
import registerStyle from '../Styles/registerStyle';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import * as Animatable from 'react-native-animatable';
const GuideBlind=({navigation})=>{
  const { width, height } = Dimensions.get('window');
 
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  
  const setSliderPage = (event) => {
    const { currentPage } = sliderState;
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  const { currentPage: pageIndex } = sliderState;
  const [inputStyle,setInputStype]=useState(registerStyle.input)
  const [loading,setLoading]=useState(false)


  const [token,setToken]=useState(
    {
      token:'',
      check:false,
      isValid:true
    }
  );
  const TextInputChange=(val)=>
  {
    if (val.length<5)
    {
      setToken(
        {
          ...token,
          token:val,
          check:true,
          isValid:true
        }
      )
    }
    else {
      setToken(
        {
          ...token,
          token:val,
          check:false,
          isValid:true
        }
      )
    }
  }
  const storeData = async (value) => {

      try {
        await AsyncStorage.setItem('@storage_Key', value)
       
      } catch (e) {
        console.log("souhila kayan erreur")
      }
    }

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@storage_Key')
        if(value !== null) {
          
          navigation.navigate("HomeAveugle",{data:token.token,lang:{
            lang:'en',
            index:1
          }})
        }
      } catch(e) {
        // error reading value
      }
    }

    const storeUser = async (value) => {

      try {
        await AsyncStorage.setItem('@storage_User', value)
        setUser(value)
      } 
      catch (e) {
        // saving error
      }
    }
    const storeLang =async(value)=>{
      try {
        await AsyncStorage.setItem('@storage_Lang',value)
      
      } 
      catch (e) {
        // saving error
      }
    }

  const Verifier= ()=>{
    setLoading(true)
   if (token.check==false)
   {
    database()
   .ref(token.token+'/')
   .on('value', snapshot => {
    if (snapshot.val()!=null) 
    { storeUser("blind")    
      storeData(token.token)
      storeLang(snapshot.val().Langage)
      setInterval(() => {
      setLoading(false)
      console.log("etape vérifé",snapshot.val().Langage)
     if(snapshot.val().Langage=="fr") 
     {
       navigation.navigate("HomeAveugle",{data:token.token,lang:{
        lang:'fr',
        index:0
      }})
     }
     else if(snapshot.val().Langage=="en")  {
      navigation.navigate("HomeAveugle",{data:token.token,lang:{
        lang:'en',
        index:1
      }})
     }
      
      
      
      }, 500);
      
      }
    else{
      setInterval(() => {
        setLoading(false)
        
      }, 500);
      setToken({
       ...token,
       isValid:false //ce token n'existe pas
      })
    }
  
});

  }
  }
  useEffect(() => {
      getData();
        });




    return (
        <SafeAreaView style={{ flex: 1 }}>
            {LogBox.ignoreLogs(['Setting a timer'])}
             <ScrollView
          style={{ flex: 1 }}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            setSliderPage(event);
          }}
        >
            <View style={guideBlindStyle.page1}>
            <Text style={guideBlindStyle.description}>
             This Application works with Electric Arm {"\n"}
               Every User Has Its Token {"\n"}
            On His Arm {"\n"}
         </Text>
            <Text style={guideBlindStyle.text2B}>BLIND</Text>
          
          <Image style={guideBlindStyle.blindIcon}
          source=  {require('../Icons/blind.png')}       
          />
          <Text style={guideBlindStyle.text1B}>LIFE IS EASIER </Text>
            </View>

            <View style={registerStyle.container}>
         {LogBox.ignoreLogs(['Setting a timer'])}
        <Text style={registerStyle.description}>
        Please Enter The Token  {"\n"}
        Located In Your {"\n"}
        Electric Arm{"\n"}
        </Text>
         <TextInput
         style={inputStyle}
         placeholder="Enter Token"
         value={token.token}
         onPressOut={(text)=>{}}
         onFocus={()=>setInputStype(registerStyle.inputFocus)}
         onBlur={()=>setInputStype(registerStyle.input)}
         mode="outlined"
         onChangeText={text=>
            {
                setToken({
                  ...token,
                  token:text
                })
                TextInputChange(text)
               
            }
            }
        />
          
        {token.check?(
         <Animatable.View animation='fadeInLeft' duration={500}>
         <Text style={guideBlindStyle.errorMsg}>Token must be 5 characters long</Text>
        </Animatable.View>
        ):null}
        {token.isValid?null:(
           <Animatable.View animation='fadeInLeft' duration={500}>
           <Text style={guideBlindStyle.errorMsg}>Token is incorrect </Text>
          </Animatable.View>
        )}
      
         <OrientationLoadingOverlay
          visible={loading}
          color="white"
          indicatorSize="large"
          
          />       
                
         <Pressable style={registerStyle.sub}
         onPress={()=>
            {
              if (!token.check){
                 setLoading(true) 
                  Verifier();
                 
        
              }
             
            }}
         >
           
            <Text style={registerStyle.subText}> 
              Submit
            </Text>
         </Pressable>
     </View>
            </ScrollView>
            <View style={guideBlindStyle.paginationWrapper}>
          {Array.from(Array(2).keys()).map((key, index) => 
   (
            <View style={[guideBlindStyle.paginationDots, { opacity: pageIndex == index ? 1 : 0.2 }]} key={index} >
              
            </View>
          ))}
        </View>
            </SafeAreaView>
    )
}
export default GuideBlind