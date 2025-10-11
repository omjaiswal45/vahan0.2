import { TextStyle } from 'react-native';
import { Colors } from './colors';

interface FontFamily {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
}

interface FontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

interface FontWeights {
  regular: TextStyle['fontWeight'];
  medium: TextStyle['fontWeight'];
  semibold: TextStyle['fontWeight'];
  bold: TextStyle['fontWeight'];
}

interface TypographyStyles {
  fontFamily: FontFamily;
  sizes: FontSizes;
  weights: FontWeights;
  heading1: TextStyle;
  heading2: TextStyle;
  heading3: TextStyle;
  body: TextStyle;
  small: TextStyle;
}

export const Typography: TypographyStyles = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  heading1: { fontSize: 26, fontWeight: 'bold', color: Colors.text },
  heading2: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  heading3: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  body: { fontSize: 16, color: Colors.text },
  small: { fontSize: 14, color: Colors.textSecondary },
};

// Backward compatible alias
export const typography = Typography;