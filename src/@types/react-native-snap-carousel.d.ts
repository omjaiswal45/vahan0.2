declare module 'react-native-snap-carousel' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  interface CarouselProps<T> {
    data: T[];
    renderItem: (item: { item: T; index: number }) => JSX.Element;
    sliderWidth: number;
    itemWidth: number;
    loop?: boolean;
    autoplay?: boolean;
    onSnapToItem?: (index: number) => void;
    ref?: any;
    containerCustomStyle?: ViewStyle;
    contentContainerCustomStyle?: ViewStyle;
  }

  export default class Carousel<T = any> extends Component<CarouselProps<T>> {}
}
