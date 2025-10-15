// src/features/users/features/challanCheck/components/RecentChallanSearchesCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../../../../styles';

interface RecentChallanSearchesCardProps {
  searches: string[];
  onSearchSelect: (registrationNumber: string) => void;
  onClearAll?: () => void;
}

export const RecentChallanSearchesCard: React.FC<RecentChallanSearchesCardProps> = ({
  searches,
  onSearchSelect,
  onClearAll,
}) => {
  if (searches.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Searches</Text>
        {onClearAll && (
          <TouchableOpacity onPress={onClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.searchList}>
        {searches.map((search, index) => (
          <TouchableOpacity
            key={`${search}-${index}`}
            style={styles.searchChip}
            onPress={() => onSearchSelect(search)}
          >
            <Text style={styles.searchText}>{search}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  searchList: {
    gap: 8,
  },
  searchChip: {
    backgroundColor: colors.result,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.text,
  },
  searchText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
  },
});