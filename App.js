import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, Image, FlatList, TouchableOpacity} from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import 'react-native-gesture-handler';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Ionicons} from '@expo/vector-icons'; 
import Home from './components/Home';
import Login from './components/Login';
import Signup from "./components/Signup";
import profile from "./assets/profile.jpg";
import styles from './styles';
import 'localstorage-polyfill';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
import 'react-native-get-random-values'
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export default function App() {

  return (
    <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Drawer" component={MyDrawer} />
            <Stack.Screen name="Signup" component={Signup} />
          </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
  );
}

function Item({ item, navigate }) {
  return (
    <TouchableOpacity style={styles.listItem} onPress={()=> item.name == 'Logout' ? navigate('Login') : null}>
      <Ionicons name={item.icon} size={32} />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );
}

function CustomDrawerContent(props) {
  const userData = props.state.routes[0].params;
  const state = {
    routes:[
        {
            name:"Profile",
            icon:"person-circle-outline"
        },
        {
            name:"Settings",
            icon:"settings-outline"
        },
        {
          name:"Logout",
          icon:"exit-outline"
      },
    ]
}
// {...props}
  return (
    <View style={styles.container}>
              <Image source={profile} style={styles.profileImg}/>
              <Text style={styles.name_text}>{userData.first_name + " " + userData.last_name}</Text> 
              <Text style={styles.email_text}>{userData.email}</Text> 
              <View style={styles.sidebarDivider}></View>
              <FlatList
                  style={styles.flatList}
                  data={state.routes}
                  renderItem={({ item }) => <Item  item={item} navigate={props.navigation.navigate}/>}
                  keyExtractor={item => item.name}
              />
          </View>
  );
}

function MyDrawer({route}) {
  const userData = route.params;

  return (
    <Drawer.Navigator
      useLegacyImplementation
      screenOptions={{headerShown: false}}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} initialParams={userData}/>
    </Drawer.Navigator>
  );
}
