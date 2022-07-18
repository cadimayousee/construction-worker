import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Button, Image, FlatList, TouchableOpacity, TextInput, StyleSheet, Dimensions} from 'react-native';
import {Ionicons} from '@expo/vector-icons'; 
import profile from "../assets/profile.jpg"
import { Overlay } from 'react-native-elements';
import { Directus } from '@directus/sdk';
import { Loading } from './Loading';
import axios from 'axios';
import i18n from 'i18n-js';

const directus = new Directus('https://iw77uki0.directus.app');

async function notifyWorkers(setLoading, toggleOverlay){
    const yourServerKey = 'AAAAcoIZCrY:APA91bHSYy6335nFe3dN8ixg_WD5DfLZNK0yU_ZXQ7fPGZkLVyZyYxOm5yvk1W-ArfR54Qr1jQRs_IzTQ4qY4fEka2xDcm79am1MsaVDZowRWE7cHDq56L9yAn8XthLEA0PsbvTYKlJ3';
    await axios({
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        "Content-Type": "application/json",
        "Authorization": ['key', yourServerKey].join('=')
      },
      data: {
        to: "/topics/workers",
        notification: {
          title: "Contractor near you posted a new job!",
          body: "Check it out"
        }
      }
    })
  .then(() => {
    setLoading(false);
    toggleOverlay();
    alert('Job Posted!')
  })
  .catch((err) => alert(err))
}

async function postJob(jobTitle, jobDescrp, amount, workers, hours, toggleOverlay, setLoading, id){
    setLoading(true);

    await directus.items('jobs').createOne({
        title: jobTitle,
        description: jobDescrp,
        pay_amount : amount,
        number_of_workers: workers,
        number_of_hours: hours,
        contractor: id
    })
    .then(async (res) => {
        notifyWorkers(setLoading, toggleOverlay);
    })
    .catch((error) => {
        alert(error);
    });
}

