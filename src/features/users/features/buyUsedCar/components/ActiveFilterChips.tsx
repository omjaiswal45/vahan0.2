// src/features/users/features/buyUsedCar/components/ActiveFilterChips.tsx

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CarFilters } from '../types';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

interface ActiveFilterChipsProps {
  filters: CarFilters;
  onRemoveFilter: (filterKey: keyof CarFilters, value?: any) => void;
  onClearAll: () => void;
}

interface FilterChip {
  id: string;
  label: string;
  filterKey: keyof CarFilters;
  value?: any;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const activeChips = useMemo((): FilterChip[] => {
    const chips: FilterChip[] = [];

    // Brands
    if (filters.brands && filters.brands.length > 0) {
      filters.brands.forEach(brand => {
        chips.push({
          id: `brand-${brand}`,
          label: brand,
          filterKey: 'brands',
          value: brand,
        });
      });
    }

    // Fuel Types
    if (filters.fuelTypes && filters.fuelTypes.length > 0) {
      filters.fuelTypes.forEach(fuel => {
        chips.push({
          id: `fuel-${fuel}`,
          label: fuel,
          filterKey: 'fuelTypes',
          value: fuel,
        });
      });
    }

    // Transmissions
    if (filters.transmissions && filters.transmissions.length > 0) {
      filters.transmissions.forEach(trans => {
        chips.push({
          id: `trans-${trans}`,
          label: trans,
          filterKey: 'transmissions',
          value: trans,
        });
      });
    }

    // Owner Numbers
    if (filters.ownerNumbers && filters.ownerNumbers.length > 0) {
      filters.ownerNumbers.forEach(owner => {
        chips.push({
          id: `owner-${owner}`,
          label: `${owner} Owner${owner > 1 ? 's' : ''}`,
          filterKey: 'ownerNumbers',
          value: owner,
        });
      });
    }

    // Price Range
    if (filters.priceMin || filters.priceMax) {
      const minPrice = filters.priceMin ? `${(filters.priceMin / 100000).toFixed(1)}L` : '0';
      const maxPrice = filters.priceMax ? `${(filters.priceMax / 100000).toFixed(1)}L` : '∞';
      chips.push({
        id: 'price-range',
        label: `₹${minPrice} - ₹${maxPrice}`,
        filterKey: 'priceMin',
      });
    }

    // Year Range
    if (filters.yearMin || filters.yearMax) {
      const minYear = filters.yearMin || 'Any';
      const maxYear = filters.yearMax || 'Latest';
      chips.push({
        id: 'year-range',
        label: `${minYear} - ${maxYear}`,
        filterKey: 'yearMin',
      });
    }

    // KM Driven
    if (filters.kmMax) {
      chips.push({
        id: 'km-max',
        label: `Max ${(filters.kmMax / 1000).toFixed(0)}k km`,
        filterKey: 'kmMax',
      });
    }

    // Cities
    if (filters.cities && filters.cities.length > 0) {
      filters.cities.forEach(city => {
        chips.push({
          id: `city-${city}`,
          label: city,
          filterKey: 'cities',
          value: city,
        });
      });
    }

    return chips;
  }, [filters]);

  if (activeChips.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeChips.map((chip) => (
          <TouchableOpacity
            key={chip.id}
            style={styles.chip}
            onPress={() => onRemoveFilter(chip.filterKey, chip.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipText} numberOfLines={1}>
              {chip.label}
            </Text>
            <Ionicons name="close" size={16} color={colors.primary} style={styles.closeIcon} />
          </TouchableOpacity>
        ))}

        {activeChips.length > 1 && (
          <TouchableOpacity
            style={styles.clearAllChip}
            onPress={onClearAll}
            activeOpacity={0.7}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    gap: spacing.xs,
    maxWidth: 150,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium as any,
  },
  closeIcon: {
    marginLeft: spacing.xs,
  },
  clearAllChip: {
    backgroundColor: colors.error + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.error + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearAllText: {
    fontSize: typography.sizes.sm,
    color: colors.error || '#EF4444',
    fontWeight: typography.weights.semibold as any,
  },
});
