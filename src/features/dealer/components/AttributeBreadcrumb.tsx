import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface AttributeBreadcrumbProps {
  steps: string[];
  currentIndex: number;
  onStepPress?: (index: number) => void;
}

export default function AttributeBreadcrumb({
  steps,
  currentIndex,
  onStepPress,
}: AttributeBreadcrumbProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <View key={index} style={styles.stepContainer}>
            <TouchableOpacity
              onPress={() => {
                if (onStepPress && index <= currentIndex) {
                  onStepPress(index);
                }
              }}
            >
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.completedCircle,
                  isActive && styles.activeCircle,
                ]}
              >
                <Text
                  style={[styles.stepText, (isCompleted || isActive) && styles.activeText]}
                >
                  {index + 1}
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{step}</Text>
            {index < steps.length - 1 && <View style={styles.line} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", padding: 12, flexWrap: "nowrap" },
  stepContainer: { flexDirection: "row", alignItems: "center" },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  completedCircle: { backgroundColor: "green" },
  activeCircle: { borderColor: "blue" },
  stepText: { fontSize: 14, color: "#999" },
  activeText: { color: "#fff", fontWeight: "bold" },
  label: { marginLeft: 6, marginRight: 12, fontSize: 12, color: "#555" },
  activeLabel: { color: "blue", fontWeight: "bold" },
  line: { width: 20, height: 1, backgroundColor: "#ccc" },
});
