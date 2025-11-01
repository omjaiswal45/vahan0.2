import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useChallanCheck } from '../hooks/useChallanCheck';
import { ChallanHeroCard } from '../components/ChallanHeroCard';
import { ChallanSearchInput } from '../components/ChallanSearchInput';
import { RecentChallanSearchesCard } from '../components/RecentChallanSearchesCard';
import { colors } from '../../../../../styles';
import VehicleNumberModal from '../../../../../components/VehicleNumberModal';
import { useVehicleNumber } from '../../../../../hooks/useVehicleNumber';


interface ChallanCheckHomeScreenProps {
  navigation: any;
}

export const ChallanCheckHomeScreen: React.FC<ChallanCheckHomeScreenProps> = ({ navigation }) => {
  const {
    isLoading,
    recentSearches,
    searchChallan,
    clearAllSearches,
  } = useChallanCheck();
  const {
    vehicleNumber,
    shouldShowModal,
    saveVehicleNumber,
    skipForNow,
  } = useVehicleNumber();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('SavedChallanReports')}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Text style={styles.headerButtonText}>💾 Saved</Text>
        </TouchableOpacity>
      ),
      headerTitle: 'Challan Checker',
    });
  }, [navigation]);

  useEffect(() => {
    // Show modal when screen is focused and vehicle number is not set
    if (shouldShowModal()) {
      setShowModal(true);
    }
  }, []);

  const handleVehicleNumberSubmit = (number: string) => {
    saveVehicleNumber(number);
    setShowModal(false);
    // Optionally auto-search with the saved number
    handleSearch(number);
  };

  const handleSkip = () => {
    skipForNow();
    setShowModal(false);
  };

  const handleSearch = async (registrationNumber: string) => {
    if (!registrationNumber.trim()) return;
    try {
      const startTime = Date.now();
      const data = await searchChallan({ registrationNumber });
      const duration = Date.now() - startTime;
      // Minimal artificial delay to avoid flicker if response is <300ms
      if (duration < 300) await new Promise(res => setTimeout(res, 300 - duration));
      navigation.navigate('ChallanCheckReport', { registrationNumber });
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch challan data. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleRecentSearchSelect = (registrationNumber: string) => handleSearch(registrationNumber);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Section */}
          <ChallanHeroCard />

          {/* Search Section */}
          <View style={styles.searchSection}>
            <ChallanSearchInput
              onSearch={handleSearch}
              isLoading={isLoading}
              initialValue={vehicleNumber || ''}
            />
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <RecentChallanSearchesCard
              searches={recentSearches}
              onSearchSelect={handleRecentSearchSelect}
              onClearAll={clearAllSearches}
            />
          )}

          {/* Info Section */}
          <View style={styles.infoSection}>
            <InfoCard
              icon="📋"
              title="Complete Details"
              description="Get instant details of pending & paid challans from official sources."
            />
            <InfoCard
              icon="💳"
              title="One-Tap Payment"
              description="Easily pay challans directly through the app’s secure gateway."
            />
            <InfoCard
              icon="📊"
              title="Track History"
              description="View your complete challan record & payment history anytime."
            />
          </View>

          {/* Saved Reports Shortcut */}
          <TouchableOpacity
            style={styles.savedReportsButton}
            onPress={() => navigation.navigate('SavedChallanReports')}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.savedReportsButtonText}>View Saved Reports</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Vehicle Number Modal */}
      <VehicleNumberModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleVehicleNumberSubmit}
        onSkip={handleSkip}
        contextTitle="Check Your Car's Challan"
        contextMessage="Just enter your car number to see all challans in one tap. Your number helps us fetch the correct details securely."
        showDemoOption={false}
      />
    </SafeAreaView>
  );
};

/* ---------------- INFO CARD COMPONENT ---------------- */

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoDescription}>{description}</Text>
    </View>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  headerButton: {
    marginRight: 0,
    backgroundColor: colors.primaryDarker,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  searchSection: {
    marginTop: 12,
    marginBottom: 24,
  },
  infoSection: {
    gap: 12,
    marginTop: 12,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    fontSize: 30,
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  infoDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  savedReportsButton: {
    marginTop: 28,
    backgroundColor: colors.primaryDarker,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  savedReportsButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
