import * as React from 'react';
import {
    TouchableOpacity,
    View,
    Text, 
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons , Feather} from '@expo/vector-icons'; 
import MapView, { Marker } from 'react-native-maps';

export default function Worker(props){
    const [data , setData] = React.useState();

    const worker = props.worker ? props.worker : 
    {
        uid: "noWorkers",
        distance: '0 km away',
        location: {longitude: 0, latitude: 0}
    }

    const coordinate = {
        latitude: worker.location.latitude,
        longitude: worker.location.longitude
    };

    React.useEffect(() => {
        setData({worker : worker, coordinate: coordinate});
    },[]);

    //open worker details on press
    return(
        <MapView.Marker.Animated
        coordinate={coordinate}
        anchor={{x: 0.35, y:0.32}}
        style={{width: 50, height: 50}}
        >
                <MapView.Callout 
                style={{ 
                    position: 'absolute', 
                    width: 100,
                }} 
                onPress={() => {}} >
                    <View>
                    <Text numberOfLines={1}>{worker.uid}</Text>
                    <Text numberOfLines={1} style={{color: '#808080'}}>{worker.distance}</Text>
                    </View>
                </MapView.Callout> 

        </MapView.Marker.Animated>
    );
};