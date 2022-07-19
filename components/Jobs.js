import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, ScrollView, Alert, Linking} from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import { Directus } from '@directus/sdk';
import { Loading } from './Loading';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import i18n from 'i18n-js';
import { fireDB } from '../firebase';

const directus = new Directus('https://iw77uki0.directus.app');

export default function Jobs({route, navigation}){
    const [jobs, setJobs] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const id = route.params.userData.id;

    async function getJobs(){
        await directus.items('jobs').readByQuery({ filter: {contractor: id}})
        .then((res) => {    
            res.data.forEach((job) => {
                if(job.now_status == 'in progress'){
                    if(moment().isBefore(moment(job.accepted_time).add(3, 'minutes')))
                        job.can_decline = true;
                }
                else if(job.now_status == 'completed'){
                    job.can_decline = false
                }
                else{
                    job.can_decline = true;
                }
            })
            res.data.sort((a, b) => a.now_status > b.now_status ? -1 : a.now_status < b.now_status ? 1 : 0);
            setJobs(res.data);
        })
        .catch((err) => {
            alert(err);
        })
    }

    useFocusEffect(
        React.useCallback(() => {
          getJobs();
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
        const timer = setInterval(() => {
        let data = [...jobs];
        data.forEach((job) => {
            if(job.now_status == 'in progress' && !moment().isBefore(moment(job.accepted_time).add(3, 'minutes')))
                job.can_decline = false;
          })
          data.sort((a, b) => a.now_status > b.now_status ? -1 : a.now_status < b.now_status ? 1 : 0);
          setJobs(data);
        }, 60000); 
        return () => {
            clearInterval(timer);
        };
    }, [jobs])
    );

    async function openChat(worker_id){

        setLoading(true);

        // //see if an existing chat was created using directus
        // await directus.items('chats').readByQuery({filter : {
        //     contractor: id,
        //     worker: worker_id,
        // }})
        // .then(async (data) => {
        //     var chat_id;
        //     if(data.data.length > 0){ //chat was opened already 
        //         chat_id = data.data[0].id;
        //     }
        //     else{
        //         await directus.items('chats').createOne({
        //             contractor: id,
        //             worker: worker_id,
        //         })
        //         .then((res) => {
        //             chat_id = res.id;
        //         });
        //     }

        //see if an existing chat was created using firebase
        const chats = fireDB.collection('chats');
        var snapshot = chats.where('contractor', '==', id);
        snapshot = await chats.where('worker', '==', worker_id).get();
        var chat_id;

        if (snapshot.empty) {//create chat document

            const contractor = id;
            const worker = worker_id;
            const messages = [];

            const new_chat = await fireDB.collection('chats').add({
                messages,
                contractor,
                worker
            });

            chat_id = new_chat.id;
        }  
        else{ //chat exists
            snapshot.forEach(async (doc) => {
                chat_id = doc.id;
            });
        }
        

        await directus.items('users').readOne(id)
        .then((info) => {
            setLoading(false);
            navigation.navigate('Chat', {chat_id: chat_id, user_id: id, user_info: info, worker_id: worker_id});
        })
    }

    async function contact(job){
        var arr = [...job.workers];
        if(arr.length == 1){ //one worker only
        await directus.items('workers').readOne(arr[0])
        .then((res) => {
            Alert.alert(
                "Contact Worker",
                "You can follow up on the job details by contacting the worker through phone number or through our chat",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Phone",
                    onPress: () => Linking.openURL(`tel:${res.mobile_number}`),
                    style: "default",
                  },
                  {
                    text: "Chat",
                    onPress: () => openChat(res.id),
                    style: "default",
                  },
                ],
                {
                  cancelable: true,
                }
            )
        });
        }
    }

    return(
        <View style={styles.container}>
            {loading && <Loading />}

            <View style={styles.pageTitle} >
                <Ionicons name={'file-tray-stacked'} size={40} />
                <Text style={styles.pageFont}>{i18n.t('viewJobs')}</Text>
            </View>

        <ScrollView>
            
            {jobs.map((job, index) => {
                {/* Card Component for job */}
                return(
                    <Card key={index}>
                    <Card.Title style={styles.title}>{i18n.t('jobTitle') + job.title}</Card.Title>

                    <Text style={{marginBottom: 10}}>
                        <Text style={styles.titles}>
                            {i18n.t('jobDescription')+ " "} 
                        </Text>
                        <Text style={styles.subtitles}>
                            {job.description}
                        </Text>
                    </Text>

                    <Text style={{marginBottom: 10}}>
                        <Text style={styles.titles}>
                            {i18n.t('payAmount')+ " "}
                        </Text>
                        <Text style={styles.subtitles}>
                            {job.pay_amount}
                        </Text>
                    </Text>

                    <Text style={{marginBottom: 10}}>
                        <Text style={styles.titles}>
                            {i18n.t('hours') + " "}
                        </Text>
                        <Text style={styles.subtitles}>
                            {job.number_of_hours}
                        </Text>
                    </Text>
                    
                    {job.number_of_workers > 0 ?
                    <Text style={{marginBottom: 10}}>
                        <Text style={styles.titles}>
                            {i18n.t('workersRemaing') + " "}
                        </Text>
                        <Text style={styles.subtitles}>
                            {job.number_of_workers}
                        </Text>
                    </Text> : null}

                    <Text style={{marginBottom: 10}}>
                        <Text style={styles.titles}>
                            {i18n.t('status') + " "}
                        </Text>
                        <Text style={styles.subtitles}>
                            {job.now_status}
                        </Text>
                    </Text>
                    
                    {job.now_status == 'in progress' ?
                    <Button
                        buttonStyle={styles.viewButton}
                        title={i18n.t('contact')}
                        onPress={() => contact(job)}
                        />
                    : null}

                    {job.now_status == 'in progress' ?
                    <Button
                        buttonStyle={styles.viewButton}
                        title={i18n.t('markCompleted')}
                        onPress={() => {}} //once marked completed and confirmed by worker that it is completed, payment options appear here then rating
                        />
                    : null}

                    {job.can_decline == true? 
                    <Button
                        buttonStyle={styles.declineButton}
                        title={i18n.t('declineJ')}
                        />
                    : null}
                    </Card>
                )
            })}

            {/* Card Component for job */}
            {/* <Card>
            <Card.Title>HELLO WORLD</Card.Title>
            <Text style={{marginBottom: 10}}>
                Some Sort of texting describing job and its details, pay , constructor etc ..
            </Text>
            <Button
                title='VIEW NOW' />
            </Card> */}

        </ScrollView> 
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingTop:40,
        alignItems:"center",
        flex:1,
    },
    title:{
        fontSize: 18
    },
    titles:{
        fontSize: 16,
        fontWeight: 'bold'
    },
    subtitles:{
        fontSize: 16,
    },
    viewButton:{
        marginTop: 5, 
    },
    declineButton:{
        marginTop: 5, 
        backgroundColor: 'red'
    },
    pageTitle:{
        alignSelf: 'flex-start',
        alignItems:"center",
        flexDirection:"row",
        marginLeft: 15
    },
    pageFont:{
        fontSize:25,
        fontWeight: 'bold',
        marginLeft:20
    }
});