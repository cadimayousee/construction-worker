import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Directus } from '@directus/sdk';
import { GiftedChat } from 'react-native-gifted-chat'
import { Loading } from './Loading';
import i18n from 'i18n-js';

const directus = new Directus('https://iw77uki0.directus.app');

export default function Chat({route}){
    const [messages, setMessages] = React.useState(); //put sample message
    const [loading, setLoading] = React.useState(false);

    async function getMessages(){
      await directus.items('chats').readByQuery({ filter : {
        contractor : 5
      }})
      .then((res) => {
        res.data.forEach((chat) => {
          setMessages(chat.messages);
        })
        setLoading(false);
      })
    };

    React.useEffect(() => {
      setLoading(true);
      getMessages();
    }, [])

    // const onSend = React.useCallback(async (messages = []) => {
    //     setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    //     var all_messages = [...messages];
    //     all_messages.push(messages);
    //     await directus.items('chats').updateOne(chat_id, {
    //         messages: all_messages
    //     })
    //     .then((res) => {
    //     });
    //   }, [])

    return(
        <GiftedChat
        messages={messages}
        // onSend={messages => onSend(messages)}
        user={{
          _id: 5,
        }}
      />

    );
}
