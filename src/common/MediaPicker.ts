import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export type PickedImageFile = { uri: string; name: string; type: string };

const toFile = (uri: string): PickedImageFile => {
  const name = uri.split('/').pop() || 'image.jpg';
  const ext = name.split('.').pop()?.toLowerCase();
  const type = ext === 'png' ? 'image/png' : ext === 'heic' ? 'image/heic' : 'image/jpeg';
  return { uri, name, type };
};

export async function pickImageFromLibrary(): Promise<PickedImageFile | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: true,
    aspect: [1, 1],
  });
  // @ts-ignore compat for SDKs < 49
  if ((result as any).cancelled || result.canceled) return null;
  // SDK 49+ returns assets array
  // @ts-ignore
  const uri = result.assets ? result.assets[0]?.uri : (result as any).uri;
  if (!uri || typeof uri !== 'string') return null;
  return toFile(uri);
}

export async function pickImageFromCamera(): Promise<PickedImageFile | null> {
  const camPerm = await ImagePicker.requestCameraPermissionsAsync();
  if (!camPerm.granted) return null;
  const result = await ImagePicker.launchCameraAsync({
    quality: Platform.OS === 'ios' ? 0.8 : 0.7,
    allowsEditing: true,
    aspect: [1, 1],
  });
  // @ts-ignore compat for SDKs < 49
  if ((result as any).cancelled || result.canceled) return null;
  // @ts-ignore
  const uri = result.assets ? result.assets[0]?.uri : (result as any).uri;
  if (!uri || typeof uri !== 'string') return null;
  return toFile(uri);
}


