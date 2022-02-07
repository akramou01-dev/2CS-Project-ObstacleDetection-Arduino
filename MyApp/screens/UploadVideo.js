'use strict';
import React, { useState} from 'react';
import {View,Text, Pressable,LogBox, SafeAreaView,ScrollView, Image,Modal} from 'react-native';
import uploadVideoStyle from '../Styles/uploadVideoStyle';
import Video from 'react-native-video';
import {Dimensions  } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
const { width, height } = Dimensions.get('window');
const UploadVideo=(props)=>{

    const uri=props.route.params.data;
    const [text,setText]=useState()
    const [modalVisible, setModalVisible] = useState(false);
    const [loading,setLoading]=useState(false)



   const  postVideo = (videoUri) =>  {
    setLoading(true)
    const url="http://192.168.1.103:5000/"
    const splittedArray=videoUri.split('/')
    const fileName=splittedArray[splittedArray.length-1]
    console.log(fileName)
    RNFetchBlob.fetch('POST',url, {
           'content-type': 'multipart/form-data',
           "Accept":"multipart/form-data",
          //  'access-token': AuthToken.token, //token from server
        },[
         //the value of name depends on the key from server 
          { type: 'video/mp4',name: 'video', filename: fileName, data: RNFetchBlob.wrap(videoUri) },
        ]).then(response =>
          {
            setLoading(false)
            console.log(response.json())
            setText(response.json().text)
            saveVideo()
            setModalVisible(true)
            
          } )
          
           .catch((err) => {
              console.log(err)
              setText("Error to communicate with the server \n Try again")
              setModalVisible(true)
              setLoading(false)
          })

      console.log('waiting..')
 

        }


  const close=()=>{
  setModalVisible(false)
   }
  const saveVideo=()=>{
  
     const folderPath='/storage/emulated/0/MyApp';
     const splittedArray=uri.split('/')
     const filePath=folderPath+'/'+splittedArray[splittedArray.length-1]
     RNFetchBlob.fs.isDir(folderPath).then((isDir)=>{
       if (isDir)
       {
        RNFetchBlob.fs.exists(filePath).then().catch(
         CameraRoll.save(uri,{album:'MyApp'})) 
       }
       else 
       {
         RNFetchBlob.fs.mkdir(folderPath).then(()=>{
    
          CameraRoll.save(uri,{album:'MyApp'})
         })
         .catch(e=>{
           console.log(e)
         })
       }
     })
}
 return (
      <SafeAreaView style={uploadVideoStyle.container}>
           {LogBox.ignoreLogs(['Setting a timer'])}
           <OrientationLoadingOverlay
          visible={loading}
          color="white"
          indicatorSize="large"
          messageFontSize={20}
          message="Your video is being processing ..."
          />      
           <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
         <View style={uploadVideoStyle.centeredView}>
          <View style={uploadVideoStyle.modalView}>
            <Pressable onPress={()=>close()}style={uploadVideoStyle.deleteView}>
            <Image 
              source={require('../Icons/delete.png')}
              style={uploadVideoStyle.delete}
              />

            </Pressable>
            <Text style={uploadVideoStyle.modalText}>
            {text}
              </Text>
         
          </View>
        </View>
    
        </Modal>
           <ScrollView>
           <View style={uploadVideoStyle.Vlogo}><Text style={uploadVideoStyle.logo}> LOGO</Text></View>
           <View style={uploadVideoStyle.video}>
           <Video       
              source={{uri:uri}}
              muted={true}
              repeat={true}
              style={{height:height*0.7}}
              posterResizeMode={'contain'}
              resizeMode={'contain'}
              
            />
          </View>
          
          </ScrollView> 
         
            <Pressable style={uploadVideoStyle.ButtonsView} onPress={()=>postVideo(uri)}>
              <Image 
              source={require('../Icons/send.png')}
              style={uploadVideoStyle.sendIcon}
              />
            </Pressable>
       
    </SafeAreaView>
    );
}




export default UploadVideo;

