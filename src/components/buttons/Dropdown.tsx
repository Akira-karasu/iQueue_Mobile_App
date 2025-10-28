import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface DropdownProps {
  title?: string;
  label?: string;
  selectedValue: string;
  onSelect: (value: string) => void;
  data: { label: string; value: string }[];
  required?: boolean;
}

function Dropdown({
  title = "Title",
  label = "Select an option",
  selectedValue,
  onSelect,
  data,
  required = false,
}: DropdownProps) {
  return (
    <View style={styles.container}>
      {/* 🧩 Title + Required Indicator */}
      {title ? (
        <Text style={styles.title}>
          {title}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      ) : null}

      {/* 🧱 Wrapper View for consistent border */}
      <View style={styles.borderContainer}>
        <RNPickerSelect
          onValueChange={onSelect}
          items={data}
          value={selectedValue}
          placeholder={{ label, value: "" }}
          style={{
            inputAndroid: styles.input,
            inputIOS: styles.input,
            placeholder: { color: "#999" },
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
container:{
    marginBottom: 10,
    flexGrow: 1
},
  title: {
    color: "#111",
    marginBottom: 4,
  },
  required: {
    color: "red",
  },
  borderContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  input: {
    color: "#333",
  },
});

export default React.memo(Dropdown);
