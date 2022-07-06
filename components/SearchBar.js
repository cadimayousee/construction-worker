import * as React from 'react';
import {
    TouchableOpacity,
    View,
    Text, 
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Ionicons , Feather} from '@expo/vector-icons'; 
import { DrawerActions } from '@react-navigation/native';

const width = Dimensions.get('window').width;

export const SearchBar =  function(props){
    
    return(
        <TouchableOpacity onPress={() => {}} style={styles.container}>
            <View style = {styles.leftCol}>
                {/* <Feather name="search" size={25} color="black" style={{alignSelf: 'center'}}/> */}
                <Ionicons name="hammer-outline" size={25} style={{alignSelf: 'center'}} />
            </View>

            <View style = {styles.centerCol}>
                <Text style={styles.searchTextStyle}>
                    Search Here ...
                </Text>
            </View>

            <TouchableOpacity onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())} style = {styles.rightCol}>
                {/* <Ionicons name="hammer-outline" size={25} style={{alignSelf: 'center'}} /> */}
                <Ionicons name="menu" size={25} style={{alignSelf: 'center'}} />
            </TouchableOpacity>

        </TouchableOpacity>
    );
}

export const styles = StyleSheet.create({
    container:{
        zIndex: 9,
        position: 'absolute',
        flexDirection: 'row',
        width: width - 40,
        height: 60,
        top: 60,
        left: 20,
        borderRadius: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        shadowColor: '#000000',
        elevation: 7,
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    leftCol:{
        flex: 1,
        alignItems: 'center',
    },
    centerCol:{
        flex: 4
    },
    rightCol:{
        flex: 1,
        borderLeftWidth: 1,
        borderColor: '#ededed',
    },
    searchTextStyle:{
        fontSize: 18,
        color: '#545454'
    }
});
