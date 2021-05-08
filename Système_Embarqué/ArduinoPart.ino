/*
   Created by Pi BOTS MakerHub

   Email: pibotsmakerhub@gmail.com

   Github: https://github.com/pibotsmakerhub

   Copyright (c) 2020 Pi BOTS MakerHub
*/


//FirebaseESP8266.h must be included before ESP8266WiFi.h
#include "FirebaseESP8266.h"  // Install Firebase ESP8266 library
#include <ESP8266WiFi.h>
#include <DHT.h>    // Install DHT11 Library and Adafruit Unified Sensor Library


#define FIREBASE_HOST "projet2cs-4ea6d-default-rtdb.firebaseio.com" //Without http:// or https:// schemes
#define FIREBASE_AUTH "m1cYJ3G4UpAHVlaJewKjyKjCxkwBCH5FKlcAMdc0"
#define WIFI_SSID "Souhila"
#define WIFI_PASSWORD "0657012907"

  //gauche
const int trigPinG = 2;  //D4
const int echoPinG = 0;  //D3
//droite
const int trigPinD = 14;  //D5
const int echoPinD = 12;  //D6
//Avant
const int trigPinAV = 13;  //D7
const int echoPinAV = 15;  //D8
  //Arrière
const int trigPinAR = 5;  //D1
const int echoPinAR= 4;  //D2

long durationG;
int distanceG;

long durationD;
int distanceD;

long durationAV;
int distanceAV;

long durationAR;
int distanceAR;

boolean Tourner_Gauche=false;

boolean Tourner_Droite=false;

boolean Avancer_avant=false;

boolean retour=false;

//Define FirebaseESP8266 data object
FirebaseData firebaseData;
FirebaseData ledData;

FirebaseJson json;


void setup()
{

  Serial.begin(115200);
  pinMode(trigPinG, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPinG, INPUT); // Sets the echoPin as an Input

  pinMode(trigPinD, OUTPUT); // Sets the trigPin as an Output
pinMode(echoPinD, INPUT); // Sets the echoPin as an Input

pinMode(trigPinAV, OUTPUT); // Sets the trigPin as an Output
pinMode(echoPinAV, INPUT); // Sets the echoPin as an Input


  pinMode(trigPinAR, OUTPUT); // Sets the trigPin as an Output
pinMode(echoPinAR, INPUT); // Sets the echoPin as an Input


  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

}

void loop() {
  sensorUpdate();
  GesteUpdate();

  delay(2000);
}




