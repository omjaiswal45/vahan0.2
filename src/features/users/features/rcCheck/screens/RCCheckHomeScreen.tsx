// src/features/users/features/rcCheck/screens/RCCheckHomeScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../../../../styles/colors';
import { useRCCheck } from '../hooks/useRCCheck';
import RCSearchInput from '../components/RCSearchInput';

interface RCCheckHomeScreenProps {
  navigation: any;
}

const RCCheckHomeScreen: React.FC<RCCheckHomeScreenProps> = ({ navigation }) => {
  const { checkRC, recentSearches, clearRecent, loading } = useRCCheck();

  const handleSearch = async (regNumber: string) => {
    try {
      const result = await checkRC({
        registrationNumber: regNumber,
        includeHistory: true,
        includeInspection: true,
        includePriceEstimation: true,
      });
      
      if (result.type.includes('fulfilled')) {
        navigation.navigate('RCCheckReport');
      }
    } catch (error) {
      console.error('Error checking RC:', error);
    }
  };

  const handleRecentSearch = (regNumber: string) => {
    handleSearch(regNumber);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🚗 RC Check</Text>
          <Text style={styles.headerSubtitle}>
            Complete vehicle history & analysis
          </Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <RCSearchInput onSearch={handleSearch} loading={loading} />
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You'll Get</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon="📄"
              title="Vehicle Details"
              description="Complete registration info"
            />
            <FeatureCard
              icon="💰"
              title="Price Estimation"
              description="Fair market value"
            />
            <FeatureCard
              icon="🔍"
              title="Inspection Report"
              description="Detailed condition check"
            />
            <FeatureCard
              icon="⚠️"
              title="Warnings & Alerts"
              description="Challans, theft, blacklist"
            />
            <FeatureCard
              icon="📊"
              title="Trust Score"
              description="Overall vehicle rating"
            />
            <FeatureCard
              icon="📈"
              title="History Report"
              description="Ownership & service"
            />
          </View>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearRecent}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentList}>
              {recentSearches.map((regNumber: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => handleRecentSearch(regNumber)}
                >
                  <Text style={styles.recentIcon}>🔍</Text>
                  <Text style={styles.recentText}>{regNumber}</Text>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SavedRCReports')}
          >
            <Text style={styles.actionIcon}>💾</Text>
            <Text style={styles.actionText}>Saved Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 How it Works</Text>
          <View style={styles.infoSteps}>
            <InfoStep number="1" text="Enter vehicle registration number" />
            <InfoStep number="2" text="Get instant RC verification" />
            <InfoStep number="3" text="Review detailed report" />
            <InfoStep number="4" text="Save for future reference" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <View style={styles.featureCard}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const InfoStep = ({ number, text }: any) => (
  <View style={styles.infoStep}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <Text style={styles.stepText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.gray[600],
    fontWeight: '500',
  },
  searchSection: {
    marginBottom: 32,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  recentIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  recentText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray[900],
    letterSpacing: 0.5,
  },
  arrowIcon: {
    fontSize: 16,
    color: colors.gray[400],
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  infoSection: {
    backgroundColor: colors.primaryLighter,
    borderRadius: 12,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 16,
  },
  infoSteps: {
    gap: 12,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[700],
    fontWeight: '500',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 11,
    color: colors.gray[600],
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 32,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  recentList: {
    gap: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});

export default RCCheckHomeScreen;