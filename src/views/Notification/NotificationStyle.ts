import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    notificationBorder: {
        width: '100%',
        backgroundColor: '#ffffffff',
        flexDirection: 'row',
        padding: 15,
        alignContent: 'center',
        gap: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9'
    },
    notificationText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#19AF5B'
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    }
    
    
});

export default style