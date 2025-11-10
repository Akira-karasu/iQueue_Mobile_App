import Button from "@/src/components/buttons/Button";
import Card from "@/src/components/cards/Card";
import StepBar from "@/src/components/layout/stepBar";
import ViewScroller from "@/src/components/scroller/ViewScroller";
import { useRequest } from "@/src/hooks/appTabHooks/useRequest";
import { useRequestStore } from "@/src/store/requestStore";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Image, Text, View } from "react-native";

export type RequestFormProps = {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  steps: number;
};

export default function UploadID({ setSteps, steps }: RequestFormProps) {

    const { formData, setFormData } = useRequestStore();
    const { error, setError } = useRequest();
  
    const handleChange = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
      setFormData({ [key]: value });
    };
  


const selectImage = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    alert("Permission to access camera roll is required!");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!result.canceled) {
    handleChange("pictureID", result.assets[0].uri); // ✅ correct way
    setError(""); // clear error
  }
};


  const handleSubmit = () => {
    if (!formData.pictureID) {
      setError("Please select an image before continuing.");
      return;
    }
    setError("");
    setSteps(3); // go to next step
  };

  return (
    <ViewScroller>
      <StepBar
        title="Upload Verified ID picture"
        display={true}
        onBack={() => setSteps(1)}
      />

      <Card style={{ marginHorizontal: 10, padding: 10 }}>
        <Text style={{ fontSize: 14, color: "#555" }}>
          <Text style={{ fontWeight: "bold" }}>NOTE: </Text>
          Please upload a verified ID.{"\n"}
          {"\u2022"} Valid ID for parents.{"\n"}
          {"\u2022"} Student ID for students and alumni.
        </Text>
      </Card>

      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Button title="Select Image" onPress={selectImage} fontSize={18} />

        {formData.pictureID ? (
          <Image
            source={{ uri: formData.pictureID }}
            style={{ width: 300, height: 300, marginTop: 20, marginBottom: 20 }}
          />
        ) : (
          <View
            style={{
              width: 300,
              height: 300,
              marginTop: 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: "#ccc",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <Text>No Image Selected</Text>
          </View>
        )}

        {error ? (
          <Text style={{ color: "red", marginBottom: 10, fontSize: 14 }}>
            {error}
          </Text>
        ) : null}

        <Button title="Use this image" fontSize={18} onPress={handleSubmit} />
      </View>
    </ViewScroller>
  );
}
