import * as React from 'react';
import { View , Text , Platform, StyleSheet, Keyboard, TouchableWithoutFeedback} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location  from 'expo-location'
import { SearchBar } from './SearchBar';
import Worker from './Worker';
import { getDistance, getPreciseDistance } from 'geolib';
import { getDatabase, ref, set, get, update, child, onValue } from "firebase/database";
import i18n from 'i18n-js';
import { Directus } from '@directus/sdk';
import messaging from "@react-native-firebase/messaging";
import Toast from 'react-native-toast-message';
import axios from 'axios';

const directus = new Directus('https://iw77uki0.directus.app');

// function getFirebaseActiveWorkers(region){
//   const dbRef = ref(getDatabase());
//   const db = getDatabase();
//   get(child(dbRef, `/users`))
//   .then((res) => {
//     if( //all conditions fail, have to set state
//       (workerKeys.current.length !== Object.keys(res.val()).length) ||
//       (workerKeys.current !== Object.keys(res.val())) ||
//       (workerValues.current.length !== Object.values(res.val()).length) ||
//       (workerValues.current !== Object.values(res.val()))
//       ){
//         var workerData = [];
//         workerKeys.current = Object.keys(res.val());
//         workerValues.current = Object.values(res.val());

//         var worker_ids = Object.keys(res.val());
//         Object.values(res.val()).forEach((val,index) => {
//           var distance = calculateDistance(region, val);
//           // if(distance < 5) //nearby worker
//             workerData.push({id: worker_ids[index], name: val.username, longitude: val.longitude, latitude: val.latitude, distance: distance});
//         });
//         setWorkersLocation(workerData);
//       }
//   })
//   .catch((error) => {
//     console.log(i18n.t('noOnlineWorkers') + error)
//   });

// };

export default function Home({route, navigation}){
  const [region, setRegion] = React.useState();
  const [workersLocation, setWorkersLocation] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const user_id = route.params;
  const workerKeys = React.useRef({});
  const workerValues = React.useRef({});

  async function getLocationAsync(){
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      alert(i18n.t('noPermission'));
        return;
    }
    let location = await Location.getCurrentPositionAsync({accuracy : Location.Accuracy.Lowest});
    let region = {
      longitude : location.coords.longitude,
      latitude: location.coords.latitude,
      longitudeDelta : 0.045,
      latitudeDelta: 0.045
    }
    setRegion(region);
    return region;
  }

  function calculateDistance(userData, workerData){
    var current_location = {latitude : userData.latitude , longitude: userData.longitude};
    var worker_location = {latitude : workerData.latitude , longitude: workerData.longitude};
    var dis = getDistance(current_location, worker_location);
    return (dis/1000);
  }

  async function getActiveWorkers(region){
    await directus.items('workers').readByQuery({limit: -1})
    .then((res) => {
      if(res.data.length > 0){
        
        if( //all conditions fail, have to set state
        (workerKeys.current.length !== res.data.length) ||
        (workerKeys.current !== Object.keys(res.data)) ||
        (workerValues.current.length !== Object.values(res.data).length) ||
        (workerValues.current !== Object.values(res.data))
        ){
          var workerData = [];
          workerKeys.current = Object.keys(res.data);
          workerValues.current = Object.values(res.data);
          
          res.data?.forEach((worker) => {
              // var distance = calculateDistance(region, worker);
              // if(distance < 5) //nearby worker
              if(worker.now_status == 'online'){
                var updated_worker = worker;
                updated_worker.distance = 0 + " " + i18n.t('kmAway');
                workerData.push(updated_worker);
              }
            });
            setWorkersLocation(workerData);

        }
      }
    })
    .catch((error) => {
      console.log(i18n.t('noOnlineWorkers') + error)
    });
  }

  React.useEffect(() => {
    getLocationAsync().then((region) => {
      getActiveWorkers(region);
    });
  },[]);

  //{longitude: -122.084, latitude: 37.4219983}
  //{longitude: 25.101, latitude: 55.178}

  React.useState(() => {
    const interval = setInterval(() => {
      // if(region)
        getActiveWorkers(region);
    },5000); //5 seconds update
    return(() => {
      clearInterval(interval)
  })
  },[]);

  return(
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

    <View style={styles.container}>
      
      <SearchBar navigation={navigation} searchText={searchText} setSearchText={setSearchText}/>

      <MapView
        style = {{flex : 1}}
        initialRegion={region}
        showsUserLocation={true}
        showsCompass={true}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        // onUserLocationChange={(region) => updateLocation(region.nativeEvent.coordinate)}
      >
        {workersLocation
        .filter((worker) => worker.category.includes(searchText.toLowerCase()))
        .map((worker, index) => {
          return(
            <Worker key={index} worker={worker} />
          )
        })}

      </MapView>

    </View>
    </TouchableWithoutFeedback>
  );

}

export const styles = StyleSheet.create({
  container:{
   flex: 1,
   backgroundColor: '#fff'
  }
});
