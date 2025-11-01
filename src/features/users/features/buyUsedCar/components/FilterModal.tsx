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
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { CarFilters, FilterOptions } from '../types';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

const { height, width } = Dimensions.get('window');

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: CarFilters) => void;
  filterOptions: FilterOptions | null;
  currentFilters?: CarFilters;
}

// Quick price filter presets
const PRICE_PRESETS = [
  { label: 'Under 3L', min: 0, max: 300000 },
  { label: '3L - 5L', min: 300000, max: 500000 },
  { label: '5L - 8L', min: 500000, max: 800000 },
  { label: '8L - 12L', min: 800000, max: 1200000 },
  { label: 'Above 12L', min: 1200000, max: 50000000 },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  filterOptions,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<CarFilters>(currentFilters || {});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['price', 'brand', 'fuel', 'transmission'])
  );

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const setPricePreset = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.brands?.length) count += filters.brands.length;
    if (filters.fuelTypes?.length) count += filters.fuelTypes.length;
    if (filters.transmissions?.length) count += filters.transmissions.length;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.yearMin || filters.yearMax) count++;
    if (filters.kmMax) count++;
    if (filters.ownerNumbers?.length) count += filters.ownerNumbers.length;
    return count;
  };

  if (!filterOptions) return null;

  const renderSection = (
    title: string,
    sectionKey: string,
    content: React.ReactNode,
    icon: keyof typeof Ionicons.glyphMap
  ) => {
    const isExpanded = expandedSections.has(sectionKey);
    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionTitleContainer}>
            <Ionicons name={icon} size={20} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        {isExpanded && <View style={styles.sectionContent}>{content}</View>}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      hardwareAccelerated
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <View style={styles.handleBar} />
              <View style={styles.headerContent}>
                <Text style={styles.title}>Filters</Text>
                {getActiveFiltersCount() > 0 && (
                  <View style={styles.activeCountBadge}>
                    <Text style={styles.activeCountText}>{getActiveFiltersCount()}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={26} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Price Range Section */}
            {renderSection(
              'Price Range',
              'price',
              <>
                {/* Quick Price Presets */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.presetsScroll}
                >
                  {PRICE_PRESETS.map((preset) => (
                    <TouchableOpacity
                      key={preset.label}
                      style={[
                        styles.presetChip,
                        filters.priceMin === preset.min &&
                          filters.priceMax === preset.max &&
                          styles.presetChipActive,
                      ]}
                      onPress={() => setPricePreset(preset.min, preset.max)}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          filters.priceMin === preset.min &&
                            filters.priceMax === preset.max &&
                            styles.presetChipTextActive,
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Custom Price Range */}
                <View style={styles.customRangeContainer}>
                  <View style={styles.rangeInputRow}>
                    <View style={styles.rangeInputContainer}>
                      <Text style={styles.rangeInputLabel}>Min</Text>
                      <Text style={styles.rangeInputValue}>
                        ₹{((filters.priceMin || filterOptions.priceRange.min) / 100000).toFixed(1)}L
                      </Text>
                    </View>
                    <View style={styles.rangeDivider} />
                    <View style={styles.rangeInputContainer}>
                      <Text style={styles.rangeInputLabel}>Max</Text>
                      <Text style={styles.rangeInputValue}>
                        ₹{((filters.priceMax || filterOptions.priceRange.max) / 100000).toFixed(1)}L
                      </Text>
                    </View>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={filterOptions.priceRange.min}
                    maximumValue={filterOptions.priceRange.max}
                    value={filters.priceMin || filterOptions.priceRange.min}
                    onValueChange={value => setFilters(prev => ({ ...prev, priceMin: Math.floor(value) }))}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border || '#E5E7EB'}
                    thumbTintColor={colors.primary}
                  />
                  <Slider
                    style={styles.slider}
                    minimumValue={filterOptions.priceRange.min}
                    maximumValue={filterOptions.priceRange.max}
                    value={filters.priceMax || filterOptions.priceRange.max}
                    onValueChange={value => setFilters(prev => ({ ...prev, priceMax: Math.floor(value) }))}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border || '#E5E7EB'}
                    thumbTintColor={colors.primary}
                  />
                </View>
              </>,
              'pricetag-outline'
            )}

            {/* Brands Section */}
            {renderSection(
              'Brands',
              'brand',
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
                    {isSelected('brands', brand.value) && (
                      <Ionicons name="checkmark" size={16} color={colors.white} style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>,
              'car-sport-outline'
            )}

            {/* Fuel Type Section */}
            {renderSection(
              'Fuel Type',
              'fuel',
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
                    {isSelected('fuelTypes', fuel.value) && (
                      <Ionicons name="checkmark" size={16} color={colors.white} style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>,
              'flash-outline'
            )}

            {/* Transmission Section */}
            {renderSection(
              'Transmission',
              'transmission',
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
                    {isSelected('transmissions', trans.value) && (
                      <Ionicons name="checkmark" size={16} color={colors.white} style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>,
              'settings-outline'
            )}

            {/* Year Range Section */}
            {renderSection(
              'Manufacturing Year',
              'year',
              <View style={styles.rangeContainer}>
                <View style={styles.rangeInputRow}>
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeInputLabel}>From</Text>
                    <Text style={styles.rangeInputValue}>
                      {filters.yearMin || filterOptions.yearRange.min}
                    </Text>
                  </View>
                  <View style={styles.rangeDivider} />
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeInputLabel}>To</Text>
                    <Text style={styles.rangeInputValue}>
                      {filters.yearMax || filterOptions.yearRange.max}
                    </Text>
                  </View>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={filterOptions.yearRange.min}
                  maximumValue={filterOptions.yearRange.max}
                  step={1}
                  value={filters.yearMin || filterOptions.yearRange.min}
                  onValueChange={value => setFilters(prev => ({ ...prev, yearMin: Math.floor(value) }))}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.border || '#E5E7EB'}
                  thumbTintColor={colors.primary}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={filterOptions.yearRange.min}
                  maximumValue={filterOptions.yearRange.max}
                  step={1}
                  value={filters.yearMax || filterOptions.yearRange.max}
                  onValueChange={value => setFilters(prev => ({ ...prev, yearMax: Math.floor(value) }))}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.border || '#E5E7EB'}
                  thumbTintColor={colors.primary}
                />
              </View>,
              'calendar-outline'
            )}

            {/* KM Driven Section */}
            {renderSection(
              'KM Driven',
              'km',
              <View style={styles.rangeContainer}>
                <Text style={styles.kmValue}>
                  Up to {((filters.kmMax || filterOptions.kmRange.max) / 1000).toFixed(0)}k km
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={filterOptions.kmRange.min}
                  maximumValue={filterOptions.kmRange.max}
                  step={5000}
                  value={filters.kmMax || filterOptions.kmRange.max}
                  onValueChange={value => setFilters(prev => ({ ...prev, kmMax: Math.floor(value) }))}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.border || '#E5E7EB'}
                  thumbTintColor={colors.primary}
                />
              </View>,
              'speedometer-outline'
            )}

            {/* Owner Number Section */}
            {renderSection(
              'Number of Owners',
              'owner',
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
                    {isSelected('ownerNumbers', owner.value) && (
                      <Ionicons name="checkmark" size={16} color={colors.white} style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>,
              'person-outline'
            )}
          </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Ionicons name="refresh-outline" size={20} color={colors.primary} />
                <Text style={styles.resetText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyText}>
                  Show Results {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    width: '100%',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#E5E7EB',
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border || '#E5E7EB',
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.text,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.md + 8,
    padding: spacing.xs,
  },
  activeCountBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  activeCountText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold as any,
  },
  content: {
    maxHeight: height * 0.9 - 180, // Account for header and footer height
  },
  section: {
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background || '#FAFAFA',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.text,
  },
  sectionContent: {
    padding: spacing.lg,
  },
  presetsScroll: {
    marginBottom: spacing.md,
  },
  presetChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border || '#E5E7EB',
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  presetChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetChipText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium as any,
  },
  presetChipTextActive: {
    color: colors.white,
    fontWeight: typography.weights.semibold as any,
  },
  customRangeContainer: {
    marginTop: spacing.sm,
  },
  rangeContainer: {
    marginTop: spacing.sm,
  },
  rangeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rangeInputContainer: {
    flex: 1,
    backgroundColor: colors.background || '#F9FAFB',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border || '#E5E7EB',
  },
  rangeDivider: {
    width: 20,
    height: 2,
    backgroundColor: colors.border || '#E5E7EB',
    marginHorizontal: spacing.sm,
  },
  rangeInputLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: typography.weights.medium as any,
  },
  rangeInputValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.primary,
  },
  kmValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border || '#E5E7EB',
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium as any,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: typography.weights.semibold as any,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#E5E7EB',
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    gap: spacing.xs,
  },
  resetText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.primary,
  },
  applyButton: {
    flex: 2,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  applyText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.white,
  },
});