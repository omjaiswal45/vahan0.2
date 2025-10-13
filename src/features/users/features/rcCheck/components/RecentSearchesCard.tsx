// src/features/users/features/rcCheck/components/RecentSearchesCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../../../styles/colors';

interface RecentSearchesCardProps {
  searches: string[];
  onSearchPress: (regNumber: string) => void;
  onClearAll: () => void;
}

const RecentSearchesCard: React.FC<RecentSearchesCardProps> = ({
  searches,
  onSearchPress,
  onClearAll,
}) => {
  if (searches.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🕐 Recent Searches</Text>
        <TouchableOpacity onPress={onClearAll}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchesList}>
        {searches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.searchItem}
            onPress={() => onSearchPress(search)}
          >
            <View style={styles.searchContent}>
              <Text style={styles.searchIcon}>🔍</Text>
              <Text style={styles.searchText}>{search}</Text>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: colors.gray[900],
  },
  clearButton: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.blue[600],
  },
  searchesList: {
    gap: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 10,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray[900],
    letterSpacing: 0.5,
  },
  arrowIcon: {
    fontSize: 16,
    color: colors.gray[400],
  },
});

export default RecentSearchesCard;