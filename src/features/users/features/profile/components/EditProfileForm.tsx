// EditprofileForm.tsx
import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AvatarUploader from './AvatarUploader';
import { Userprofile } from '../types';
import Input from '../../../../../common/Input';
import PrimaryButton from '../../../../../common/Button';
import { Colors, Spacing, Typography } from '../../../../../styles';

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
    defaultValues: { name: initial?.name ?? '', email: initial?.email ?? '', phone: initial?.phone ?? '', city: initial?.location?.city ?? '' },
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
    <View style={{ padding: Spacing.lg }}>
      <AvatarUploader imageUri={initial?.avatar} onImagePicked={(f) => setAvatarFile(f)} size={120} />

      <Text style={{ marginTop: Spacing.lg, marginBottom: Spacing.xs, color: Colors.text, fontFamily: (Typography as any).fontFamily?.medium }}>Name</Text>
      <Controller control={control} name="name" render={({ field, fieldState }) => (
        <>
          <Input value={field.value} onChangeText={field.onChange} placeholder="Your name" />
          {fieldState.error && <Text style={{ color: Colors.error }}>{fieldState.error.message}</Text>}
        </>
      )} />

      <Text style={{ marginTop: Spacing.md, marginBottom: Spacing.xs, color: Colors.text, fontFamily: (Typography as any).fontFamily?.medium }}>Email</Text>
      <Controller control={control} name="email" render={({ field, fieldState }) => (
        <>
          <Input value={field.value} onChangeText={field.onChange} placeholder="you@example.com" keyboardType="email-address" />
          {fieldState.error && <Text style={{ color: Colors.error }}>{fieldState.error.message}</Text>}
        </>
      )} />

      <Text style={{ marginTop: Spacing.md, marginBottom: Spacing.xs, color: Colors.text, fontFamily: (Typography as any).fontFamily?.medium }}>Phone</Text>
      <Controller control={control} name="phone" render={({ field, fieldState }) => (
        <>
          <Input value={field.value || ''} onChangeText={field.onChange} placeholder="Phone number" keyboardType="phone-pad" />
          {fieldState.error && <Text style={{ color: Colors.error }}>{fieldState.error.message}</Text>}
        </>
      )} />

      <Text style={{ marginTop: Spacing.md, marginBottom: Spacing.xs, color: Colors.text, fontFamily: (Typography as any).fontFamily?.medium }}>City</Text>
      <Controller control={control} name="city" render={({ field, fieldState }) => (
        <>
          <Input value={field.value || ''} onChangeText={field.onChange} placeholder="City" />
          {fieldState.error && <Text style={{ color: Colors.error }}>{fieldState.error.message}</Text>}
        </>
      )} />

      <View style={{ marginTop: Spacing.lg }}>
        <PrimaryButton title={loading ? 'Updating...' : 'Update profile'} onPress={handleSubmit(submit)} disabled={loading} />
      </View>
    </View>
  );
};

export default EditprofileForm;
