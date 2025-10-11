// src/features/users/features/buyUsedCar/components/QuickFilters.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

interface QuickFilter {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  value: any;
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  selectedFilters: string[];
  onFilterPress: (filterId: string, value: any) => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  filters,
  selectedFilters,
  onFilterPress,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map(filter => {
        const isSelected = selectedFilters.includes(filter.id);
        return (
          <TouchableOpacity
            key={filter.id}
            style={[styles.chip, isSelected && styles.chipActive]}
            onPress={() => onFilterPress(filter.id, filter.value)}
            activeOpacity={0.7}
          >
            {filter.icon && (
              <Ionicons
                name={filter.icon}
                size={16}
                color={isSelected ? colors.white : colors.text}
                style={styles.icon}
              />
            )}
            <Text style={[styles.label, isSelected && styles.labelActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// Predefined quick filters
export const QUICK_FILTERS: QuickFilter[] = [
  {
    id: 'budget',
    label: 'Budget Friendly',
    icon: 'cash-outline',
    value: { priceMax: 500000 },
  },
  {
    id: 'automatic',
    label: 'Automatic',
    icon: 'cog-outline',
    value: { transmissions: ['Automatic'] },
  },
  {
    id: 'petrol',
    label: 'Petrol',
    icon: 'water-outline',
    value: { fuelTypes: ['Petrol'] },
  },
  {
    id: 'low-km',
    label: 'Low KM',
    icon: 'speedometer-outline',
    value: { kmMax: 50000 },
  },
  {
    id: 'recent',
    label: 'Latest Models',
    icon: 'calendar-outline',
    value: { yearMin: new Date().getFullYear() - 3 },
  },
  {
    id: 'first-owner',
    label: '1st Owner',
    icon: 'person-outline',
    value: { ownerNumbers: [1] },
  },
];

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  labelActive: {
    color: colors.white,
  },
});