function Item({ item, navigate, userData}) {
    const [visible, setVisible] = React.useState(false);
    const [jobTitle, setJTitle] = React.useState('');
    const [jobDescr, setJDescrp] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [hours, setHours] = React.useState(0);
    const [workers, setWorkers] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
  
    const toggleOverlay = () => {
      setVisible(!visible);
  };
  
    return (
      <><Overlay
        overlayStyle={{ borderRadius: 5 }}
        supportedOrientations={['portrait', 'landscape']}
        isVisible={visible}
        onBackdropPress={toggleOverlay}>
            
        {loading && <Loading />}

          <View style={styles.titleHeader}>
              <Ionicons name='document-text-outline' size={27} color='grey'/>
              <Text style={styles.title_1}>{i18n.t('createJob')}</Text>
          </View>
  
          <View style={styles.subtitleHeader}>
              <Text style={styles.megatitle}>{i18n.t('jobTitle')}</Text>
              <TextInput style={[styles.title_2, styles.textInput]} multiline placeholder={i18n.t('jobTitleP')} onChangeText={(text) => setJTitle(text)}/>
          </View>
  
          <View style={styles.subtitleHeader}>
              <Text style={styles.megatitle}>{i18n.t('jobDescription')}</Text>
              <TextInput style={[styles.title_2, styles.textInput]} multiline placeholder={i18n.t('jobDescriptionP')} onChangeText={(text) => setJDescrp(text)}/>
          </View>
  
          <View style={styles.subtitleHeader}>
              <Text style={styles.megatitle}>{i18n.t('amountToPay')}</Text>
              <Text style={styles.title_2}>{i18n.t('amountToPayN')}</Text>
              <TextInput style={[styles.title_2, styles.textInput]} multiline placeholder={i18n.t('amountToPayP')} onChangeText={(text) => setAmount(text)}/>
          </View>
  
          <View style={styles.subtitleHeader}>
              <Text style={styles.megatitle}>{i18n.t('workersNumber')}</Text>
              <TextInput style={[styles.title_2, styles.textInput]} multiline placeholder={i18n.t('workersNumberP')} onChangeText={(text) => setWorkers(text)}/>
          </View>
  
          <View style={styles.subtitleHeader}>
              <Text style={styles.megatitle}>{i18n.t('workingHours')}</Text>
              <TextInput style={[styles.title_2, styles.textInput]} multiline placeholder={i18n.t('workingHoursP')} onChangeText={(text) => setHours(text)}/>
          </View>
  
          <View style={styles.buttonStyle}>
            <Button title={i18n.t('buttonTitleJob')} onPress={() => postJob(jobTitle, jobDescr, amount, workers, hours, toggleOverlay, setLoading, userData.id)}/>
          </View>
  
      </Overlay><TouchableOpacity style={styles.listItem} onPress={() => item.name == i18n.t('logout') ? navigate('Login')
        : item.name == i18n.t('profile') ? navigate('Profile', { userData })
          : item.name == i18n.t('settings') ? navigate('Settings', { userData })
            : item.name == i18n.t('postJob') ? toggleOverlay() 
             : item.name == i18n.t('viewJobs') ? navigate('Jobs',{userData}) : null}>
          <Ionicons name={item.icon} size={32} />
          <Text style={styles.title}>{item.name}</Text>
        </TouchableOpacity></>
    );
  }
  
  export default function CustomDrawerContent(props) {
    const id = props.state.routes[0].params;
    const [userData, setUserData] = React.useState();
  
    async function getData(){
      await directus.items('users').readOne(id.id)
      .then(async(res) => {
        if(Object.keys(res).length !== 0){ //got user 
          setUserData(res);
        }
      })
      .catch((error) => {
        alert(error);
      });
    }
  
    React.useEffect(() => {
      getData();
    },[]);
  
    const state = {
      routes:[
          {
            name:i18n.t('postJob'),
            icon:"create-outline"
          },
          {
            name: i18n.t('viewJobs'),
            icon:"file-tray-stacked"
          },
          {
              name: i18n.t('profile'),
              icon:"person-circle-outline"
          },
          {
              name:i18n.t('settings'),
              icon:"settings-outline"
          },
          {
            name:i18n.t('logout'),
            icon:"exit-outline"
          }
      ]
  }
  // {...props}
    return (
      <View style={styles.container}>

                <Image source={profile} style={styles.profileImg}/>
                <Text style={styles.name_text}>{userData?.first_name + " " + userData?.last_name}</Text> 
                <Text style={styles.email_text}>{userData?.email}</Text> 
                <View style={styles.sidebarDivider}></View>
                <FlatList
                    style={styles.flatList}
                    data={state.routes}
                    renderItem={({ item }) => <Item  item={item} navigate={props.navigation.navigate} userData={id} />}
                    keyExtractor={item => item.name}
                />
            </View>
    );
  }

export const styles = StyleSheet.create({
        container: {
            backgroundColor: "#fff",
            paddingTop:40,
            alignItems:"center",
            flex:1
        
          },
          listItem:{
              height:60,
              alignItems:"center",
              flexDirection:"row",
          },
          title:{
              fontSize:18,
              marginLeft:20
          },
          header:{
            width:"100%",
            height:60,
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center",
            paddingHorizontal:20
          },
          profileImg:{
            width:80,
            height:80,
            borderRadius:40,
            marginTop:20
          },
          sidebarDivider:{
            height:1,
            width:"100%",
            backgroundColor:"lightgray",
            marginVertical:10
          },
          name_text:{
            fontWeight:"bold",
            fontSize:16,
            marginTop:10
          },
          email_text:{
            color:"gray",
            marginBottom:10
          },
          flatList:{
            width:"100%",
            marginLeft:30
          },
          title_1:{
            fontSize:18,
            // marginLeft:20,
            marginTop: 5,
            color: 'grey'
          },
          title_2:{
            fontSize:12,
            // marginLeft:20,
            marginTop: 5,
            color: 'grey'
          },  
          subtitle:{
              fontSize:16,
              // marginLeft:20
          },
        megatitle:{
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 5
        },
        titleHeader:{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center'
        },
        subtitleHeader:{
          flexDirection: 'column',
          alignItems: 'center',
          alignSelf: 'center'
        },
        textInput:{
          borderRadius: 5,
          borderWidth: 1,
          width: Dimensions.get('screen').width * 0.7,
          borderColor: 'grey',
          alignItems: 'center',
          textAlign: 'center'
        },
        buttonStyle:{
          marginTop: 10,
          backgroundColor: 'transparent'
        }
});