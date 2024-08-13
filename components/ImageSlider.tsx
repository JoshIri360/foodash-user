import React, { useRef, useState } from "react";
import { View, FlatList, Image, Dimensions } from "react-native";

const ImageSlider = ({ images }: { images: string[] }) => {
  const flatListRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  const onLayout = (event: {
    nativeEvent: { layout: { width: number; height: number } };
  }) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{
              width: containerDimensions.width * 0.3,
              height: containerDimensions.height,
              marginRight: containerDimensions.width * 0.05,
              borderRadius: 8,
              backgroundColor: "white",
            }}
          />
        )}
        keyExtractor={(imageUrl, index) => "key-" + index}
        pagingEnabled
      />
    </View>
  );
};

export default ImageSlider;
