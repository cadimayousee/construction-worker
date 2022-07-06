import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { Input, NativeBaseProvider, Button, Icon, Box, AspectRatio } from 'native-base';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import download from "../assets/download.jpg";
import { alignContent, flex, flexDirection, width } from 'styled-system';
import { Directus } from '@directus/sdk';
import request from '../request';
import { Loading } from './Loading';
import BcryptReactNative from 'bcrypt-react-native';

export default function Signup({navigation}) {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [confirmPass, setConfirmPass] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [userToken, setUserToken] = React.useState(''); //needs dispatch

    const directus = new Directus('https://iw77uki0.directus.app');

    async function hashPass(){
        try{

            const salt = await BcryptReactNative.getSalt(10);
            const hash = await BcryptReactNative.hash(salt, 'password');
            const isSame = await BcryptReactNative.compareSync('password', hash);
            } catch(e) {
              console.log({ e })
            }
    };

    React.useEffect(() => {
        hashPass();
    },[]);

    async function register(){

        if(pass !== confirmPass){
            alert('Passwords do not match, please try again')
            return;
        }

        if(firstName =='' || lastName == '' || pass == '' || email == '' || confirmPass == ''){
            alert('One or more fields are empty, please fill all the fields to register')
            return;
        }

        await directus.items('users').createOne({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: pass
            // notification token
        }).then((res) => {
            setLoading(false);
            console.log("response " + JSON.stringify(res));
            navigation.navigate('Drawer');
        });

    }

  return (
    <NativeBaseProvider>
        {loading && <Loading />}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
        <View style={styles.Middle}>
            <Text style={styles.LoginText}>Signup</Text>
        </View>
        <View style={styles.text2}>
            <Text>Already have account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} ><Text style={styles.signupText}> Login </Text></TouchableOpacity>
        </View>

        {/* Username or Email Input Field */}
        <View style={styles.buttonStyle}>
            
            <View style={styles.emailInput}>
            <Input
                InputLeftElement={
                <Icon
                    as={<FontAwesome5 name="user-secret" />}
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
                onChangeText={(text) => setFirstName(text)}
                placeholder="First Name"
                _light={{
                placeholderTextColor: "blueGray.400",
                }}
                _dark={{
                placeholderTextColor: "blueGray.50",
                }}

            />
            </View>
            
        </View>
        
        {/* Username or Email Input Field */}
        <View style={styles.buttonStyleX}>
            
            <View style={styles.emailInput}>
            <Input
                InputLeftElement={
                <Icon
                    as={<FontAwesome5 name="user-secret" />}
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
                onChangeText={(text) => setLastName(text)}
                placeholder="Last Name"
                _light={{
                placeholderTextColor: "blueGray.400",
                }}
                _dark={{
                placeholderTextColor: "blueGray.50",
                }}

            />
            </View>
        </View>

        {/* Username or Email Input Field */}
        <View style={styles.buttonStyleX}>
            
            <View style={styles.emailInput}>
            <Input
                InputLeftElement={
                <Icon
                    as={<MaterialCommunityIcons name="email" />}
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
                onChangeText={(text) => setEmail(text)}
                placeholder="Email"
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
                register()
            }}>
                REGISTER NOW
            </Button>
        </View>
        

        <StatusBar style="auto" />
        <Image source={download} style={styles.image}/>
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
