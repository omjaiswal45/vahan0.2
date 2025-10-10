import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const Typography: { [key: string]: TextStyle | any } = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  heading1: { fontSize: 26, fontWeight: 'bold', color: Colors.text },
  heading2: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  heading3: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  body: { fontSize: 16, color: Colors.text },
  small: { fontSize: 14, color: Colors.textSecondary },
};

// Backward compatible alias
export const typography = Typography;
