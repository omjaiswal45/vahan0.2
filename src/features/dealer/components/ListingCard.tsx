import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ListingCardProps {
  listing: any;
  onPress: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    flexDirection: 'row',
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: '#fff',
  }}>
    {listing.images?.[0] && (
      <Image source={{ uri: listing.images[0] }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12 }} />
    )}
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{listing.make} {listing.model}</Text>
      <Text>Year: {listing.year}</Text>
      <Text>Price: ₹{listing.price}</Text>
      <Text>City: {listing.city}</Text>
    </View>
  </TouchableOpacity>
);

export default ListingCard;
