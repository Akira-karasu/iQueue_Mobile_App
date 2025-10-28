import { Image, StyleSheet, Text, View } from "react-native";

type LogoTitleProps = {
  title?: string;
};

export default function LogoTitle({ title = "Title" }: LogoTitleProps) {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/project_images/Iqueue.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        color: '#14AD59',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 25,
    },
});