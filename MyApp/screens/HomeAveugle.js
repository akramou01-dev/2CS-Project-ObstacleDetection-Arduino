import React ,{useState , useEffect } from 'react'
import {Text, View , Image, Pressable,Modal ,BackHandler, TouchableWithoutFeedback} from 'react-native'
import database from '@react-native-firebase/database';
import Tts from 'react-native-tts';
import homeBlindSyle from '../Styles/homeBlindStyle';
import {Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchSelector from 'react-native-switch-selector';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
const { width, height } = Dimensions.get('window');


export default function HomeAveugle(props,{navigation}) {
    var state=null;
    var aa=null;
    var ar=null;
    var ta=null;
    var tg=null;
    var change=true;
    const{data,lang} =props.route.params;
    state=props.route.params.lang;

    const [langage,setlangage]=useState(
      {
        langage:lang.lang,
        index:lang.index
      }
    )
    
    const [token,setToken]=useState(data);
    const [avancerAvant,setAvancerAvant]=useState("false");
    const [retourArriere,setRetourArriere]=useState("false");
    const [tournerDroite,setTournerDroite]=useState("false");
    const [tournerGauche,setTournerGauche]=useState("false");
    const[showPopup,setShowPopup]=useState(false);
    const [loading,setLoading]=useState(false)

    

  

    const getLang = async () => {
      
      try {
        
        const value = await AsyncStorage.getItem('@storage_Lang')
        
        if(value !== null) {
           if (value=="fr") {
             await setlangage({...langage,langage:"fr", index:0 })
             await stateS('fr',0)
             Tts.setDefaultLanguage('fr-FR')
        } 

          else {
              await setlangage({ ...langage, langage:"en",index:1}) 
              await stateS('en',1)
              Tts.setDefaultLanguage('en-IE')
            }
            
        }
       else {
          await setlangage({ ...langage,langage:state.lang, index:state.index }) 
          await stateS('en',1) 
          Tts.setDefaultLanguage('en-IE')
        }
      
      } 
     catch(e) {
       
      }
    }
    
    const storeLang= async (value) => {
       
      try {
  
        await AsyncStorage.setItem('@storage_Lang', value)
        
      } 
      catch (e) {
        // saving error
      }
    }

    const show=()=>{
        setShowPopup(true)
    }
    const close=()=>{
        getLang()
        setShowPopup(false)       
    }
    const renderOutsideTouchable=(onTouch)=>{
        const view =<View style={{flex:1,width:width}}/>
        if (!onTouch) return view
        return (
      <TouchableWithoutFeedback onPress={onTouch} style={{flex:1,width:width}}>
        {view}
        
      </TouchableWithoutFeedback>
        )
      }
      
     const logOut= async() => {
      await setLoading(true)
     
      try {
      await  setTimeout(() => {

        const onValueChange =  database()
              .ref(token+'/')
              .on('value', snapshot => {})
        delete  props.route.params.data 
        setLoading(false)
        BackHandler.exitApp()
        Tts.stop(); 
        close()  
        AsyncStorage.removeItem('@storage_Lang');    
        AsyncStorage.removeItem('@storage_User');   
        AsyncStorage.removeItem('@storage_Key');  
        AsyncStorage.clear()   
        database().ref(token+'/').off('value', onValueChange);
        }, 3000)
      
  
      
      } 
      catch (e) {
        console.log(e)
      }
    }
    const backAction=()=>{
      BackHandler.exitApp()
    }
     

    const stateS=(value,index)=>{
      state.lang=value
      state.index=index
    }
    const changeLangage= (value)=>{
     try {
      
      if (value=="en") 
      {
        database().ref(token+'/').update({ Langage:value, }).then(() => console.log('Data updated.'));
        
        setlangage({...langage,langage:"en",index:1});
        Tts.stop();
        storeLang(value);
        Tts.setDefaultLanguage('en-IE')
        stateS('en',1)
        
      }

      else  if (value=="fr") 
        {
          setlangage({...langage,langage:"fr",index:0})
          Tts.stop()
          storeLang(value)
          Tts.setDefaultLanguage('fr-FR')
          stateS('fr',0)
           database().ref(token+'/') .update({Langage:value,}).then(() => console.log('Data updated.'));
        }
      else {
          console.log("langage inconnu")
        }
      
    }
    catch (e) {console.log(e)}
}
 
        useEffect(() => {
          
           getLang()
           BackHandler.addEventListener("hardwareBackPress", backAction);  
           if (state.lang=="fr") Tts.setDefaultLanguage('fr-FR')
             else if(state.lang=="en")  Tts.setDefaultLanguage('en-IE') 
              
            const onValueChange =  database().ref(token+'/') .on('value', snapshot => {
              
                state.lang=snapshot.val().Langage
                setAvancerAvant(snapshot.val().FirebaseAction.AvancerAvant)
                setRetourArriere(snapshot.val().FirebaseAction.RetourArriere)
                setTournerDroite(snapshot.val().FirebaseAction.TournerDroite)
                setTournerGauche(snapshot.val().FirebaseAction.TournerGauche)
                if (tg!=null)
                {
                  if (     tg==snapshot.val().FirebaseAction.TournerGauche &&
                           ta==snapshot.val().FirebaseAction.TournerDroite&&
                           aa==snapshot.val().FirebaseAction.AvancerAvant&&
                           ar==snapshot.val().FirebaseAction.RetourArriere )
                           {
                            change=false
                           }
                           else {
                             change=true
                           }
                }
                 if(change==true) Tts.stop()
                 console.log("c'est la variable change",change)
                tg=snapshot.val().FirebaseAction.TournerGauche
                ta=snapshot.val().FirebaseAction.TournerDroite
                aa=snapshot.val().FirebaseAction.AvancerAvant
                ar=snapshot.val().FirebaseAction.RetourArriere     
                if (tg=="false" && ta=="false"&& aa=="false"&& ar=="false")
                {
                 if (state.lang=="fr") {
                    Tts.speak('Ne bouge pas ', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                 }
                 else {
                  Tts.speak('Stop ', {
                    androidParams: {
                      KEY_PARAM_PAN: 1,
                      KEY_PARAM_VOLUME: 1,
                     
                    },
                  });
                 }
                   
                }
                else if (tg=="true" && ta=="false" && aa=="false" && ar=="false")
                {
                  
                    
                  if (state.lang=="fr")  {
                    Tts.speak('Trouner à Gauche', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                    }
                    else {
                      
                      Tts.speak('Turn left', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                    }
                }
                else if (tg=="false"
                         && ta=="true"
                          && aa=="false" 
                          && ar=="false")
                {
                  if (state.lang=="fr") {
                    Tts.speak('Trouner à Droite', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                }
                 else {
                  Tts.speak('Turn Right', {
                    androidParams: {
                      KEY_PARAM_PAN: 1,
                      KEY_PARAM_VOLUME: 1,
                     
                    },
                  });
                 }              
              }
                else if (tg=="false"
                         && ta=="false"
                          && aa=="true" 
                          && ar=="false")
                {
                  if (state.lang=="fr"){
                    Tts.speak('Avancer en Avant ', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                  }
                  else {
                    Tts.speak('Move Forward ', {
                      androidParams: {
                        KEY_PARAM_PAN: 1,
                        KEY_PARAM_VOLUME: 1,
                       
                      },
                    });
                  }
                }
                else if (tg=="false"
                         && ta=="false"
                          && aa=="false" 
                          && ar=="true")
                { if (state.lang=="fr"){
                    Tts.speak('Revenir en Arrière', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                    }
                    else {
                      Tts.speak('Go Back', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                    }
                    
                }
                else if (tg=="true"
                         && ta=="true"
                          && aa=="false" 
                          && ar=="false")
                
                 { if (state.lang=="fr") 
                 {
                    Tts.speak('Trouner à Gauche ou bien à droite ', {
                          androidParams: {                      
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                          },
                          });
                        
                }
                else {
                  Tts.speak('Turn Left or Turn Right ', {
                    androidParams: {                      
                    KEY_PARAM_PAN: 1,
                    KEY_PARAM_VOLUME: 1,
                    },
                    });
                }
                }
                else if (tg=="true"
                         && ta=="false"
                          && aa=="true" 
                          && ar=="false")
                {
                  if (state.lang=="fr") 
                 {
                    Tts.speak('Trouner à Gauche ou bien Avancer en avant ', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                } 
                 else {
                  Tts.speak('Turn Left or Move Forward', {
                    androidParams: {
                      KEY_PARAM_PAN: 1,
                      KEY_PARAM_VOLUME: 1,
                     
                    },
                  });
                 }
              }
                else if (tg=="true"
                         && ta=="false"
                          && aa=="false" 
                          && ar=="true")
                {
                  if (state.lang=="fr") 
                 {
                    Tts.speak('Trouner à Gauche ou bien Revenir en arrière ', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                }
                 else {
                  Tts.speak('Turn Left or Go Back ', {
                    androidParams: {
                      KEY_PARAM_PAN: 1,
                      KEY_PARAM_VOLUME: 1,
                     
                    },
                  });
                 }
              }
                else if (tg=="false"
                         && ta=="true"
                          && aa=="true" 
                          && ar=="false")
                {
                  if (state.lang=="fr") 
                 {
                    Tts.speak('Trouner à Droite ou bien avancer en avant ', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                }
              else {  Tts.speak('Turn Right or Move Forward', {
                  androidParams: {
                    KEY_PARAM_PAN: 1,
                    KEY_PARAM_VOLUME: 1,
                   
                  },
                });}
              }
                else if (tg=="false"
                         && ta=="true"
                          && aa=="false" 
                          && ar=="true")
                {
                  if (state.lang=="fr") 
                 {
                    Tts.speak('Trouner à Droite ou bien revenir en arrière ', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                    }
                    else {
                      Tts.speak('Turn Right or Go Back', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                    }
                }
                else if (tg=="false"
                && ta=="false"
                 && aa=="true" 
                 && ar=="true")
                {
                  if (state.lang=="fr") 
                  {
                     Tts.speak('avancer en avant ou bien revenir en arrière ', {
                     androidParams: {
                      KEY_PARAM_PAN: 1,
                     KEY_PARAM_VOLUME: 1,
                   },
                      });
                  }
                   else{
                    Tts.speak('Move Forward or Go Back', {
                      androidParams: {
                       KEY_PARAM_PAN: 1,
                      KEY_PARAM_VOLUME: 1,
                    },
                       });
                   }
                  }
     
               else if (tg=="false"
                        && ta=="true"
                        && aa=="true" 
                       && ar=="true")
                       { 
                         if (state.lang=="fr")
                         {
             
                         Tts.speak('Ne tourne pas à gauche ', {
                        androidParams: {
                       KEY_PARAM_PAN: 1,
                       KEY_PARAM_VOLUME: 1,},
                            });
                         
                         }
                        else {
                          Tts.speak("Don't Turn Left", {
                            androidParams: {
                           KEY_PARAM_PAN: 1,
                           KEY_PARAM_VOLUME: 1,},
                                });
                        }
                  }
         
                    else if (tg=="true"
                              && ta=="false"
                              && aa=="true" 
                             && ar=="true")
                             {
                              if (state.lang=="fr")
                              {
                             Tts.speak('Ne tourne pas à Droite ', {
                              androidParams: {
                               KEY_PARAM_PAN: 1,
                             KEY_PARAM_VOLUME: 1,
                            },
                           }); }
                           else {
                            Tts.speak("Don't Turn Right", {
                              androidParams: {
                               KEY_PARAM_PAN: 1,
                             KEY_PARAM_VOLUME: 1,
                            },
                           }); 
                           }
                              }
                     else if (tg=="true"
                    && ta=="true"
                    && aa=="false" 
                   && ar=="true")
                     {
                      if (state.lang=="fr")
                      {
                  Tts.speak("N'avance pas en avant", {
                  androidParams: {
                  KEY_PARAM_PAN: 1,
                   KEY_PARAM_VOLUME: 1,

                 },
                 });}
                 else {
                  Tts.speak("Don't Move Forward", {
                    androidParams: {
                    KEY_PARAM_PAN: 1,
                     KEY_PARAM_VOLUME: 1,
  
                   },
                   });
                 }
                 }
                  else if (tg=="true"
                   && ta=="true"
                   && aa=="true" 
                   && ar=="false")
                  {
                    if (state.lang=="fr")
                    {
                Tts.speak('Ne Reviens pas en arrière ', {
                androidParams: {
                 KEY_PARAM_PAN: 1,
                KEY_PARAM_VOLUME: 1,

              },
                 });
                   }
                   else {
                    Tts.speak("Don't Go Back", {
                      androidParams: {
                       KEY_PARAM_PAN: 1,
                      KEY_PARAM_VOLUME: 1,
      
                    },
                       });
                                    } 
                       }
            else { }
                  });
           const subscribe =props.navigation.addListener('focus',  () => {
          
          setTimeout(() => {
            setToken(props.route.params.data)
          }, 1000)
           })

           const unsubscribe = props.navigation.addListener('blur',  () => {
           logOut()
           database().ref(token+'/').off('value', onValueChange);  
          });
      
          return  () =>database().ref(token+'/').off('value', onValueChange);
  
        },[token]);

    return (
     <View style={homeBlindSyle.container}>
         
       
         <Modal
         animationType={'fade'}
         visible={showPopup}
         transparent={true}
         onRequestClose={close}
         
         >
   <OrientationLoadingOverlay
          visible={loading}
          color="white"
          indicatorSize="large"
          
          />       
           <View style={{flex:1,backgroundColor:'#000000AA',justifyContent:'flex-end'}}>
             {renderOutsideTouchable(close)}
             <View style={{backgroundColor:'#FFFFFF',
            width:width,
            borderTopRightRadius:20,
            borderTopLeftRadius:20,
            paddingHorizontal:10,
            maxHeight:height/2
            }}>
          
             {langage.langage!="fr"?(
              <View>
               <Text style={{fontSize:30,padding:15 , fontWeight:'bold' , color:'#2C2C2C'}}>
                Settings
               </Text>
               <View style={{flex:0,flexDirection:'column',marginTop:height*0.025 }}>
                 <View style={{flex:0,flexDirection:'row'}}>

                 <Image
                  source={require('../Icons/language.png')}
                  style={{height:height*0.034,width:width*0.07,marginRight:width*0.02,marginLeft:width*0.04} }/>
               <Text style={{fontSize:20, color:'#2C2C2C' , fontWeight:'bold'}}>
                  Language
                 </Text>
                 </View>
                 <View style={{minHeight: 50,Index: 999}}>
                 <SwitchSelector options={[
                   {label:'Frensh',value:"fr"},
                   {
                     label:'English',value:"en"
                   }
                 ]} initial={langage.index} onPress={value => {
                
                    changeLangage(value)
              
                 }}
                 buttonColor='#45869C'
                 style={{marginTop:height*0.03,marginBottom:height*0.03}}
                  />
                
            </View>

                
               </View>
               <Pressable style={{flex:0,flexDirection:'row',marginBottom:height*0.03}}onPress={()=>{
               (async () => {
                await logOut();
            })();
              }}>
                <Image
                  source={require('../Icons/logout.png')}
                  style={{height:height*0.035,width:width*0.07,marginRight:width*0.02,marginLeft:width*0.04} }/>
               <Text style={{fontSize:20, color:'#2C2C2C' , fontWeight:'bold'}}>
                 
                 Signout
               </Text>
               </Pressable>
           </View>
             ):
             (
                <View>
               <Text style={{fontSize:30,padding:15 , fontWeight:'bold' , color:'#2C2C2C'}}>
                Paramètres
               </Text>
               <View style={{flex:0,flexDirection:'column',marginTop:height*0.025 }}>
                 <View style={{flex:0,flexDirection:'row'}}>

                 <Image
                  source={require('../Icons/language.png')}
                  style={{height:height*0.035,width:width*0.07,marginRight:width*0.02,marginLeft:width*0.04} }/>
               <Text style={{fontSize:20, color:'#2C2C2C' , fontWeight:'bold'}}>
                  Langage 
                 </Text>
                 </View>
                 <SwitchSelector options={[
                   {label:'Français',value:"fr"},
                   {
                     label:'Anglais',value:"en"
                   }
                 ]} initial={langage.index} onPress={value => {
                
                     changeLangage(value)
               
                
                 
                 }
                 }
                 buttonColor='#45869C'
                 style={{marginTop:height*0.03,marginBottom:height*0.03}}
                 />
                 <View >
               
                
            </View>

                
               </View>
               <Pressable style={{flex:0,flexDirection:'row',marginBottom:height*0.03}} onPress={()=>{
               (async () => {
                await logOut();
            })();
              }}>
                <Image
                  source={require('../Icons/logout.png')}
                  style={{height:height*0.034,width:width*0.07,marginRight:width*0.02,marginLeft:width*0.04} }/>
               <Text style={{fontSize:20, color:'#2C2C2C' , fontWeight:'bold'}}>
                Déconnexion
               </Text>
               </Pressable>
           </View>
             )} 
            
           
             </View>
           </View>
        
        </Modal>
        
        <View style={homeBlindSyle.menu}>
          <View style={homeBlindSyle.Vlogo}><Text style={homeBlindSyle.logo}> LOGO</Text></View>
        <Pressable onPress={()=>show()}>
        <Image
         source={require('../Icons/settings.png')}
         style={homeBlindSyle.setting}
         /> 
          </Pressable>
          </View>

        <View style={homeBlindSyle.fleches}>

         {avancerAvant=="false"?(<Image
         source={require('../Icons/HNormal.png')}
         style={homeBlindSyle.haut}
         /> ):(<Image
          source={require('../Icons/Hbold.png')}
          style={homeBlindSyle.haut}
          /> )}
         
         <View style={homeBlindSyle.flechesRow}>
           {tournerGauche=="false"?(<Image
         source={require('../Icons/GNormal.png')}
         style={homeBlindSyle.gauche}
         /> ):(
          <Image
          source={require('../Icons/Gbold.png')}
          style={homeBlindSyle.gauche}
          /> 
         )}
         {tournerDroite=="false"?(<Image
         source={require('../Icons/DNormal.png')}
         style={homeBlindSyle.droit}
         /> ):(
          <Image
          source={require('../Icons/Dbold.png')}
          style={homeBlindSyle.droit}
          />
         )}
              
         </View>
         {
           retourArriere=="false"?( <Image
         source={require('../Icons/BNormal.png')}
         style={homeBlindSyle.bas}
         /> ):(
          <Image
          source={require('../Icons/Bbold.png')}
          style={homeBlindSyle.bas}
          />
         )
         }
        
        </View>
        <Image
        source={require('../Icons/B.png')}
        style={homeBlindSyle.baff}
        />
       
     </View>
    )
   }

