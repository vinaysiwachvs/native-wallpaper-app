import React from "react";
import { View, Dimensions } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import DownloadButton from "./DownloadButton";

const { width } = Dimensions.get("screen");
const _imageWidth = width * 0.7;
const _imageHeight = _imageWidth * 1.76;

export default function Photo({
  item,
  index,
  scrollX,
}: {
  item: Photo;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [1.6, 1, 1.6]
          ),
        },
      ],
    };
  });

  return (
    <View
      style={{
        width: _imageWidth,
        height: _imageHeight,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Animated.Image
        source={{ uri: item.src.large }}
        style={[{ flex: 1 }, stylez]}
      />
      <DownloadButton url={item.src.original} />
    </View>
  );
}
