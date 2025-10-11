
// src/features/users/features/buyUsedCar/components/SortDropdown.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

interface SortOption {
  label: string;
  value: 'price_asc' | 'price_desc' | 'year_desc' | 'km_asc' | 'recent';
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Recently Added', value: 'recent' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Year: Newest First', value: 'year_desc' },
  { label: 'KM: Low to High', value: 'km_asc' },
];

interface SortDropdownProps {
  selectedSort: string;
  onSortChange: (sortBy: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  selectedSort,
  onSortChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = SORT_OPTIONS.find(opt => opt.value === selectedSort);

  const handleSelect = (value: string) => {
    onSortChange(value);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="swap-vertical" size={20} color={colors.primary} />
        <Text style={styles.buttonText}>
          {selectedOption?.label || 'Sort'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <FlatList
              data={SORT_OPTIONS}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === selectedSort && styles.optionTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === selectedSort && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
  },
  buttonText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
});