import { StyleSheet, Text, View } from "react-native";
import IconButton from "../buttons/IconButton";

type StepBarProps = {
  display?: boolean;  // optional (default = true)
  onBack?: () => void;  // optional callback
  start?: number;  // optional (default = 1)
  end?: number;  // optional (default = 1)
  title?: string;
};

export default function StepBar({
  display = true,
  onBack,
  start = 1,
  end = 1,
  title = "Title",
}: StepBarProps) {
  return (
    <View style={styles.container}>
      {display && (
        <IconButton
          onPress={() => onBack && onBack()}
          icon={require("../../../assets/icons/ArrowBack.png")}
          style={styles.iconButton}
        />
      )}
      <View style={[styles.titleHeader, { width: display ? "85%" : "100%" }]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          Step {start} to {end}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    flexDirection: "row",
  },
  iconButton: {
    marginBottom: 10,
  },
  titleHeader: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#14AD59",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 10,
    textAlign: "center",
  },
});
