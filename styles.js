import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
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
export default styles;