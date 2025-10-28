import { StyleSheet } from 'react-native';

const style = StyleSheet.create({

  switchText:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AEAEAE',
    width: '60%',
  },

  switchCont:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  cardText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#19AF5B',
  },

  cardInput:{
    flexDirection: 'column',
    gap: 15,
  },

  mainContainer:{
    flexGrow: 1,
    width: '100%',
    padding: 25,

  },

  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 10,
  },

  Headertext:{
    fontSize: 25,
    fontWeight: 'bold',
    color: '#19AF5B',
    textAlign: 'center',
    width: '90%',
  },
  

  iconImage: {
    width: 35,
    height: 35

  },

  pressableText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19AF5B',
    textAlign: 'center',
    width: '100%',
  },

  pressableButton:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    padding: 10,
  },

  containerButton:{
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 50,
    width: '80%',
    paddingHorizontal: 10,
    gap: 15
  },

  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F9F9F9",

  },

  shapeCircleImage: {
    position: 'absolute',
    top: -220,
    left: 0,
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
    zIndex: 1,
  },

  Profileimage: {
        width: 150,
        height: 150,        
        borderColor: '#73B46D',
        borderRadius: 100,
        borderWidth: 5,
        backgroundColor: '#fff',
    },
  userName: {
    fontSize: 35,
    fontWeight: '600',
    marginTop: 10,
    color: '#19AF5B',
    textAlign: 'center',
  },

  userId: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 5,
    color: '#9A9A9A',
    textAlign: 'center',
  },

  profileContainer: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  }

});

export default style