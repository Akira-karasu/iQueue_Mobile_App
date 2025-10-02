import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Activity from './activity';

const { width } = Dimensions.get('window');

export default function ImageHeading() {
    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require('../../assets/project_images/Iqueue.png')}
                style={styles.logo}
                resizeMode="contain"
            />
           
            <View style={styles.schoolImageWrapper}>
                <Image
                    source={require('../../assets/project_images/PJGSS_schoolPic1.png')}
                    style={styles.schoolImage}
                    resizeMode="cover"
                />
            </View>
            <Activity 
                label="Learn more about us"
            onPress={() => {
             {/*put the link*/}
            }}
            color="#19AF5B"
            underline={false}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: 50,
        height: 50,
        marginBottom: 4,
    },
    schoolImageWrapper: {
        width: width * 0.92,
        aspectRatio: 1.7,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#eee',
        marginTop: 8,
        marginBottom: 8,
        alignSelf: 'center',
        justifyContent: 'flex-end',
    },
    schoolImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    
    schoolLogo: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#fff',
    },
   
});