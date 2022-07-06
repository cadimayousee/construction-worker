import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image} from 'react-native';
import { Input, NativeBaseProvider, Icon, Box, AspectRatio, Button } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import passImg from "../assets/password.png";
import { alignContent, flex, flexDirection, width } from 'styled-system';
import { Directus } from '@directus/sdk';
import { Loading } from './Loading';
import axios from 'axios';

export default function ChangePassword ({navigation, route}){
    const userData = route.params;
    const [loading, setLoading] = React.useState(false);
    const [inputOTP, setInputOTP] = React.useState('');
    const directus = new Directus('https://iw77uki0.directus.app');
    const [pass, setPass] = React.useState('');
    const [confirmPass, setConfirmPass] = React.useState('');

    async function changePassword(){
        if(pass !== confirmPass){
            setLoading(false);
            alert('Passwords do not match, please try again')
        }
        else{
            //patch
            await directus.items('users').updateOne(userData.id, {
                password: pass
            })
            .then((res) =>{
                setLoading(false);
                navigation.navigate('Drawer', userData);
            })
            .catch((err) => {
                setLoading(false);
                alert(err.message);
            });
        }
    }

    return (
        <NativeBaseProvider>
            {loading && <Loading />}
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
    
            <View style={styles.Middle}>
              <Text style={styles.LoginText}>Change Password</Text>
            </View>

            <View style={styles.text2}>
              <Text style={styles.signupText}>Enter the new Password:</Text>
            </View>
    
           
        {/* Password Input Field */}
        <View style={styles.buttonStyleX}>
            
            <View style={styles.emailInput}>
            <Input
                InputLeftElement={
                <Icon
                    as={<FontAwesome5 name="key" />}
                    size="sm"
                    m={2}
                    _light={{
                    color: "black",
                    }}
                    _dark={{
                    color: "gray.300",
                    }}
                />
                }
                variant="outline"
                value={pass}
                secureTextEntry={true}
                onChangeText={(text) => setPass(text)}
                placeholder="Password"
                _light={{
                placeholderTextColor: "blueGray.400",
                }}
                _dark={{
                placeholderTextColor: "blueGray.50",
                }}
            />
            </View>
        </View>

        {/* Password Input Field */}
        <View style={styles.buttonStyleX}>
            
            <View style={styles.emailInput}>
            <Input
                InputLeftElement={
                <Icon
                    as={<FontAwesome5 name="key" />}
                    size="sm"
                    m={2}
                    _light={{
                    color: "black",
                    }}
                    _dark={{
                    color: "gray.300",
                    }}
                />
                }
                variant="outline"
                value={confirmPass}
                secureTextEntry={true}
                onChangeText={(text) => setConfirmPass(text)}
                placeholder="Confirm Password"
                _light={{
                placeholderTextColor: "blueGray.400",
                }}
                _dark={{
                placeholderTextColor: "blueGray.50",
                }}
            />
            </View>
        </View>
    
            {/* Button */}
            <View style={styles.buttonStyle}>
    
            <Button style={styles.buttonDesign} onPress={() => {
                    setLoading(true),
                    changePassword()
                }}>
                   Confirm Password Change
                </Button>
                
            </View>
    
            <StatusBar style="auto" />
              <Image source={passImg} style={styles.image}/>
    
            </View>
          </TouchableWithoutFeedback>
        </NativeBaseProvider>
      );
    }
    
    
    
    export const styles = StyleSheet.create({
      container: {
          flex: 1,
          backgroundColor: '#fff',
        },
        LoginText: {
          marginTop:100,
          fontSize:30,
          fontWeight:'bold',
        },
        Middle:{
          alignItems:'center',
          justifyContent:'center',
        },
        text2:{
          flexDirection:'row',
          justifyContent:'center',
          paddingTop:5
        },
        text3:{
          flexDirection:'row',
          justifyContent:'flex-start',
          paddingTop:5
        },
        signupText:{
          fontWeight:'bold'
        },
        emailField:{
          marginTop:30,
          marginLeft:15
        },
        emailInput:{
          marginTop:10,
          marginRight:5
        },
        buttonStyle:{
          marginTop:30,
          marginLeft:15,
          marginRight:15
        },
        buttonStyleX:{
          marginTop:12,
          marginLeft:15,
          marginRight:15
        },
        buttonDesign:{
          backgroundColor:'#026efd'
        },
        lineStyle:{
          flexDirection:'row',
          marginTop:30,
          marginLeft:15,
          marginRight:15,
          alignItems:'center'
        },
        imageStyle:{
          width:80,
          height:80,
          marginLeft:20,
        },
        boxStyle:{
          flexDirection:'row',
          marginTop:30,
          marginLeft:15,
          marginRight:15,
          justifyContent:'space-around'
        },
        image:{
          flex: 1,
          width: null,
          height: null,
          resizeMode: 'contain'
        }
    });
    