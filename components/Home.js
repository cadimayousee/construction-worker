import * as React from 'react';
import { View , Text , Platform, StyleSheet} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location  from 'expo-location'
import { SearchBar } from './SearchBar';
import Worker from './Worker';
import { getDistance, getPreciseDistance } from 'geolib';
import { getDatabase, ref, set, get, update, child, onValue } from "firebase/database";

export default function Home({navigation}){
  const [region, setRegion] = React.useState();
  const [workersLocation, setWorkersLocation] = React.useState([]);
  const workerKeys = React.useRef({});
  const workerValues = React.useRef({});

  async function getLocationAsync(){
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      alert('Permission to access location was denied');
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

  function getActiveWorkers(region){
    const dbRef = ref(getDatabase());
    const db = getDatabase();
    get(child(dbRef, `/users`))
    .then((res) => {
      if( //all conditions fail, have to set state
        (workerKeys.current.length !== Object.keys(res.val()).length) ||
        (workerKeys.current !== Object.keys(res.val())) ||
        (workerValues.current.length !== Object.values(res.val()).length) ||
        (workerValues.current !== Object.values(res.val()))
        ){
          var workerData = [];
          workerKeys.current = Object.keys(res.val());
          workerValues.current = Object.values(res.val());

          var worker_ids = Object.keys(res.val());
          Object.values(res.val()).forEach((val,index) => {
            var distance = calculateDistance(region, val);
            if(distance < 5) //nearby worker
              workerData.push({id: worker_ids[index], name: val.username, longitude: val.longitude, latitude: val.latitude, distance: distance});
          });
          setWorkersLocation(workerData);
        }
    })
    .catch((error) => {
      console.log("Cannot Get Online Workers ... " + error)
    });
  
  };

  React.useEffect(() => {
    getLocationAsync().then((region) => {
      getActiveWorkers(region);
    });
  },[]);

  //{longitude: -122.084, latitude: 37.4219983}
  //{longitude: 25.101, latitude: 55.178}

  React.useState(() => {
    const interval = setInterval(() => {
      if(region)
        getActiveWorkers(region)
    },5000);
  },[]);

  return(
    <View style={styles.container}>
      
      <SearchBar navigation={navigation} />

      <MapView
        style = {{flex : 1}}
        initialRegion={region}
        showsUserLocation={true}
        showsCompass={true}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        // onUserLocationChange={(region) => updateLocation(region.nativeEvent.coordinate)}
      >
        {workersLocation.map((worker, index) => {
          return(
            <Worker key={index} worker={{uid : worker.name , distance: worker.distance + ' km away', location: {longitude: worker.longitude, latitude: worker.latitude}}} />
          )
        })}

      </MapView>

    </View>
  );

}

export const styles = StyleSheet.create({
  container:{
   flex: 1,
   backgroundColor: '#fff'
  }
});
