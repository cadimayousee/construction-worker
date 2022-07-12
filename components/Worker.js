import * as React from 'react';
import {
    TouchableOpacity,
    View,
    Text, 
    Image,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Ionicons , Feather} from '@expo/vector-icons'; 
import MapView, { Marker } from 'react-native-maps';
import { Button, Overlay } from 'react-native-elements';
import { borderRadius, borderWidth, flexDirection } from 'styled-system';

export default function Worker(props){
    const [data , setData] = React.useState();
    const [visible, setVisible] = React.useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const worker = props.worker ? props.worker : 
    {
        uid: "noWorkers",
        distance: '0 km away',
        location: {longitude: 0, latitude: 0}
    }

    const coordinate = {
        latitude: worker.latitude,
        longitude: worker.longitude
    };

    React.useEffect(() => {
        setData({worker : worker, coordinate: coordinate});
        console.log(worker)
    },[]);

    //open worker details on press
    return(
        <TouchableOpacity onPress={visible? toggleOverlay : null}>

        <Overlay 
        overlayStyle={styles.overlay}
        supportedOrientations={['portrait', 'landscape']}
        isVisible={visible} 
        onBackdropPress={toggleOverlay}>

            <View style={styles.titleHeader}>
                <Ionicons name='information-circle-outline' size={27} color='grey'/>
                <Text style={styles.title}>Worker Info: </Text>
            </View>

            <View style={styles.titleHeader}>
                <Text style={styles.megatitle}>Name:</Text>
                <Text style={styles.subtitle}>{worker.first_name + " " + worker.last_name}</Text>
            </View>

            <View style={styles.titleHeader}>
                <Text style={styles.megatitle}>Categories:</Text>
                <Text style={styles.subtitle}>{worker.category}</Text>
            </View>

            <View style={styles.titleHeader}>
                <Text style={styles.megatitle}>Rating:</Text>
                <Text style={styles.subtitle}>{worker.rating == 0? 'No Rating' : worker.rating}</Text>
            </View>

            <View style={styles.titleHeader}>
                <Ionicons name='call-outline' size={27} color='grey'/>
                <Text style={styles.title}>Contact Worker At: </Text>
            </View>

            <View style={styles.titleHeader}>
                <Text style={styles.megatitle}>Email:</Text>
                <Text style={styles.subtitle}>{worker.email}</Text>
            </View>

            <View style={styles.titleHeader}>
                <Text style={styles.megatitle}>Phone Number:</Text>
                <Text style={styles.subtitle}>{worker.mobile_number}</Text>
            </View>

        </Overlay>

        <MapView.Marker.Animated
            coordinate={coordinate}
            anchor={{ x: 0.35, y: 0.32 }}
            style={{ width: 50, height: 50 }}
        >
                <MapView.Callout
                    style={{
                        position: 'absolute',
                        width: 100,
                    }}
                    onPress={toggleOverlay}>
                    <View>
                        <Text numberOfLines={1}>{worker.first_name + " " + worker.last_name}</Text>
                        <Text numberOfLines={1} style={{ color: '#808080' }}>{worker.distance}</Text>
                    </View>
                </MapView.Callout>

        </MapView.Marker.Animated>

        </TouchableOpacity>
    );
};

export const styles = StyleSheet.create({
    overlay:{
        // width: Dimensions.get('screen').width / 1.5,
        // height: Dimensions.get('screen').height / 3,
        borderRadius: 5,
    },
    title:{
        fontSize:18,
        marginLeft:20,
        color: 'grey'
    },
    subtitle:{
        fontSize:16,
        marginLeft:20
    },
    megatitle:{
        fontSize: 16,
        fontWeight: 'bold'
    },
    titleHeader:{
        flexDirection: 'row',
        alignItems: 'center'
    },
});