export const Colors = {
  // Brand Colors - Vibrant Pink (kept as requested)
  // Using your primary as the base, created proper tints and shades
  primary: '#ff1ea5',        // Base - Vibrant magenta-pink
  primaryLight: '#ff52b8',   // 30% lighter - Better contrast
  primaryLighter: '#ff8fce', // 50% lighter - Soft accents
  primaryDark: '#cc1884',    // 20% darker - Hover states
  primaryDarker: '#99125e',  // 40% darker - Pressed states
  secondary: '#7c3aed',      // Complementary purple - Better harmony

  // Surface & Background - Improved neutrals
  background: '#fafafa',     // Slightly warmer white
  card: '#ffffff',           // Pure white for contrast
  surface: '#f8f9fa',        // Subtle gray with warmth

  // Text Colors - Better readability
  text: '#1a1a1a',          // Near black - Better contrast
  textSecondary: '#6b7280',  // Mid gray - More readable

  // Utility
  border: '#e5e7eb',         // Softer, modern gray
  black: '#000000',
  white: '#ffffff',

  // State Colors - Semantically meaningful
  success: '#10b981',        // Emerald green - universally recognized
  successLight: '#d1fae5',   // Tint for backgrounds
  warning: '#f59e0b',        // Amber - attention without alarm
  warningLight: '#fef3c7',   // Subtle warning background
  error: '#ef4444',          // Red - clear danger signal
  errorLight: '#fee2e2',     // Error background
  info: '#3b82f6',           // Blue - informational
  infoLight: '#dbeafe',   
  result: '#5c53feff',  // Info background

  // UI Elements
  shadow: '#000000',
  disabled: '#d8dbe0ff',

  // Extended Gray Scale - For sophisticated UI depth
  gray: {
    50: '#f9fafb',   // Almost white
    100: '#f3f4f6',  // Very light
    200: '#e5e7eb',  // Light borders
    300: '#d1d5db',  // Disabled states
    400: '#9ca3af',  // Placeholder text
    500: '#6b7280',  // Secondary text
    600: '#4b5563',  // Muted text
    700: '#374151',  // Dark text
    800: '#1f2937',  // Very dark
    900: '#111827',  // Near black
  },

  // Blue Scale - Trust, professionalism
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },

  // Green Scale - Success, positive actions
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },

  // Red Scale - Errors, destructive actions
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Amber Scale - Warnings, caution
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  // Orange Scale - Highlight, energy
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
  },

  // Yellow Scale - Attention, emphasis
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fde047',
    500: '#eab308',
  },

  // Purple Scale - Premium, creative
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
  },

  // Pink Scale - Based on your primary brand color
  pink: {
    50: '#fff1f9',
    100: '#ffe4f3',
    200: '#ffcce8',
    500: '#ff1ea5',  // Your primary
    600: '#cc1884',
    700: '#99125e',
  },
};

// Backward compatible aliases for existing imports
export const colors = Colors;

// Semantic color mappings for easier usage
export const SemanticColors = {
  // Feedback colors
  positive: Colors.green[500],
  negative: Colors.red[500],
  cautionary: Colors.amber[500],
  informative: Colors.blue[500],

  // Interactive states
  hover: Colors.gray[100],
  active: Colors.primary,
  focus: Colors.blue[500],
  
  // Text hierarchy
  textPrimary: Colors.text,
  textSecondary: Colors.textSecondary,
  textTertiary: Colors.gray[400],
  textDisabled: Colors.gray[300],

  // Backgrounds
  bgPrimary: Colors.background,
  bgSecondary: Colors.surface,
  bgElevated: Colors.card,
  bgOverlay: 'rgba(0, 0, 0, 0.5)',
};

export default Colors;