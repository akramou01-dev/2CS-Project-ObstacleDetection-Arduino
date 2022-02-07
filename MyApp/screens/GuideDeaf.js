import React  from 'react';
import {Text , View,Image, Pressable} from 'react-native';
import guideDeafStyle from '../Styles/guideDeafStyle'
import CameraRoll from "@react-native-community/cameraroll";
const GuideDeaf=(props)=>{

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
  
return (
    <View style={guideDeafStyle.container}>
       
        <Text style={guideDeafStyle.text1D}>
         EVERY ONE UNDERSTAND
         </Text>
         <Image
         source={require('../Icons/deaf.png')}
         style={guideDeafStyle.deafIcon}
         /> 
         <Text style={guideDeafStyle.text2D}>
         DEAF
         </Text>
         <Text style={guideDeafStyle.description}>
         
Our app is your partner to talk freely
Record your video and be part of the community{"\n"}
               
         </Text>
        
      <Pressable
      onPress={()=>
        {
           var tab =getVideos()
           props.navigation.navigate('HomeDeaf',{data:tab})
        }
       }
    
      >
 <Image
         source={require('../Icons/next.png')}
         style={guideDeafStyle.next}
         /> 
      </Pressable>
    </View>
)
}
export default GuideDeaf;