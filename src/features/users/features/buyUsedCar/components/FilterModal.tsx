// src/features/users/features/buyUsedCar/components/FilterModal.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { CarFilters, FilterOptions } from '../types';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

const { height } = Dimensions.get('window');

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: CarFilters) => void;
  filterOptions: FilterOptions | null;
  currentFilters?: CarFilters;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  filterOptions,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<CarFilters>(currentFilters || {});

  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
  };

  const toggleArrayFilter = (key: keyof CarFilters, value: any) => {
    setFilters(prev => {
      const current = (prev[key] as any[]) || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter(v => v !== value) : [...current, value],
      };
    });
  };

  const isSelected = (key: keyof CarFilters, value: any): boolean => {
    const current = (filters[key] as any[]) || [];
    return current.includes(value);
  };

  if (!filterOptions) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.rangeValues}>
                <Text style={styles.rangeValue}>
                  ₹{((filters.priceMin || filterOptions.priceRange.min) / 100000).toFixed(1)}L
                </Text>
                <Text style={styles.rangeValue}>
                  ₹{((filters.priceMax || filterOptions.priceRange.max) / 100000).toFixed(1)}L
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={filterOptions.priceRange.min}
                maximumValue={filterOptions.priceRange.max}
                value={filters.priceMin || filterOptions.priceRange.min}
                onValueChange={value => setFilters(prev => ({ ...prev, priceMin: value }))}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
              />
              <Slider
                style={styles.slider}
                minimumValue={filterOptions.priceRange.min}
                maximumValue={filterOptions.priceRange.max}
                value={filters.priceMax || filterOptions.priceRange.max}
                onValueChange={value => setFilters(prev => ({ ...prev, priceMax: value }))}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
              />
            </View>

            {/* Brands */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Brands</Text>
              <View style={styles.chipContainer}>
                {filterOptions.brands.map(brand => (
                  <TouchableOpacity
                    key={brand.value}
                    style={[
                      styles.chip,
                      isSelected('brands', brand.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('brands', brand.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected('brands', brand.value) && styles.chipTextActive,
                      ]}
                    >
                      {brand.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Fuel Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fuel Type</Text>
              <View style={styles.chipContainer}>
                {filterOptions.fuelTypes.map(fuel => (
                  <TouchableOpacity
                    key={fuel.value}
                    style={[
                      styles.chip,
                      isSelected('fuelTypes', fuel.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('fuelTypes', fuel.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected('fuelTypes', fuel.value) && styles.chipTextActive,
                      ]}
                    >
                      {fuel.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Transmission */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transmission</Text>
              <View style={styles.chipContainer}>
                {filterOptions.transmissions.map(trans => (
                  <TouchableOpacity
                    key={trans.value}
                    style={[
                      styles.chip,
                      isSelected('transmissions', trans.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('transmissions', trans.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected('transmissions', trans.value) && styles.chipTextActive,
                      ]}
                    >
                      {trans.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Year Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Year</Text>
              <View style={styles.rangeValues}>
                <Text style={styles.rangeValue}>
                  {filters.yearMin || filterOptions.yearRange.min}
                </Text>
                <Text style={styles.rangeValue}>
                  {filters.yearMax || filterOptions.yearRange.max}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={filterOptions.yearRange.min}
                maximumValue={filterOptions.yearRange.max}
                step={1}
                value={filters.yearMin || filterOptions.yearRange.min}
                onValueChange={value => setFilters(prev => ({ ...prev, yearMin: value }))}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
              />
              <Slider
                style={styles.slider}
                minimumValue={filterOptions.yearRange.min}
                maximumValue={filterOptions.yearRange.max}
                step={1}
                value={filters.yearMax || filterOptions.yearRange.max}
                onValueChange={value => setFilters(prev => ({ ...prev, yearMax: value }))}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
              />
            </View>

            {/* KM Driven */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Max KM Driven</Text>
              <Text style={styles.rangeValue}>
                {((filters.kmMax || filterOptions.kmRange.max) / 1000).toFixed(0)}k km
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={filterOptions.kmRange.min}
                maximumValue={filterOptions.kmRange.max}
                step={1000}
                value={filters.kmMax || filterOptions.kmRange.max}
                onValueChange={value => setFilters(prev => ({ ...prev, kmMax: value }))}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
              />
            </View>

            {/* Owner Number */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Number of Owners</Text>
              <View style={styles.chipContainer}>
                {filterOptions.ownerNumbers.map(owner => (
                  <TouchableOpacity
                    key={owner.value}
                    style={[
                      styles.chip,
                      isSelected('ownerNumbers', owner.value) && styles.chipActive,
                    ]}
                    onPress={() => toggleArrayFilter('ownerNumbers', owner.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected('ownerNumbers', owner.value) && styles.chipTextActive,
                      ]}
                    >
                      {owner.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: typography.weights.semibold as any,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  rangeValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  resetText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.primary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.white,
  },
});