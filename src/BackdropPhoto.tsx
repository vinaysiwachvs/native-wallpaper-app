import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function BackdropPhoto({
  photo,
  index,
  scrollX,
}: {
  photo: Photo;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0, 1, 0]
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: photo.src.large }}
        style={[StyleSheet.absoluteFillObject, animatedStyle]}
        blurRadius={30}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Wallpaper Application</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});
