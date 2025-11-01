// src/features/users/features/buyUsedCar/components/SortDropdown.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

const { height } = Dimensions.get('window');

interface SortOption {
  label: string;
  value: 'price_asc' | 'price_desc' | 'year_desc' | 'km_asc' | 'recent';
  icon: keyof typeof Ionicons.glyphMap;
  description?: string;
}

const SORT_OPTIONS: SortOption[] = [
  {
    label: 'Recently Added',
    value: 'recent',
    icon: 'time-outline',
    description: 'Latest listings first'
  },
  {
    label: 'Price: Low to High',
    value: 'price_asc',
    icon: 'trending-up-outline',
    description: 'Budget-friendly cars first'
  },
  {
    label: 'Price: High to Low',
    value: 'price_desc',
    icon: 'trending-down-outline',
    description: 'Premium cars first'
  },
  {
    label: 'Year: Newest First',
    value: 'year_desc',
    icon: 'calendar-outline',
    description: 'Latest models first'
  },
  {
    label: 'KM: Low to High',
    value: 'km_asc',
    icon: 'speedometer-outline',
    description: 'Least driven cars first'
  },
];

interface SortDropdownProps {
  selectedSort: string;
  onSortChange: (sortBy: string) => void;
  visible?: boolean;
  onClose?: () => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  selectedSort,
  onSortChange,
  visible = false,
  onClose,
}) => {
  const selectedOption = SORT_OPTIONS.find(opt => opt.value === selectedSort);

  const handleSelect = (value: string) => {
    onSortChange(value);
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
        statusBarTranslucent
        hardwareAccelerated
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.overlayTouchable}
              activeOpacity={1}
              onPress={handleClose}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.handleBar} />
                <Text style={styles.modalTitle}>Sort By</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={SORT_OPTIONS}
                keyExtractor={item => item.value}
              contentContainerStyle={styles.optionsList}
              renderItem={({ item }) => {
                const isActive = item.value === selectedSort;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isActive && styles.optionItemActive
                    ]}
                    onPress={() => handleSelect(item.value)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.iconContainer,
                      isActive && styles.iconContainerActive
                    ]}>
                      <Ionicons
                        name={item.icon}
                        size={22}
                        color={isActive ? colors.white : colors.primary}
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.optionText,
                          isActive && styles.optionTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.description && (
                        <Text style={styles.optionDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                    {isActive && (
                      <View style={styles.checkContainer}>
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
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
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
    paddingBottom: spacing.xl,
    width: '100%',
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.text,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.md,
    padding: spacing.xs,
  },
  optionsList: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.background || '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.border || '#E5E7EB',
    gap: spacing.md,
  },
  optionItemActive: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.primary,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.medium as any,
    marginBottom: 2,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.semibold as any,
  },
  optionDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  checkContainer: {
    marginLeft: spacing.sm,
  },
});