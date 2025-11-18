import { StyleSheet, Text, View } from "react-native";
import IconButton from "../buttons/IconButton";

type StepBarProps = {
  displayArrowLeft?: boolean;  // Show/hide left arrow
  displayArrowRight?: boolean;  // Show/hide right arrow
  onLeftPress?: () => void;  // Left arrow callback
  onRightPress?: () => void;  // Right arrow callback
  start?: number;  // Current step
  end?: number;  // Total steps
  title?: string;  // Title text
};

export default function StepBar({
  displayArrowLeft = true,
  displayArrowRight = true,
  onLeftPress,
  onRightPress,
  start = 1,
  end = 1,
  title = "Title",
}: StepBarProps) {
  return (
    <View style={styles.container}>
      {/* Left Arrow */}
      {displayArrowLeft ? (
        <IconButton
          onPress={() => onLeftPress && onLeftPress()}
          icon={require("../../../assets/icons/ArrowBack.png")}
          style={styles.arrow}
        />
      ) : (
        <View style={styles.arrow} />
      )}

      {/* Title in Center */}
      <View style={styles.titleHeader}>
        <Text style={styles.title}>{title}</Text>
        {start && end && (
          <Text style={styles.stepCounter}>
            {start}/{end}
          </Text>
        )}
      </View>

      {/* Right Arrow */}
      {displayArrowRight ? (
        <IconButton
          onPress={() => onRightPress && onRightPress()}
          icon={require("../../../assets/icons/ArrowBack.png")}
          style={[styles.arrow, styles.arrowRight]}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.arrow} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arrow: {
    width: 40,
    height: 40,
  },
  arrowRight: {
    transform: [{ scaleX: -1 }],  // Flip arrow to face right
  },
  titleHeader: {
    alignItems: "center",
    marginHorizontal: 10,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#14AD59",
    textAlign: "center",
  },
  stepCounter: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontWeight: "500",
  },
});