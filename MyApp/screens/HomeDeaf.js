'use strict';
import React ,{useState,useEffect , }from 'react';
import { View,SafeAreaView, BackHandler,Text, Pressable,LogBox, PermissionsAndroid,Image,FlatList } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from "@react-native-community/cameraroll";
import homeDeafStyle from '../Styles/homeDeafStyle';
import Video from 'react-native-video';
import {Dimensions  } from 'react-native';
const { width, height } = Dimensions.get('window');
const HomeDeaf=(props)=>{


  const getVideos= () => {
    CameraRoll.getPhotos({
        first: 1000,
        assetType: 'Videos',
         groupName:'MyApp'
      })
      .then(r => {
      setVideos(r.edges) 
    
      })
      .catch((err) => {
         //Error Loading Images
      });
    };
  


const [storagePermission,setStoragePermission]=useState(false)
const [videos,setVideos]=useState(getVideos)
const [player,setPlayer]=useState(null)


const checkStoragePermission=()=>{
  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((isPermetted)=>{
  if(isPermetted)
      setStoragePermission(true)
  
  else {
     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,{message:'Please Give Access To Save Video',title:'Storage Permission'})
     .then((data)=>{
       setStoragePermission(true)
     })
  }
})
  
}


const onPressButton=()=>{
  console.log("pressed")
  if (!storagePermission) checkStoragePermission()
  else {
   
    ImageCropPicker.openPicker({includeBase64:true,mediaType:'video'})
    .then((video)=>{
      console.log(video.path)
      const splittedArray=video.path.split('/')
      const fileName=splittedArray[splittedArray.length-1]
      props.navigation.navigate("UploadVideo",{data:video.path})
  })
    .catch(e=>{
  console.log(e)
       })
      }

}
const saveVideo=(filePath)=>{
  
     const folderPath='/storage/emulated/0/MyApp';
     RNFetchBlob.fs.isDir(folderPath).then((isDir)=>{
       if (isDir)
       {
         
        CameraRoll.save(filePath,{album:'MyApp'})
       }
       else 
       {
         RNFetchBlob.fs.mkdir(folderPath).then(()=>{
          CameraRoll.save(filePath,{album:'MyApp'})
         })
         .catch(e=>{
           console.log(e)
         })
       }
       getVideos()
     })
}
const GoToVideo=async()=>{
  await props.navigation.navigate("RecordVideo")
}
//

useEffect(() => {
  
  checkStoragePermission()
  getVideos()

 
  },[])

    return (
      < SafeAreaView style={homeDeafStyle.container}  >
           {LogBox.ignoreLogs(['Setting a timer'])}
          <View  style={homeDeafStyle.textV}><Text style={homeDeafStyle.text}> All Videos </Text></View>
          <FlatList
        data={videos}
        style={{marginLeft:20}}
        renderItem={({item}) => (
          
          <View
            style={{
              flex: 1,
              flexDirection: 'column',  
              width:width*0.2,
              height:height*0.2,
              marginBottom:10
            }}>
            <Pressable onPress={()=>{props.navigation.navigate("UploadVideo",{data:item.node.image.uri})}} >
            <Video
              source={{uri:item.node.image.uri}}
              naturalSize={{ width:width*0.2,height:height*0.2}}
              posterResizeMode={'contain'}
              style={homeDeafStyle.video}
              muted={true}
              repeat={true}
              resizeMode={'contain'}
              ref={(ref) => {
                setPlayer(ref)
              }}
              
            />
            </Pressable>
          </View>
        )}
        //Setting the number of column
        numColumns={4}
        keyExtractor={(item, index) => index}
      />
        <View style={homeDeafStyle.ButtonsView}>
              <Pressable onPress={onPressButton} >
              <Image  style={homeDeafStyle.upload}  source=  {require('../Icons/up.png')} />
              </Pressable>
              <Image style={homeDeafStyle.separateur} source={require('../Icons/line.png')} />
              <Pressable onPress={GoToVideo} >
              <Image style={homeDeafStyle.camera} source={require('../Icons/a.png')} />
              </Pressable>
              
          </View>
      </SafeAreaView>
    );
}



export default HomeDeaf;

