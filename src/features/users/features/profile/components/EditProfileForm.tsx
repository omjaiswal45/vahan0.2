// EditprofileForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AvatarUploader from './AvatarUploader';
import { Userprofile } from '../types';

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
};

const schema = Yup.object().shape({
  name: Yup.string().required('Name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  phone: Yup.string().optional(),
  city: Yup.string().optional(),
});

type Props = {
  initial?: Userprofile | null;
  onSubmit: (formData: FormData) => Promise<void>;
};

const EditprofileForm: React.FC<Props> = ({ initial, onSubmit }) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { name: initial?.name ?? '', email: initial?.email ?? '', phone: initial?.phone ?? '', city: initial?.city ?? '' },
    resolver: yupResolver(schema),
  });

  const [avatarFile, setAvatarFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (data: FormValues) => {
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('email', data.email);
      if (data.phone) fd.append('phone', data.phone);
      if (data.city) fd.append('city', data.city);
      if (avatarFile) {
        fd.append('avatar', {
          uri: avatarFile.uri,
          name: avatarFile.name,
          type: avatarFile.type,
        } as any);
      }
      setLoading(true);
      await onSubmit(fd);
    } catch (e: any) {
      Alert.alert('Update failed', e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <AvatarUploader imageUri={initial?.avatarUrl} onImagePicked={(f) => setAvatarFile(f)} size={110} />
      <Controller control={control} name="name" render={({ field }) => <TextInput value={field.value} onChangeText={field.onChange} placeholder="Name" style={{ borderBottomWidth: 1, marginTop: 16 }} />} />
      <Controller control={control} name="email" render={({ field }) => <TextInput value={field.value} onChangeText={field.onChange} placeholder="Email" keyboardType="email-address" style={{ borderBottomWidth: 1, marginTop: 16 }} />} />
      <Controller control={control} name="phone" render={({ field }) => <TextInput value={field.value} onChangeText={field.onChange} placeholder="Phone" keyboardType="phone-pad" style={{ borderBottomWidth: 1, marginTop: 16 }} />} />
      <Controller control={control} name="city" render={({ field }) => <TextInput value={field.value} onChangeText={field.onChange} placeholder="City" style={{ borderBottomWidth: 1, marginTop: 16 }} />} />
      <View style={{ marginTop: 20 }}>
        <Button title={loading ? 'Updating...' : 'Update profile'} onPress={handleSubmit(submit)} disabled={loading} />
      </View>
    </View>
  );
};

export default EditprofileForm;