void sensorUpdate(){
  //GAUCHE
digitalWrite(trigPinG, LOW);
delayMicroseconds(2);
digitalWrite(trigPinG, HIGH);
delayMicroseconds(10);
digitalWrite(trigPinG, LOW);
durationG = pulseIn(echoPinG, HIGH);

// Calculating the distance
distanceG= durationG*0.034/2;
/******************************/

  //DROITE
digitalWrite(trigPinD, LOW);
delayMicroseconds(2);
digitalWrite(trigPinD, HIGH);
delayMicroseconds(10);
digitalWrite(trigPinD, LOW);
durationD = pulseIn(echoPinD, HIGH);

// Calculating the distance
distanceD= durationD*0.034/2;
/******************************/


  //AVANT
digitalWrite(trigPinAV, LOW);
delayMicroseconds(2);
digitalWrite(trigPinAV, HIGH);
delayMicroseconds(10);
digitalWrite(trigPinAV, LOW);
durationAV = pulseIn(echoPinAV, HIGH);

// Calculating the distance
distanceAV= durationAV*0.034/2;
/******************************/
  //Arrière
digitalWrite(trigPinAR, LOW);
delayMicroseconds(2);
digitalWrite(trigPinAR, HIGH);
delayMicroseconds(10);
digitalWrite(trigPinAR, LOW);
durationAR = pulseIn(echoPinAR, HIGH);

// Calculating the distance
distanceAR= durationAR*0.034/2;
/******************************/



  Serial.print(F("Distance à gauche: "));
  Serial.println(distanceG);
  Serial.print(F("Distance à droite: "));
  Serial.println(distanceD);
  Serial.print(F("Distance en avant : "));
  Serial.println(distanceAV);
    Serial.print(F("Distance en arrière : "));
  Serial.println(distanceAR);
 

  if (Firebase.setFloat(firebaseData, "/FirebaseIOT/distanceGauche", distanceG))
  {
    Serial.println("PASSED");
    Serial.println("PATH: " + firebaseData.dataPath());
    Serial.println("TYPE: " + firebaseData.dataType());
    Serial.println("ETag: " + firebaseData.ETag());
    Serial.println("------------------------------------");
    Serial.println();
  }
  else
  {
    Serial.println("FAILED");
    Serial.println("REASON: " + firebaseData.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }

  if (Firebase.setFloat(firebaseData, "/FirebaseIOT/distanceDroite",distanceD))
  {
    Serial.println("PASSED");
    Serial.println("PATH: " + firebaseData.dataPath());
    Serial.println("TYPE: " + firebaseData.dataType());
    Serial.println("ETag: " + firebaseData.ETag());
    Serial.println("------------------------------------");
    Serial.println();
  }
  else
  {
    Serial.println("FAILED");
    Serial.println("REASON: " + firebaseData.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }
  
  if (Firebase.setFloat(firebaseData, "/FirebaseIOT/distanceAvant", distanceAV))
  {
    Serial.println("PASSED");
    Serial.println("PATH: " + firebaseData.dataPath());
    Serial.println("TYPE: " + firebaseData.dataType());
    Serial.println("ETag: " + firebaseData.ETag());
    Serial.println("------------------------------------");
    Serial.println();
  }
  else
  {
    Serial.println("FAILED");
    Serial.println("REASON: " + firebaseData.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }

  
  if (Firebase.setFloat(firebaseData, "/FirebaseIOT/distanceArrière", distanceAR))
  {
    Serial.println("PASSED");
    Serial.println("PATH: " + firebaseData.dataPath());
    Serial.println("TYPE: " + firebaseData.dataType());
    Serial.println("ETag: " + firebaseData.ETag());
    Serial.println("------------------------------------");
    Serial.println();
  }
  else
  {
    Serial.println("FAILED");
    Serial.println("REASON: " + firebaseData.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }
}

void GesteUpdate()
{
  if (distanceG<50 and distanceD<50 and distanceAV<50 and distanceAR<50)
  {
    Tourner_Gauche=false;
    Tourner_Droite=false;
    Avancer_avant=false;
    retour=false;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","false");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","false");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","false");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","false");
  }
  else if (distanceG<50 and distanceD<50 and distanceAV<50)
  {
    Tourner_Gauche=false;
    Tourner_Droite=false;
    Avancer_avant=false;
    retour=true;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","false");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","false");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","false");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","true");
  }
  else if (distanceG<50 and distanceD<50 and distanceAR<50)
  {
     Tourner_Gauche=false;
    Tourner_Droite=false;
    Avancer_avant=true;
    retour=false;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","false");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","false");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","true");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","false");
  }
  else if (distanceG<50 and distanceAV<50 and distanceAR<50)
  {
     Tourner_Gauche=false;
    Tourner_Droite=true;
    Avancer_avant=false;
    retour=false;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","false");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","true");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","false");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","false");
  }
  else if (distanceD<50 and distanceAV<50 and distanceAR<50)
  {
     Tourner_Gauche=true;
    Tourner_Droite=false;
    Avancer_avant=false;
    retour=false;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","true");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","false");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","false");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","false");
  }
  else if (distanceG<50 and distanceD<50)
  {
     Tourner_Gauche=false;
    Tourner_Droite=false;
    Avancer_avant=true;
    retour=true;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","false");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","false");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","true");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","true");
  }
  else if (distanceAV<50 and distanceD<50)
  {
     Tourner_Gauche=true;
    Tourner_Droite=false;
    Avancer_avant=false;
    retour=true;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","true");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","false");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","false");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","true");
  }
  else if (distanceAR<50 and distanceD<50)
  {
     Tourner_Gauche=true;
    Tourner_Droite=false;
    Avancer_avant=true;
    retour=false;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","true");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","false");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","true");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","false");
  }
  else if (distanceG<50 and distanceAV<50)
  {
     Tourner_Gauche=false;
    Tourner_Droite=true;
    Avancer_avant=false;
    retour=true;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","false");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","true");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","false");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","true");
  }
  else if (distanceG<50 and distanceAR<50)
  {
     Tourner_Gauche=false;
    Tourner_Droite=true;
    Avancer_avant=true;
    retour=false;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","false");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","true");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","true");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","false");
  }
  else if (distanceAR<50 and distanceAV<50)
  {
     Tourner_Gauche=true;
    Tourner_Droite=true;
    Avancer_avant=false;
    retour=false;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","true");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","true");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","false");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","false");
  }
  else if (distanceG<50 and distanceAV<50)
  {
     Tourner_Gauche=false;
    Tourner_Droite=true;
    Avancer_avant=false;
    retour=true;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","false");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","true");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","false");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","true");
  }
   else if (distanceG<50 )
  {
    Tourner_Gauche=false;
    Tourner_Droite=true;
    Avancer_avant=true;
    retour=true;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","false");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","true");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","true");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","true");
  }
  else if (distanceD<50 )
  {
     Tourner_Gauche=true;
    Tourner_Droite=false;
    Avancer_avant=true;
    retour=true;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","true");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","false");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","true");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","true");
  }
  else if (distanceAV<50 )
  {
     Tourner_Gauche=true;
    Tourner_Droite=true;
    Avancer_avant=false;
    retour=true;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","true");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","true");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","false");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","true");
  }
  else if (distanceAR<50 )
  {
     Tourner_Gauche=true;
    Tourner_Droite=true;
    Avancer_avant=true;
    retour=false;
    Firebase.setString(firebaseData, "/FirebaseAction/TournerGauche","true");
    Firebase.setString(firebaseData, "/FirebaseAction/TournerDroite","true");
    Firebase.setString(firebaseData, "/FirebaseAction/AvancerAvant","true");
    Firebase.setString(firebaseData, "/FirebaseAction/RetourArrière","false");
  }
}
