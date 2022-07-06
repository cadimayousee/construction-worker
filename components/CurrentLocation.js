import * as React from 'react';
import { View , Dimensions, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').width;

export const LocationButton = function(props){
    const bottom = props.bottom ? props.bottom : 65;
    const cb = props.cb ? props.cb : null;

    return(
        <View style= {[styles.container, {top: height - bottom}]}>
            <MaterialIcons name = "my-location" color = "#000000" size={25} onPress={() => {cb()}}/> 
        </View>
    );

};

export const styles = StyleSheet.create({
    container:{
        zIndex: 9,
        position: 'absolute',
        width: 45,
        height: 45,
        backgroundColor: '#fff',
        left: width - 50,
        borderRadius: 50,
        shadowColor: '#000000',
        elevation: 7,
        shadowRadius: 5,
        shadowOpacity: 1.0,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});