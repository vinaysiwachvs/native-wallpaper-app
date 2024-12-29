import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Dimensions,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import BackdropPhoto from "./BackdropPhoto";
import Photo from "./Photo";

const uri = process.env.EXPO_PUBLIC_API_URL;
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

const { width } = Dimensions.get("screen");
const _imageWidth = width * 0.7;
const _spacing = 12;

export default function PixelWallpapers() {
  const { data, isLoading } = useQuery<SearchPayload>({
    queryKey: ["wallpapers"],
    queryFn: async () => {
      const res = await fetch(uri, {
        headers: {
          Authorization: apiKey,
        },
      }).then((res) => res.json());
      return res;
    },
  });

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (_imageWidth + _spacing);
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        {data?.photos.map((photo, index) => (
          <BackdropPhoto
            photo={photo}
            index={index}
            scrollX={scrollX}
            key={index}
          />
        ))}
      </View>
      <Animated.FlatList
        data={data?.photos}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={_imageWidth + _spacing}
        decelerationRate="fast"
        contentContainerStyle={{
          gap: _spacing,
          paddingHorizontal: (width - _imageWidth) / 2,
        }}
        style={{ flexGrow: 0 }}
        renderItem={({ item, index }) => {
          return <Photo item={item} index={index} scrollX={scrollX} />;
        }}
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60} //16.6ms
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
