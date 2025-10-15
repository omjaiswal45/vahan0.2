// src/features/users/features/buyUsedCar/components/SearchBar.tsx

import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
  activeFiltersCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterPress,
  placeholder = 'Search cars by brand, model...',
  activeFiltersCount = 0,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch(query);
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused
      ]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Ionicons name="options-outline" size={24} color={colors.primary} />
        {activeFiltersCount > 0 && (
          <View style={styles.badge}>
            <Ionicons name="ellipse" size={8} color={colors.error} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border || '#E5E7EB',
  },
  searchContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.white,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border || '#E5E7EB',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});