'use strict';
import React, { useState,useRef, useEffect } from 'react';
import { View,Text, Pressable,LogBox,Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import recordVideoStyle from '../Styles/recordVideoStyle';
const RecordVideo=(props)=>{

  const camera = useRef(null);

  const [ButtonState,setButtonState]=useState('Enregistrer')
  const[url,setUrl]=useState()
  
  const [second, setSecond] = useState('00');
  const [minute, setMinute] = useState('00');
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(1);
 

  useEffect(() => {
    
    let intervalId;
  
    if (isActive) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);
  
        const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}`: secondCounter;
        const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}`: minuteCounter;
  
        setSecond(computedSecond);
        setMinute(computedMinute);
  
        setCounter(counter => counter + 1);
      }, 1000)
    }
  
    return () => clearInterval(intervalId);
  }, [isActive, counter])
  
  
  const RenderCam=()=>{
    return <RNCamera
    ref={camera}
   style={recordVideoStyle.preview}
   defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
   type={RNCamera.Constants.Type.front}
   flashMode={RNCamera.Constants.FlashMode.on}
   androidCameraPermissionOptions={{
     title: 'Permission to use camera',
     message: 'We need your permission to use your camera',
     buttonPositive: 'Ok',
     buttonNegative: 'Cancel',
   }}
   androidRecordAudioPermissionOptions={{
     title: 'Permission to use audio recording',
     message: 'We need your permission to use your audio',
     buttonPositive: 'Ok',
     buttonNegative: 'Cancel',
   }}
  />
  }
  
  const RecordVideo=async()=>{
    if(camera){
       
   const { uri, codec = "mp4" } = await camera.current.recordAsync();
      setUrl(uri)
      console.info(uri);
      props.navigation.navigate("UploadVideo",{data:uri})
     
    }
  }
  
  
  const Stop=()=>{
     camera.current.stopRecording();
  }
  const  onPressButton=() =>{
    if (ButtonState=='Enregistrer') 
    { setIsActive(true)
      setButtonState("Stopper")
      RecordVideo()
      
    }
    else if (ButtonState=='Stopper') {
      setIsActive(false);
      setCounter(0);
      setSecond('00');
      setMinute('00')
      setButtonState('Enregistrer')
      Stop()
    
      
    }
   
    
   
  }
      return (
        <View style={recordVideoStyle.container}>
             {LogBox.ignoreLogs(['Setting a timer'])}
             
          <View style={{height:'100%' , width:'100%'}}>
               {RenderCam()}
          </View>
         
    <View style={recordVideoStyle.capture}>
         
            {ButtonState=='Enregistrer'?(
             <Pressable onPress={onPressButton}  >
            <Image
            style={recordVideoStyle.start}
            source={require('../Icons/rr.png')}
            />
             </Pressable>
            ):
            ( <Pressable onPress={onPressButton}  >
              <Image             
              source={require('../Icons/ss.png')}
              style={recordVideoStyle.start}
              />
              </Pressable>
            )}
      
           </View>
          {isActive?(<Text style={recordVideoStyle.compteur}>{minute}:{second}</Text>):<Text style={recordVideoStyle.compteur}></Text>}
           
        
          
        </View>
      );
  }
  
  
export default RecordVideo;

