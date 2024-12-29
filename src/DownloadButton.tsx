import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

async function downloadImage(url: string) {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const fileUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
    const downloadResult = await FileSystem.downloadAsync(url, fileUri);

    await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
    alert("Image downloaded to your gallery!");
  } catch (error) {
    console.error("Error downloading image:", error);
    alert("Failed to download image.");
  }
}

export default function DownloadButton({ url }: { url: string }) {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => downloadImage(url)}
    >
      <Ionicons name="download-outline" size={24} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 50,
    padding: 12,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});
