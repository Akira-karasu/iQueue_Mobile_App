import { Image, StyleSheet, Text, View } from "react-native";

type LogoTitleProps = {
  title?: string;
};

export default function LogoTitle({ title = "Title" }: LogoTitleProps) {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/project_images/Iqueue.png')}
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
        marginTop: 15,
        marginBottom: 15,
    },
    image: {
        width: 120,
        height: 120,
    },
    title: {
        color: '#14AD59',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 25,
    },
});