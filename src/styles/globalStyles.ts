import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Spacing } from './spacing';
import { Typography } from './typography';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: 10,
    marginVertical: Spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heading1: Typography.heading1,
  heading2: Typography.heading2,
  heading3: Typography.heading3,
  bodyText: Typography.body,
  smallText: Typography.small,
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    borderRadius: 8,
    marginVertical: Spacing.sm,
  },
  label: {               // ← Added this
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: Colors.text,   // assuming you have a Colors.text defined
  },
});
