// profileHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import AvatarUploader from './AvatarUploader';
import { Userprofile } from '../types';

type Props = {
  profile?: Userprofile | null;
  onAvatarPicked?: (file: { uri: string; name: string; type: string }) => void;
};

const profileHeader: React.FC<Props> = ({ profile, onAvatarPicked }) => {
  return (
    <View style={{ padding: 16, alignItems: 'center' }}>
      <AvatarUploader imageUri={profile?.avatarUrl} onImagePicked={(f) => onAvatarPicked && onAvatarPicked(f)} size={100} />
      <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 8 }}>{profile?.name ?? 'User'}</Text>
      <Text style={{ color: '#666', marginTop: 4 }}>{profile?.city ?? '—'}</Text>
      <View style={{ marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#e8f8f0', borderRadius: 16 }}>
        <Text style={{ color: '#0b6' }}>{profile?.membership ?? 'Basic'}</Text>
      </View>
    </View>
  );
};

export default profileHeader;
