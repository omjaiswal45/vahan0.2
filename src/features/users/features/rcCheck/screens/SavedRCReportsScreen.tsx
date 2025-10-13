// src/features/users/features/rcCheck/screens/SavedRCReportsScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '../../../../../styles/colors';
import { useRCCheck } from '../hooks/useRCCheck';
import { SavedRCCheck } from '../types';

interface SavedRCReportsScreenProps {
  navigation: any;
}

const SavedRCReportsScreen: React.FC<SavedRCReportsScreenProps> = ({ navigation }) => {
  const {
    savedReports,
    loadSavedReports,
    removeSavedReport,
    getFilteredSavedReports,
    setFilters,
    filters,
    loading,
    getReportById,
  } = useRCCheck();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSavedReports();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ searchQuery: query });
  };

  const handleSort = (sortBy: 'recent' | 'trust_score' | 'price') => {
    setFilters({ sortBy });
  };

  const handleDelete = (reportId: string) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeSavedReport(reportId),
        },
      ]
    );
  };

  const handleReportPress = async (reportId: string) => {
    await getReportById(reportId);
    navigation.navigate('RCCheckReport');
  };

  const filteredReports = getFilteredSavedReports();

  const renderItem = ({ item }: { item: SavedRCCheck }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => handleReportPress(item.id)}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportInfo}>
          <Text style={styles.regNumber}>{item.registrationNumber}</Text>
          <Text style={styles.vehicleName}>{item.vehicleName}</Text>
          <Text style={styles.checkDate}>
            Checked: {new Date(item.checkDate).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reportStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Trust Score</Text>
          <Text
            style={[
              styles.statValue,
              { color: getTrustScoreColor(item.trustScore) },
            ]}
          >
            {item.trustScore}/100
          </Text>
        </View>
        {item.estimatedPrice && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Est. Price</Text>
            <Text style={styles.statValue}>
              ₹{(item.estimatedPrice / 1000).toFixed(0)}K
            </Text>
          </View>
        )}
      </View>

      <View style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Full Report →</Text>
      </View>
    </TouchableOpacity>
  );

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return colors.green[600];
    if (score >= 60) return colors.amber[600];
    if (score >= 40) return colors.orange[600];
    return colors.red[600];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Reports</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by registration or vehicle"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              filters.sortBy === 'recent' && styles.sortButtonActive,
            ]}
            onPress={() => handleSort('recent')}
          >
            <Text
              style={[
                styles.sortButtonText,
                filters.sortBy === 'recent' && styles.sortButtonTextActive,
              ]}
            >
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              filters.sortBy === 'trust_score' && styles.sortButtonActive,
            ]}
            onPress={() => handleSort('trust_score')}
          >
            <Text
              style={[
                styles.sortButtonText,
                filters.sortBy === 'trust_score' && styles.sortButtonTextActive,
              ]}
            >
              Trust Score
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              filters.sortBy === 'price' && styles.sortButtonActive,
            ]}
            onPress={() => handleSort('price')}
          >
            <Text
              style={[
                styles.sortButtonText,
                filters.sortBy === 'price' && styles.sortButtonTextActive,
              ]}
            >
              Price
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      ) : filteredReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No saved reports</Text>
          <Text style={styles.emptySubtext}>
            Check vehicle RC to save reports
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('RCCheckHome')}
          >
            <Text style={styles.emptyButtonText}>Check New Vehicle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.blue[600],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gray[900],
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.gray[900],
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  sortButtonActive: {
    backgroundColor: colors.blue[600],
    borderColor: colors.blue[600],
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[700],
  },
  sortButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  regNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.blue[600],
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
  },
  checkDate: {
    fontSize: 12,
    color: colors.gray[600],
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 20,
  },
  reportStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray[600],
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray[900],
  },
  viewButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.blue[600],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.blue[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SavedRCReportsScreen;