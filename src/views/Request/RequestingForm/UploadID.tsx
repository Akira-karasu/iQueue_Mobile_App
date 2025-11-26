import Button from "@/src/components/buttons/Button";
import Card from "@/src/components/cards/Card";
import StepBar from "@/src/components/layout/stepBar";
import ViewScroller from "@/src/components/scroller/ViewScroller";
import { useRequest } from "@/src/hooks/appTabHooks/useRequest";
import { useRequestStore } from "@/src/store/requestStore";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, Text, View } from "react-native";

export type RequestFormProps = {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  steps: number;
};

// ✅ Image size policy constants (in MB) - Updated to 5MB
const IMAGE_SIZE_POLICY = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  RECOMMENDED_SIZE_MB: 2,
  MIN_SIZE_MB: 0.1,
};

// ✅ Image compression settings - Less aggressive for 5MB
const COMPRESSION_SETTINGS = {
  MAX_WIDTH: 1200,
  MAX_HEIGHT: 1200,
  COMPRESSION_QUALITY: 0.7, // ✅ 70% quality (less aggressive)
};

export default function UploadID({ setSteps, steps }: RequestFormProps) {
  const { formData, setFormData } = useRequestStore();
  const { error, setError } = useRequest();
  const [isCompressing, setIsCompressing] = useState(false);

  const handleChange = <K extends keyof typeof formData>(
    key: K,
    value: typeof formData[K]
  ) => {
    setFormData({ [key]: value });
  };

  // ✅ Compress image helper function
  const compressImage = async (uri: string): Promise<string | null> => {
    try {
      setIsCompressing(true);

      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: COMPRESSION_SETTINGS.MAX_WIDTH,
              height: COMPRESSION_SETTINGS.MAX_HEIGHT,
            },
          },
        ],
        {
          compress: COMPRESSION_SETTINGS.COMPRESSION_QUALITY,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return result.uri;
    } catch (error) {
      console.error("Image compression error:", error);
      setError("❌ Error compressing image. Please try again.");
      return null;
    } finally {
      setIsCompressing(false);
    }
  };

  // ✅ Check file size helper function - Using legacy API
  const checkFileSizePolicy = async (uri: string): Promise<boolean> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists) {
        setError("❌ File does not exist.");
        return false;
      }

      const fileSizeBytes = fileInfo.size || 0;
      const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);

      // Check if file size exceeds maximum
      if (fileSizeBytes > IMAGE_SIZE_POLICY.MAX_SIZE_BYTES) {
        setError(
          `❌ File size (${fileSizeMB}MB) exceeds maximum allowed size of ${IMAGE_SIZE_POLICY.MAX_SIZE_MB}MB.\n\nCompressing image...`
        );
        return false;
      }

      // Check if file size is too small
      if (fileSizeBytes < IMAGE_SIZE_POLICY.MIN_SIZE_MB * 1024 * 1024) {
        setError(
          `❌ File size is too small (${fileSizeMB}MB).\n\nMinimum required size is ${IMAGE_SIZE_POLICY.MIN_SIZE_MB}MB.`
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("File size check error:", error);
      setError("❌ Error checking file size. Please try again.");
      return false;
    }
  };

  // ✅ Validate image format
  const checkImageFormat = (uri: string): boolean => {
    const validFormats = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = uri.split(".").pop()?.toLowerCase();

    if (!fileExtension || !validFormats.includes(fileExtension)) {
      setError(
        `❌ Invalid image format.\n\nSupported formats: ${validFormats.join(", ").toUpperCase()}`
      );
      return false;
    }

    return true;
  };

  // ✅ Process image with compression if needed
  const processImage = async (imageUri: string) => {
    // Step 1: Validate format
    if (!checkImageFormat(imageUri)) {
      return null;
    }

    // Step 2: Check file size
    let isValidSize = await checkFileSizePolicy(imageUri);

    // Step 3: If size is too large, compress it
    if (!isValidSize) {
      const compressedUri = await compressImage(imageUri);
      if (!compressedUri) {
        return null;
      }

      // Step 4: Check compressed file size
      isValidSize = await checkFileSizePolicy(compressedUri);
      if (!isValidSize) {
        setError(
          `❌ File is still too large even after compression.\n\nTry selecting a different image or taking a photo with lower resolution.`
        );
        return null;
      }

      return compressedUri;
    }

    return imageUri;
  };

  const selectImage = async () => {
    try {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photos to let you select an image.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      // Ask user to choose between camera or gallery
      Alert.alert(
        "Select Image Source",
        "Choose where you want to upload your ID from:",
        [
          {
            text: "Camera",
            onPress: async () => {
              const cameraPermission =
                await ImagePicker.requestCameraPermissionsAsync();
              if (!cameraPermission.granted) {
                Alert.alert(
                  "Permission Denied",
                  "Camera access is required to take a photo."
                );
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8, // ✅ Camera takes photo at 80% quality
                allowsEditing: true,
              });

              if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const processedUri = await processImage(imageUri);

                if (processedUri) {
                  handleChange("pictureID", processedUri);
                  setError("");
                }
              }
            },
          },
          {
            text: "Gallery",
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
              });

              if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const processedUri = await processImage(imageUri);

                if (processedUri) {
                  handleChange("pictureID", processedUri);
                  setError("");
                }
              }
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } catch (error) {
      console.error("Image selection error:", error);
      Alert.alert("❌ Error", "Something went wrong while selecting the image.");
    }
  };

  const handleSubmit = () => {
    if (!formData.pictureID) {
      setError("❌ Please select an image before continuing.");
      return;
    }
    setError("");
    setSteps(3); // go to next step
  };

  return (
    <ViewScroller>
      <StepBar
        title="Upload Verified ID picture"
        displayArrowLeft={true}
        displayArrowRight={false}
        onLeftPress={() => setSteps(1)}
      />

      {/* ✅ Requirements Note Card */}
      <Card style={{ marginHorizontal: 10, padding: 15, backgroundColor: "#f5f5f5" }}>
        <Text style={{ fontSize: 14, color: "#555", lineHeight: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>📋 NOTE: </Text>
          Please upload a verified ID.{"\n"}
          {"\u2022"} Valid ID for parents.{"\n"}
          {"\u2022"} Student ID for students and alumni.
          {"\n\n"}
          <Text style={{ fontWeight: "bold", fontSize: 15, color: "#19AF5B" }}>
            📁 File Requirements:
          </Text>
          {"\n"}
          {"\u2022"} Maximum file size: <Text style={{ fontWeight: "bold" }}>{IMAGE_SIZE_POLICY.MAX_SIZE_MB}MB</Text>
          {"\n"}
          {"\u2022"} Recommended size: <Text style={{ fontWeight: "bold" }}>{IMAGE_SIZE_POLICY.RECOMMENDED_SIZE_MB}MB</Text>
          {"\n"}
          {"\u2022"} Minimum size: <Text style={{ fontWeight: "bold" }}>{IMAGE_SIZE_POLICY.MIN_SIZE_MB}MB</Text>
          {"\n"}
          {"\u2022"} Supported formats: <Text style={{ fontWeight: "bold" }}>JPG, PNG, WEBP</Text>
          {"\n\n"}
          <Text style={{ fontWeight: "bold", fontSize: 15, color: "#ff6f00" }}>
            ⚙️ Auto-Compression:
          </Text>
          {"\n"}
          <Text style={{ fontSize: 13, color: "#666" }}>
            Images larger than {IMAGE_SIZE_POLICY.MAX_SIZE_MB}MB will be automatically compressed.
          </Text>
        </Text>
      </Card>

      <View style={{ alignItems: "center", marginTop: 20, marginBottom: 50 }}>
        {/* ✅ Loading Indicator */}
        {isCompressing && (
          <View
            style={{
              backgroundColor: "#e3f2fd",
              borderLeftWidth: 4,
              borderLeftColor: "#2196f3",
              padding: 12,
              marginBottom: 15,
              borderRadius: 4,
              width: "90%",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ActivityIndicator size="small" color="#2196f3" />
            <Text style={{ color: "#1976d2", fontSize: 14, flex: 1 }}>
              Compressing image...
            </Text>
          </View>
        )}

        {formData.pictureID ? (
          <Image
            source={{ uri: formData.pictureID }}
            style={{ width: 300, height: 300, marginTop: 20, marginBottom: 20, borderRadius: 10 }}
          />
        ) : (
          <View
            style={{
              width: 300,
              height: 300,
              marginTop: 20,
              marginBottom: 20,
              borderWidth: 2,
              borderColor: "#ddd",
              borderStyle: "dashed",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              backgroundColor: "#fafafa",
            }}
          >
            <Text style={{ color: "#999", fontSize: 16 }}>📷 No Image Selected</Text>
          </View>
        )}

        {/* ✅ Error Message Display */}
        {error ? (
          <View
            style={{
              backgroundColor: "#ffebee",
              borderLeftWidth: 4,
              borderLeftColor: "#d32f2f",
              padding: 12,
              marginBottom: 15,
              borderRadius: 4,
              width: "90%",
            }}
          >
            <Text style={{ color: "#c62828", fontSize: 14, lineHeight: 20 }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button 
            title="Select Image" 
            onPress={selectImage} 
            fontSize={18}
            disabled={isCompressing}
          />
          <Button 
            title="Use this image" 
            fontSize={18} 
            onPress={handleSubmit}
            disabled={isCompressing || !formData.pictureID}
          />
        </View>
      </View>
    </ViewScroller>
  );
}