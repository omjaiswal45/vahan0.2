// ImagePickerCard.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  Modal,
  Dimensions,
  PanResponder,
  Animated,
  Easing,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_IMAGE_HEIGHT = SCREEN_HEIGHT * 0.72;
const MIN_CROP_SIZE = 80;
const MAX_IMAGES_DEFAULT = 5;

type Props = {
  images: string[];
  setImages: (arr: string[]) => void;
  maxImages?: number;
  onComplete?: () => void;
};

export default function ImagePickerCard({
  images,
  setImages,
  onComplete,
  maxImages = MAX_IMAGES_DEFAULT,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [cropMode, setCropMode] = useState(false);

  const imageDimensions = useRef({ width: 0, height: 0 }).current;
  const displayedBounds = useRef({ width: 0, height: 0, offsetX: 0, offsetY: 0 }).current;

  const pan = useRef(new Animated.ValueXY({ x: 20, y: 20 })).current;
  const boxWidth = useRef(new Animated.Value(250)).current;
  const boxHeight = useRef(new Animated.Value(250)).current;
  const boxRotation = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(1)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.96)).current;

  const cropState = useRef({ x: 20, y: 20, width: 250, height: 250, rotation: 0 }).current;

  const updateCropAnimated = (updates: Partial<typeof cropState>, animate = false) => {
    Object.assign(cropState, updates);
    if ("x" in updates || "y" in updates) {
      animate
        ? Animated.spring(pan, { toValue: { x: cropState.x, y: cropState.y }, useNativeDriver: false, speed: 20, bounciness: 6 }).start()
        : pan.setValue({ x: cropState.x, y: cropState.y });
    }
    if ("width" in updates) {
      animate
        ? Animated.spring(boxWidth, { toValue: cropState.width, useNativeDriver: false, speed: 20, bounciness: 6 }).start()
        : boxWidth.setValue(cropState.width);
    }
    if ("height" in updates) {
      animate
        ? Animated.spring(boxHeight, { toValue: cropState.height, useNativeDriver: false, speed: 20, bounciness: 6 }).start()
        : boxHeight.setValue(cropState.height);
    }
    if ("rotation" in updates) {
      animate
        ? Animated.timing(boxRotation, { toValue: cropState.rotation, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start()
        : boxRotation.setValue(cropState.rotation);
    }
  };

  // --- MODAL OPEN/CLOSE ---
  const openImageModal = (uri: string, index: number) => {
    setSelectedImageUri(uri);
    setSelectedIndex(index);
    setCropMode(false);

    Image.getSize(
      uri,
      (w, h) => {
        imageDimensions.width = w;
        imageDimensions.height = h;

        const imageAspect = w / h;
        const containerAspect = SCREEN_WIDTH / MODAL_IMAGE_HEIGHT;
        let displayW, displayH, offsetX, offsetY;

        if (imageAspect > containerAspect) {
          displayW = SCREEN_WIDTH;
          displayH = SCREEN_WIDTH / imageAspect;
          offsetX = 0;
          offsetY = (MODAL_IMAGE_HEIGHT - displayH) / 2;
        } else {
          displayH = MODAL_IMAGE_HEIGHT;
          displayW = MODAL_IMAGE_HEIGHT * imageAspect;
          offsetY = 0;
          offsetX = (SCREEN_WIDTH - displayW) / 2;
        }

        displayedBounds.width = displayW;
        displayedBounds.height = displayH;
        displayedBounds.offsetX = offsetX;
        displayedBounds.offsetY = offsetY;

        const cropSize = Math.min(displayW, displayH) * 0.72;
        const initX = offsetX + (displayW - cropSize) / 2;
        const initY = offsetY + (displayH - cropSize) / 2;
        updateCropAnimated({ x: initX, y: initY, width: cropSize, height: cropSize, rotation: 0 });

        imageScale.setValue(1);
        modalOpacity.setValue(0);
        modalScale.setValue(0.96);
        Animated.parallel([
          Animated.timing(modalOpacity, { toValue: 1, duration: 220, useNativeDriver: false }),
          Animated.spring(modalScale, { toValue: 1, useNativeDriver: false, speed: 12, bounciness: 6 }),
        ]).start();
      },
      (err) => Alert.alert("Error", "Unable to load image size.")
    );
  };

  const closeImageModal = () => {
    Animated.timing(modalOpacity, { toValue: 0, duration: 160, useNativeDriver: false }).start(() => {
      setSelectedImageUri(null);
      setSelectedIndex(null);
      setCropMode(false);
    });
  };

  // --- PICK IMAGES ---
  const pickImage = async () => {
    try {
      setIsLoading(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return Alert.alert("Permission required", "Please enable photo permissions in settings.");

      const remaining = maxImages - images.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newUris = result.assets.map((a) => a.uri);
        setImages([...images, ...newUris].slice(0, maxImages));
      }
    } catch {
      Alert.alert("Upload failed", "Couldn't pick images.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- REMOVE IMAGE ---
  const removeImage = (uri: string, index: number) => {
    Alert.alert("Remove image", `Remove ${index === 0 ? "cover " : ""}image?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setImages(images.filter((u) => u !== uri)) },
    ]);
  };

  const removeFromModal = () => {
    if (selectedIndex === null) return;
    Alert.alert("Remove image", `Remove ${selectedIndex === 0 ? "cover " : ""}image?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setImages(images.filter((_, i) => i !== selectedIndex));
          closeImageModal();
        },
      },
    ]);
  };

  // --- APPLY CROP ---
  const applyCrop = async () => {
    if (!selectedImageUri) return;
    try {
      setIsLoading(true);
      const angle = Math.round(cropState.rotation) % 360;
      let workingUri = selectedImageUri;
      let currentW = imageDimensions.width;
      let currentH = imageDimensions.height;

      if (angle !== 0) {
        const r = await ImageManipulator.manipulateAsync(workingUri, [{ rotate: angle }], {
          compress: 1,
          format: ImageManipulator.SaveFormat.PNG,
        });
        workingUri = r.uri;
        if (Math.abs(angle) === 90 || Math.abs(angle) === 270) [currentW, currentH] = [currentH, currentW];
      }

      const scaleX = currentW / displayedBounds.width;
      const scaleY = currentH / displayedBounds.height;
      const relX = cropState.x - displayedBounds.offsetX;
      const relY = cropState.y - displayedBounds.offsetY;

      const originX = Math.max(0, Math.round(relX * scaleX));
      const originY = Math.max(0, Math.round(relY * scaleY));
      const cropWpx = Math.round(cropState.width * scaleX);
      const cropHpx = Math.round(cropState.height * scaleY);

      const finalW = Math.min(cropWpx, currentW - originX);
      const finalH = Math.min(cropHpx, currentH - originY);

      const result = await ImageManipulator.manipulateAsync(
        workingUri,
        [{ crop: { originX, originY, width: finalW, height: finalH } }, { resize: { width: Math.min(1200, finalW) } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
      );

      if (selectedIndex !== null) {
        const newImages = [...images];
        newImages[selectedIndex] = result.uri;
        setImages(newImages);
      }
      Alert.alert("Cropped", "Image cropped successfully.");
      closeImageModal();
    } catch {
      Alert.alert("Crop failed", "Unable to crop image.");
    } finally {
      setIsLoading(false);
    }
  };

  const onApplyCrop = async () => await applyCrop();

  // --- THUMBNAIL REORDER ---
  const draggedPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const createThumbnailResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6,
      onPanResponderGrant: () => {
        setDraggingIndex(index);
        draggedPos.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: draggedPos.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        const moved = gesture.dx;
        const threshold = 60;
        if (Math.abs(moved) > threshold) {
          const dir = moved > 0 ? 1 : -1;
          const newIndex = index + dir;
          if (newIndex >= 0 && newIndex < images.length) {
            const newArr = [...images];
            [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
            setImages(newArr);
          }
        }
        Animated.spring(draggedPos, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        setDraggingIndex(null);
      },
    });

  // --- CROP BOX PAN ---
  const cropPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2,
      onPanResponderGrant: () => {
        pan.setOffset({ x: cropState.x, y: cropState.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const minX = displayedBounds.offsetX;
        const minY = displayedBounds.offsetY;
        const maxX = displayedBounds.offsetX + displayedBounds.width - cropState.width;
        const maxY = displayedBounds.offsetY + displayedBounds.height - cropState.height;
        updateCropAnimated({
          x: Math.max(minX, Math.min(maxX, (pan.x as any)._value)),
          y: Math.max(minY, Math.min(maxY, (pan.y as any)._value)),
        }, true);
      },
    })
  ).current;

  // --- RESIZE ---
  const createResizeResponder = (corner: "tl" | "tr" | "bl" | "br") => {
    let start = { x: 0, y: 0, w: 0, h: 0 };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { start = { x: cropState.x, y: cropState.y, w: cropState.width, h: cropState.height }; },
      onPanResponderMove: (_, g) => {
        let nx = start.x, ny = start.y, nw = start.w, nh = start.h;
        switch (corner) {
          case "br": nw = Math.max(MIN_CROP_SIZE, start.w + g.dx); nh = Math.max(MIN_CROP_SIZE, start.h + g.dy); break;
          case "bl": nw = Math.max(MIN_CROP_SIZE, start.w - g.dx); nh = Math.max(MIN_CROP_SIZE, start.h + g.dy); nx += start.w - nw; break;
          case "tr": nw = Math.max(MIN_CROP_SIZE, start.w + g.dx); nh = Math.max(MIN_CROP_SIZE, start.h - g.dy); ny += start.h - nh; break;
          case "tl": nw = Math.max(MIN_CROP_SIZE, start.w - g.dx); nh = Math.max(MIN_CROP_SIZE, start.h - g.dy); nx += start.w - nw; ny += start.h - nh; break;
        }
        const minX = displayedBounds.offsetX;
        const minY = displayedBounds.offsetY;
        const maxX = displayedBounds.offsetX + displayedBounds.width;
        const maxY = displayedBounds.offsetY + displayedBounds.height;
        nx = Math.max(minX, Math.min(nx, maxX - MIN_CROP_SIZE));
        ny = Math.max(minY, Math.min(ny, maxY - MIN_CROP_SIZE));
        nw = Math.min(nw, maxX - nx);
        nh = Math.min(nh, maxY - ny);
        updateCropAnimated({ x: nx, y: ny, width: nw, height: nh });
      },
      onPanResponderRelease: () => {},
    });
  };

  const resizeTL = useRef(createResizeResponder("tl")).current;
  const resizeTR = useRef(createResizeResponder("tr")).current;
  const resizeBL = useRef(createResizeResponder("bl")).current;
  const resizeBR = useRef(createResizeResponder("br")).current;

  // --- ROTATE ---
  const rotateResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 2,
      onPanResponderMove: (_, g) => updateCropAnimated({ rotation: cropState.rotation + g.dx * 0.3 }),
      onPanResponderRelease: () => {
        const current = cropState.rotation % 360;
        [0, 90, 180, 270, 360].forEach((s) => { if (Math.abs(current - s) < 12) updateCropAnimated({ rotation: s }, true); });
      },
    })
  ).current;

  // --- ZOOM ---
  const zoomIn = () => Animated.spring(imageScale, { toValue: Math.min(3, (imageScale as any)._value + 0.25), useNativeDriver: false }).start();
  const zoomOut = () => Animated.spring(imageScale, { toValue: Math.max(1, (imageScale as any)._value - 0.25), useNativeDriver: false }).start();
  const resetZoom = () => Animated.spring(imageScale, { toValue: 1, useNativeDriver: false }).start();

  const lastTap = useRef(0);
  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) Animated.spring(imageScale, { toValue: (imageScale as any)._value > 1.05 ? 1 : 2, useNativeDriver: false }).start();
    lastTap.current = now;
  };

  const rotationInterpolate = boxRotation.interpolate({ inputRange: [-360, 360], outputRange: ["-360deg", "360deg"] });

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}><Ionicons name="images-outline" size={56} color="#c7c7c7" /></View>
      <Text style={styles.emptyTitle}>No images uploaded yet</Text>
      <Text style={styles.emptySub}>Add photos to showcase your listing</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Upload Images</Text>
          <Text style={styles.subtitle}>{images.length === 0 ? `Add up to ${maxImages} images` : `${images.length} of ${maxImages} images`}</Text>
        </View>
        {images.length > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{Math.round((images.length / maxImages) * 100)}%</Text>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${(images.length / maxImages) * 100}%` }]} /></View>
          </View>
        )}
      </View>

      {images.length > 0 ? (
        <>
          <Text style={styles.dragHint}><Ionicons name="hand-left-outline" size={14} color="#6b7280" /> Long press and drag to reorder</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbScroll}>
            {images.map((uri, i) => {
              const panResponder = createThumbnailResponder(i);
              const isDragging = draggingIndex === i;
              return (
                <Animated.View key={`${uri}-${i}`} style={[styles.thumbWrap, isDragging && { transform: [{ translateX: (draggedPos as any).x }, { scale: 1.06 }], zIndex: 999 }]} {...panResponder.panHandlers}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => openImageModal(uri, i)} style={[styles.thumbInner, i === 0 && styles.coverThumb]}>
                    <Image source={{ uri }} style={styles.thumbImage} />
                    <TouchableOpacity style={styles.thumbRemove} onPress={() => removeImage(uri, i)}><Ionicons name="close-circle" size={22} color="#ef4444" /></TouchableOpacity>
                    <View style={styles.thumbIndex}><Text style={styles.thumbIndexText}>{i + 1}</Text></View>
                    {i === 0 && <View style={styles.coverBadge}><Ionicons name="star" size={12} color="#fff" /><Text style={styles.coverBadgeText}>Cover</Text></View>}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>
        </>
      ) : renderEmptyState()}

      {images.length < maxImages && (
        <TouchableOpacity style={[styles.addBtn, images.length === 0 && styles.addBtnPrimary]} onPress={pickImage} disabled={isLoading}>
          {isLoading ? <ActivityIndicator size="small" color={images.length === 0 ? "#fff" : "#ff1ea5"} /> : (
            <>
              <Ionicons name="add-circle-outline" size={22} color={images.length === 0 ? "#fff" : "#ff1ea5"} />
              <Text style={[styles.addBtnText, images.length === 0 && styles.addBtnTextPrimary]}>{images.length === 0 ? "Add Images" : `Add More (${maxImages - images.length} left)`}</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {onComplete && images.length > 0 && (
        <TouchableOpacity style={styles.nextBtn} onPress={onComplete}>
          <Text style={styles.nextText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal visible={!!selectedImageUri} transparent animationType="none" onRequestClose={closeImageModal}>
        <Animated.View style={[styles.modalBackdrop, { opacity: modalOpacity }]}>
          <Animated.View style={[styles.modalInner, { transform: [{ scale: modalScale }] }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeImageModal} style={styles.iconBtn}><Ionicons name="close" size={24} color="#fff" /></TouchableOpacity>
              <View style={styles.modalHeaderRight}>
                <TouchableOpacity onPress={removeFromModal} style={styles.iconBtn}><Ionicons name="trash-outline" size={20} color="#fff" /></TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalBody}>
              {selectedImageUri && (
                <View style={styles.imageArea}>
                  <TouchableOpacity activeOpacity={1} onPress={handleImageTap} style={StyleSheet.absoluteFill}>
                    <Animated.Image source={{ uri: selectedImageUri }} resizeMode="contain" style={[styles.modalImage, { transform: [{ scale: imageScale }] }]} />
                  </TouchableOpacity>

                  {cropMode && (
                    <View style={styles.overlayContainer} pointerEvents="box-none">
                      <View style={StyleSheet.absoluteFill}><View style={[styles.darkFill, { opacity: 0.65 }]} /></View>
                      <Animated.View {...cropPanResponder.panHandlers} style={[styles.cropBox, { left: pan.x, top: pan.y, width: boxWidth, height: boxHeight, transform: [{ rotate: rotationInterpolate }] }]}>
                        <View style={styles.grid}><View style={styles.gridRow} /><View style={styles.gridRow} /><View style={styles.gridCol} /><View style={styles.gridCol} /></View>
                        <View {...resizeTL.panHandlers} style={[styles.handle, styles.tl]} />
                        <View {...resizeTR.panHandlers} style={[styles.handle, styles.tr]} />
                        <View {...resizeBL.panHandlers} style={[styles.handle, styles.bl]} />
                        <View {...resizeBR.panHandlers} style={[styles.handle, styles.br]} />
                        <View {...rotateResponder.panHandlers} style={styles.rotateHandle}><Ionicons name="refresh" size={18} color="#fff" /></View>
                      </Animated.View>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              {!cropMode ? (
                <View style={styles.footerRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setCropMode(true)}><Ionicons name="crop-outline" size={18} color="#fff" /><Text style={styles.actionText}>Enable Crop</Text></TouchableOpacity>
                  <View style={styles.rightControls}>
                    <TouchableOpacity style={styles.iconSmall} onPress={zoomOut}><Ionicons name="remove-circle-outline" size={20} color="#fff" /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconSmall} onPress={resetZoom}><Ionicons name="refresh" size={18} color="#fff" /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconSmall} onPress={zoomIn}><Ionicons name="add-circle-outline" size={20} color="#fff" /></TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.footerRow}>
                  <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => setCropMode(false)}><Text style={styles.actionText}>Cancel</Text></TouchableOpacity>
                  <View style={{ width: 12 }} />
                  <TouchableOpacity style={[styles.actionBtn, styles.applyBtn]} onPress={onApplyCrop} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionText}>Apply Crop</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  card: { margin: 16, padding: 16, borderRadius: 14, backgroundColor: "#fff", ...Platform.select({ ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 14 }, android: { elevation: 3 } }) },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  headerLeft: { flex: 1 },
  title: { fontSize: 18, fontWeight: "700", color: "#111", marginBottom: 2 },
  subtitle: { fontSize: 13, color: "#666" },
  progressContainer: { alignItems: "flex-end", marginLeft: 12 },
  progressText: { fontSize: 12, color: "#ff1ea5", fontWeight: "700", marginBottom: 6 },
  progressBar: { width: 64, height: 6, backgroundColor: "#eee", borderRadius: 6, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#ff1ea5", borderRadius: 6 },
  dragHint: { fontSize: 12, color: "#6b7280", marginBottom: 10, fontStyle: "italic" },
  thumbScroll: { paddingVertical: 6, paddingRight: 6 },
  thumbWrap: { marginRight: 12, alignItems: "center" },
  thumbInner: { width: 120, height: 120, borderRadius: 12, overflow: "hidden", backgroundColor: "#f3f4f6", borderWidth: 2, borderColor: "transparent" },
  coverThumb: { borderColor: "#f59e0b" },
  thumbImage: { width: "100%", height: "100%" },
  thumbRemove: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 14 },
  thumbIndex: { position: "absolute", bottom: 6, right: 6, width: 26, height: 26, borderRadius: 13, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  thumbIndexText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  coverBadge: { position: "absolute", top: 6, left: 6, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(245,158,11,0.95)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  coverBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  emptyState: { alignItems: "center", paddingVertical: 34 },
  emptyIcon: { marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 6 },
  emptySub: { color: "#9ca3af" },
  addBtn: { marginTop: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderStyle: "dashed", borderColor: "#ff1ea5", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  addBtnPrimary: { backgroundColor: "#ff1ea5", borderStyle: "solid" },
  addBtnText: { color: "#ff1ea5", fontWeight: "600", fontSize: 15 },
  addBtnTextPrimary: { color: "#fff" },
  nextBtn: { marginTop: 12, backgroundColor: "#10b981", paddingVertical: 12, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  nextText: { color: "#fff", fontWeight: "700" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  modalInner: { width: SCREEN_WIDTH, maxHeight: SCREEN_HEIGHT, backgroundColor: "transparent" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: Platform.OS === "ios" ? 44 : 10, paddingHorizontal: 12, paddingBottom: 8 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.06)", justifyContent: "center", alignItems: "center" },
  modalHeaderRight: { flexDirection: "row", gap: 8 },
  modalBody: { alignItems: "center", justifyContent: "center" },
  imageArea: { width: SCREEN_WIDTH, height: MODAL_IMAGE_HEIGHT, justifyContent: "center", alignItems: "center" },
  modalImage: { width: SCREEN_WIDTH, height: MODAL_IMAGE_HEIGHT },
  overlayContainer: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
  darkFill: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  cropBox: { position: "absolute", borderWidth: 2, borderColor: "#fff", borderStyle: "dashed", backgroundColor: "transparent", shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 10, elevation: 10 },
  grid: { ...StyleSheet.absoluteFillObject, justifyContent: "space-between", alignItems: "stretch", padding: 6 },
  gridRow: { height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginVertical: 0 },
  gridCol: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,255,255,0.06)", left: "33%" },
  handle: { position: "absolute", width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", borderWidth: 2, borderColor: "#3b82f6", shadowColor: "#000", shadowOpacity: 0.14, shadowRadius: 6 },
  tl: { left: -10, top: -10 }, tr: { right: -10, top: -10 }, bl: { left: -10, bottom: -10 }, br: { right: -10, bottom: -10 },
  rotateHandle: { position: "absolute", top: -48, left: "50%", marginLeft: -18, width: 36, height: 36, borderRadius: 18, backgroundColor: "#8b5cf6", borderWidth: 2, borderColor: "#fff", justifyContent: "center", alignItems: "center" },
  modalFooter: { paddingHorizontal: 14, paddingBottom: Platform.OS === "ios" ? 26 : 14, paddingTop: 12 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  actionBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#3b82f6", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, gap: 8 },
  actionText: { color: "#fff", fontWeight: "700" },
  cancelBtn: { backgroundColor: "#6b7280" },
  applyBtn: { backgroundColor: "#10b981" },
  rightControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconSmall: { width: 40, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)" },
});
