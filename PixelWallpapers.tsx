import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const uri = process.env.EXPO_PUBLIC_API_URL;
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

type SearchPayload = {
  total_results: number;
  page: number;
  per_page: number;
  photos: Photo[];
};

type Photo = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_id: string;
  photographer_url: string;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    protrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
};

const { width } = Dimensions.get("screen");

const _imageWidth = width * 0.7;
const _imageHeight = _imageWidth * 1.76;
const _spacing = 12;

function Photo({
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
      }}
    >
      <Animated.Image
        source={{ uri: item.src.large }}
        style={[{ flex: 1 }, stylez]}
      />
    </View>
  );
}

function BackdropPhoto({
  photo,
  index,
  scrollX,
}: {
  photo: Photo;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0, 1, 0]
      ),
    };
  });
  return (
    <Animated.Image
      source={{ uri: photo.src.large }}
      style={[StyleSheet.absoluteFillObject, stylez]}
      blurRadius={30}
    />
  );
}

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
