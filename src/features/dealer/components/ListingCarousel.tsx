import React, { useRef, useState, useEffect } from "react";
import { View, Image, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent, PanResponder } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ListingCarouselProps {
  images: string[];
  autoplay?: boolean; // autoplay only for top visible cards
  height?: number; // optional custom height
  fullScreen?: boolean; // for detail screens - larger height
}

const ListingCarousel: React.FC<ListingCarouselProps> = ({
  images,
  autoplay = false,
  height,
  fullScreen = false
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(SCREEN_WIDTH);
  const flatListRef = useRef<FlatList>(null);
  const autoplayRef = useRef<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Dynamic height calculation
  const carouselHeight = height
    ? height
    : fullScreen
      ? SCREEN_WIDTH * 0.75 // 4:3 aspect ratio for detail screens
      : SCREEN_WIDTH * 0.5; // Smaller for card views

  // Autoplay effect
  useEffect(() => {
    if (!autoplay || images.length === 0 || isInteracting) {
      if (autoplayRef.current !== null) clearInterval(autoplayRef.current);
      return;
    }

    autoplayRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000) as unknown as number; // <-- type cast to number

    return () => {
      if (autoplayRef.current !== null) clearInterval(autoplayRef.current);
    };
  }, [activeIndex, autoplay, images, isInteracting]);

  // Update active index on scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
    setActiveIndex(index);
  };

  // Handle user touch/hold to pause autoplay
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        setIsInteracting(true);
        return false;
      },
      onPanResponderRelease: () => setIsInteracting(false),
      onPanResponderTerminate: () => setIsInteracting(false),
    })
  ).current;

  return (
    <View
      style={{ width: "100%" }}
      onLayout={(e) => setCarouselWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{
              width: carouselWidth,
              height: carouselHeight,
              borderRadius: fullScreen ? 0 : 12
            }}
            resizeMode="cover"
          />
        )}
      />

      {/* Dots */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 8 }}>
        {images.map((_, idx) => (
          <View
            key={idx}
            style={{
              width: activeIndex === idx ? 10 : 6,
              height: activeIndex === idx ? 10 : 6,
              borderRadius: 5,
              backgroundColor: activeIndex === idx ? "#1E90FF" : "#ccc",
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default ListingCarousel;
