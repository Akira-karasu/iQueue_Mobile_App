import { Image, StyleSheet, Text, View } from "react-native";

export default function IconBar() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/project_images/PJGSS_logo.png')}
                style={{ width: 40, height: 40}}
            />
            <Text style={styles.title}>Pastorelle - Jesus Good Shepherd School</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    title: {
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: "Poppins",
        color: "#5C5C5C",
        marginLeft: 12, 
    },
});
