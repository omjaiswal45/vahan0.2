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
          <View key={index} style={styles.stepWrapper}>
            {/* Step circle */}
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
                  style={[
                    styles.stepText,
                    (isCompleted || isActive) && styles.activeText,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Step label */}
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {step}
            </Text>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  isCompleted && styles.completedLine,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  completedCircle: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  activeCircle: {
    borderColor: "#FF1EA5",
    backgroundColor: "#FF1EA5",
  },
  stepText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
    fontWeight: "700",
  },
  label: {
    marginLeft: 6,
    marginRight: 12,
    fontSize: 12,
    color: "#555",
  },
  activeLabel: {
    color: "#FF1EA5",
    fontWeight: "700",
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  completedLine: {
    backgroundColor: "#10B981",
  },
});
