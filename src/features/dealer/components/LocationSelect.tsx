import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LocationSelectProps {
  value?: string;
  onComplete: (location: { state: string; city: string }) => void;
}

const { width, height } = Dimensions.get('window');

// Indian States with their major cities
const statesData = {
  'Delhi': {
    icon: '🏛️',
    cities: ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    gradient: ['#FF6B6B', '#FF8E53']
  },
  'Maharashtra': {
    icon: '🌊',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
    gradient: ['#4E54C8', '#8F94FB']
  },
  'Karnataka': {
    icon: '💻',
    cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davangere'],
    gradient: ['#11998E', '#38EF7D']
  },
  'Tamil Nadu': {
    icon: '🏖️',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore'],
    gradient: ['#F2994A', '#F2C94C']
  },
  'Telangana': {
    icon: '🕌',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam'],
    gradient: ['#A445B2', '#D41872']
  },
  'West Bengal': {
    icon: '🎭',
    cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Kharagpur'],
    gradient: ['#667EEA', '#764BA2']
  },
  'Gujarat': {
    icon: '🦁',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar'],
    gradient: ['#F46B45', '#EEA849']
  },
  'Rajasthan': {
    icon: '🏰',
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar'],
    gradient: ['#FC6767', '#EC008C']
  },
  'Uttar Pradesh': {
    icon: '🕉️',
    cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Ghaziabad', 'Noida'],
    gradient: ['#FDBB2D', '#22C1C3']
  },
  'Madhya Pradesh': {
    icon: '🦚',
    cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Ratlam'],
    gradient: ['#3A1C71', '#D76D77', '#FFAF7B']
  },
  'Punjab': {
    icon: '🌾',
    cities: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    gradient: ['#56AB2F', '#A8E063']
  },
  'Haryana': {
    icon: '🏭',
    cities: ['Gurugram', 'Faridabad', 'Rohtak', 'Panipat', 'Karnal', 'Hisar', 'Sonipat'],
    gradient: ['#1E3C72', '#2A5298']
  },
  'Kerala': {
    icon: '🌴',
    cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur'],
    gradient: ['#134E5E', '#71B280']
  },
  'Andhra Pradesh': {
    icon: '⛰️',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kakinada'],
    gradient: ['#C04848', '#480048']
  },
  'Bihar': {
    icon: '📚',
    cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Bihar Sharif'],
    gradient: ['#8E2DE2', '#4A00E0']
  },
  'Odisha': {
    icon: '🛕',
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
    gradient: ['#00B4DB', '#0083B0']
  },
  'Assam': {
    icon: '🦏',
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tezpur'],
    gradient: ['#16A085', '#F4D03F']
  },
  'Jharkhand': {
    icon: '⛏️',
    cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Giridih'],
    gradient: ['#2C3E50', '#3498DB']
  },
  'Chhattisgarh': {
    icon: '🌳',
    cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'],
    gradient: ['#659999', '#F4791F']
  },
  'Uttarakhand': {
    icon: '🏔️',
    cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Nainital'],
    gradient: ['#0F2027', '#203A43', '#2C5364']
  },
  'Himachal Pradesh': {
    icon: '⛷️',
    cities: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali'],
    gradient: ['#E0EAFC', '#CFDEF3']
  },
  'Goa': {
    icon: '🏝️',
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
    gradient: ['#FA8BFF', '#2BD2FF', '#2BFF88']
  },
};

export default function LocationSelect({ value, onComplete }: LocationSelectProps) {
  const [step, setStep] = useState<'state' | 'city'>('state');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const states = Object.keys(statesData);
  
  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return states;
    return states.filter(state =>
      state.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredCities = useMemo(() => {
    if (!selectedState) return [];
    const cities = statesData[selectedState]?.cities || [];
    if (!searchQuery.trim()) return cities;
    return cities.filter(city =>
      city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedState, searchQuery]);

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setSearchQuery('');
    setStep('city');
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    onComplete({ state: selectedState, city });
  };

  const handleBack = () => {
    setStep('state');
    setSearchQuery('');
    setSelectedCity('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {step === 'city' && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {step === 'state' ? 'Select State' : 'Select City'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {step === 'state' 
                ? 'Choose your state to continue' 
                : `Choose a city in ${selectedState}`}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={step === 'state' ? 'Search states...' : 'Search cities...'}
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearButton}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {step === 'state' ? (
          // States Grid
          <View style={styles.grid}>
            {filteredStates.map((state) => {
              const stateInfo = statesData[state];
              return (
                <TouchableOpacity
                  key={state}
                  activeOpacity={0.85}
                  onPress={() => handleStateSelect(state)}
                  style={styles.card}
                >
                  <LinearGradient
                    colors={stateInfo.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    <Text style={styles.cardIcon}>{stateInfo.icon}</Text>
                    <Text style={styles.cardTitle}>{state}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardSubtitle}>
                        {stateInfo.cities.length} cities
                      </Text>
                      <Text style={styles.cardArrow}>→</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          // Cities List
          <View style={styles.citiesList}>
            {filteredCities.map((city,index) => (
              <TouchableOpacity
                key={`${city}-${index}`}
                activeOpacity={0.7}
                onPress={() => handleCitySelect(city)}
                style={[
                  styles.cityItem,
                  selectedCity === city && styles.cityItemSelected
                ]}
              >
                <View style={styles.cityIconWrapper}>
                  <Text style={styles.cityIcon}>📍</Text>
                </View>
                <Text style={styles.cityName}>{city}</Text>
                {selectedCity === city && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {((step === 'state' && filteredStates.length === 0) ||
          (step === 'city' && filteredCities.length === 0)) && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with different keywords
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Info Bar */}
      {selectedState && step === 'city' && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarContent}>
            <Text style={styles.bottomBarLabel}>Selected State</Text>
            <Text style={styles.bottomBarValue}>{selectedState}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  searchWrapper: {
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  clearButton: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: (width - 56) / 2,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardIcon: {
    fontSize: 36,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  cardArrow: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  citiesList: {
    gap: 12,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cityItemSelected: {
    borderColor: '#667eea',
    backgroundColor: '#F0F4FF',
    shadowColor: '#667eea',
    shadowOpacity: 0.2,
  },
  cityIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cityIcon: {
    fontSize: 22,
  },
  cityName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  selectedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomBar: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomBarValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
});