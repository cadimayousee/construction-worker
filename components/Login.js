import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image} from 'react-native';
import { Input, NativeBaseProvider, Icon, Box, AspectRatio, Button } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import download from "../assets/download.jpeg";
import { alignContent, flex, flexDirection, width } from 'styled-system';
import { Directus } from '@directus/sdk';
import { Loading } from './Loading';


export default function Login({navigation}) {

    const [userToken, setUserToken] = React.useState('');
    const [email, setEmail] = React.useState('esraa.98300@live.co.uk');
    const [pass, setPass] = React.useState('esraa123');
    const [loading, setLoading] = React.useState(false);
    const directus = new Directus('https://iw77uki0.directus.app');

    async function login(){
      setLoading(true);
      await directus.items('users').readByQuery({
        filter: {
          email: email
        },
      }).then(async(res) => {
        var hash_password = res.data[0].password;
        if(res.data.length > 0){ //user with this email exists
          await directus.utils.hash.verify(pass, hash_password)
          .then((matches) => {
            if(matches == true){ //account valid
              setLoading(false);
              navigation.navigate('Drawer',res.data[0]);
            }
            else{ //incorrect password
              setLoading(false);
              alert("Incorrect Password! Please try again")
            }
          })
        }
        else{
          setLoading(false);
          alert('Incorrect email or user does not exist');
        }
      })
    }

  return (
    <NativeBaseProvider>
       {loading && <Loading />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>

        <View style={styles.Middle}>
          <Text style={styles.LoginText}>Login</Text>
        </View>
        <View style={styles.text2}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => {navigation.navigate('Signup')}} ><Text style={styles.signupText}> Sign up</Text></TouchableOpacity>
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
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
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
              value={pass}
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

        {/* Button */}
        <View style={styles.buttonStyle}>

        <Button style={styles.buttonDesign} onPress={() => {
                setLoading(true), 
                login()
            }}>
               LOGIN
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
