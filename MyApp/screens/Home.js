import React ,{useState , useEffect} from 'react'
import {Text, View, StyleSheet,LogBox, } from 'react-native'
import database from '@react-native-firebase/database';
import Tts from 'react-native-tts';

export default function Home(props) {
    const data=props.route.params.data;
    const [token,setToken]=useState(data);
    const [allumer,setAllumer]=useState();
    const [avancerAvant,setAvancerAvant]=useState(false);
    const [retourArriere,setRetourArriere]=useState(false);
    const [tournerDroite,setTournerDroite]=useState(false);
    const [tournerGauche,setTournerGauche]=useState(false);


    const styles=StyleSheet.create(
        {
            Text:{
                padding:15,
                margin:14,
                textAlignVertical:'center',
                fontSize:25
               },

        });

        useEffect(() => {
            const onValueChange = database()
              .ref(token+'/')
              .on('value', snapshot => {
                console.log('User data: ', snapshot.val());
              
                setAllumer(snapshot.val().Allumer);
                setAvancerAvant(snapshot.val().FirebaseAction.AvancerAvant)
                setRetourArriere(snapshot.val().FirebaseAction.RetourArriere)
                setTournerDroite(snapshot.val().FirebaseAction.TournerDroite)
                setTournerGauche(snapshot.val().FirebaseAction.TournerGauche)
                if (snapshot.val().FirebaseAction.TournerGauche=="false"
                 && snapshot.val().FirebaseAction.TournerDroite=="false"
                  && snapshot.val().FirebaseAction.AvancerAvant=="false"
                   && snapshot.val().FirebaseAction.RetourArriere=="false")
                {
                    Tts.speak('Ne bouge pas ', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                }
                else if (snapshot.val().FirebaseAction.TournerGauche=="true"
                         && snapshot.val().FirebaseAction.TournerDroite=="false"
                          && snapshot.val().FirebaseAction.AvancerAvant=="false" 
                          && snapshot.val().FirebaseAction.RetourArriere=="false")
                {
                    Tts.speak('Trouner à Gauche', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                }
                else if (snapshot.val().FirebaseAction.TournerGauche=="false"
                         && snapshot.val().FirebaseAction.TournerDroite=="true"
                          && snapshot.val().FirebaseAction.AvancerAvant=="false" 
                          && snapshot.val().FirebaseAction.RetourArriere=="false")
                {
                    Tts.speak('Trouner à Droite', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                }
                else if (snapshot.val().FirebaseAction.TournerGauche=="false"
                         && snapshot.val().FirebaseAction.TournerDroite=="false"
                          && snapshot.val().FirebaseAction.AvancerAvant=="true" 
                          && snapshot.val().FirebaseAction.RetourArriere=="false")
                {
                    Tts.speak('Avancer en Avant ', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                }
                else if (snapshot.val().FirebaseAction.TournerGauche=="false"
                         && snapshot.val().FirebaseAction.TournerDroite=="false"
                          && snapshot.val().FirebaseAction.AvancerAvant=="false" 
                          && snapshot.val().FirebaseAction.RetourArriere=="true")
                {
                    Tts.speak('Revenir en Arrière', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                }
                else if (snapshot.val().FirebaseAction.TournerGauche=="true"
                         && snapshot.val().FirebaseAction.TournerDroite=="true"
                          && snapshot.val().FirebaseAction.AvancerAvant=="false" 
                          && snapshot.val().FirebaseAction.RetourArriere=="false")
                {
                    Tts.speak('Trouner à Gauche ou bien à droite ', {
                        androidParams: {
                          KEY_PARAM_PAN: 1,
                          KEY_PARAM_VOLUME: 1,
                         
                        },
                      });
                }
                

              });
        
            // Stop listening for updates when no longer required
            return () => database().ref(token+'/').off('value', onValueChange);
          }, []);

    return (
     <View style={{marginTop:100}}>
         {LogBox.ignoreLogs(['Setting a timer'])}
        
         <Text style={styles.Text}>
            Avancer Avant : {avancerAvant}
         </Text>
         <Text style={styles.Text}>
            Retour en Arrière  : {retourArriere}
         </Text>
         <Text style={styles.Text}>
           Touner à droite  : {tournerDroite}
         </Text>
         <Text style={styles.Text}>
           Touner à Gauche  : {tournerGauche}
         </Text>
     </View>
    )
   }

