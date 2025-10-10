// src/features/users/features/profile/screens/MyListingsScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../hooks/useProfile';
import { CarListing as UserListing } from '../types';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

export const MyListingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    myListings: userListings,
    fetchUserListings,
    updateListingStatus,
    deleteListing,
    refreshing,
    refreshData,
  } = useProfile();

  const [filter, setFilter] = useState<'all' | 'active' | 'sold' | 'inactive'>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadListings();
  }, [filter]);

  const loadListings = async () => {
    try {
      const statusFilter = filter === 'all' ? undefined : filter;
      await fetchUserListings();
      setPage(1);
    } catch (error) {
      console.error('Failed to load listings:', error);
    }
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const statusFilter = filter === 'all' ? undefined : filter;
      await fetchUserListings();
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more:', error);
    }
  };

  const handleStatusChange = (listingId: string, currentStatus: string) => {
    const options = [
      { text: 'Active', value: 'active' as const },
      { text: 'Mark as Sold', value: 'sold' as const },
      { text: 'Mark as Inactive', value: 'inactive' as const },
    ].filter(option => option.value !== currentStatus);

    Alert.alert(
      'Change Status',
      'Select new status',
      [
        ...options.map(option => ({
          text: option.text,
          onPress: () => updateListingStatus(listingId, option.value),
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDelete = (listingId: string, carName: string) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete ${carName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteListing(listingId),
        },
      ]
    );
  };

  const handleEdit = (listingId: string) => {
    navigation.navigate('EditListing' as never, { id: listingId } as never);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'sold':
        return colors.primary;
      case 'inactive':
        return colors.textSecondary;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const renderListingCard = ({ item }: { item: UserListing }) => {
    const carName = `${item.brand} ${item.model}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ListingDetail' as never, { id: item.id } as never)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.images[0] }}
          style={styles.carImage}
          resizeMode="cover"
        />

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.carName} numberOfLines={1}>
            {carName}
          </Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{item.year}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{item.kmDriven.toLocaleString()} km</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{item.views} views</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{item.leads} leads</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(item.id)}
              >
                <Ionicons name="create-outline" size={18} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.statusButton]}
                onPress={() => handleStatusChange(item.id, item.status)}
              >
                <Ionicons name="swap-horizontal-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id, carName)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Listings Found</Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'all'
          ? 'Start selling your car by creating a new listing'
          : `No ${filter} listings found`}
      </Text>
      {filter === 'all' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddListing' as never)}
        >
          <Text style={styles.addButtonText}>Create Listing</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilterButton = (
    label: string,
    value: 'all' | 'active' | 'sold' | 'inactive'
  ) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[styles.filterText, filter === value && styles.filterTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('All', 'all')}
        {renderFilterButton('Active', 'active')}
        {renderFilterButton('Sold', 'sold')}
        {renderFilterButton('Inactive', 'inactive')}
      </View>

      {/* Listings */}
      <FlatList
        data={userListings}
        renderItem={renderListingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
    backgroundColor: colors.background,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  cardContent: {
    padding: spacing.md,
  },
  carName: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.primary + '15',
  },
  statusButton: {
    backgroundColor: colors.textSecondary + '15',
  },
  deleteButton: {
    backgroundColor: colors.error + '15',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});