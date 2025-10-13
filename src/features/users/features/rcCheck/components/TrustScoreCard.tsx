// src/features/users/features/rcCheck/components/TrustScoreCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/colors';

interface TrustScoreCardProps {
  score: number;
  grade: string;
  size?: 'small' | 'medium' | 'large';
}

const TrustScoreCard: React.FC<TrustScoreCardProps> = ({
  score,
  grade,
  size = 'large',
}) => {
  const getScoreColor = () => {
    if (score >= 80) return colors.green[500];
    if (score >= 60) return colors.amber[500];
    if (score >= 40) return colors.orange[500];
    return colors.red[500];
  };

  const getScoreBackground = () => {
    if (score >= 80) return colors.green[50];
    if (score >= 60) return colors.amber[50];
    if (score >= 40) return colors.orange[50];
    return colors.red[50];
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          score: styles.scoreSmall,
          label: styles.labelSmall,
        };
      case 'medium':
        return {
          container: styles.containerMedium,
          score: styles.scoreMedium,
          label: styles.labelMedium,
        };
      default:
        return {
          container: styles.containerLarge,
          score: styles.scoreLarge,
          label: styles.labelLarge,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const scoreColor = getScoreColor();
  const backgroundColor = getScoreBackground();

  return (
    <View style={[styles.container, sizeStyles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Text style={[styles.score, sizeStyles.score, { color: scoreColor }]}>
          {score}
        </Text>
        <Text style={[styles.maxScore, { color: scoreColor }]}>/100</Text>
      </View>
      <Text style={[styles.grade, { color: scoreColor }]}>{grade}</Text>
      <Text style={[styles.label, sizeStyles.label]}>Trust Score</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  containerSmall: {
    padding: 12,
    borderRadius: 12,
  },
  containerMedium: {
    padding: 16,
    borderRadius: 14,
  },
  containerLarge: {
    padding: 24,
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontWeight: '800',
  },
  scoreSmall: {
    fontSize: 32,
  },
  scoreMedium: {
    fontSize: 40,
  },
  scoreLarge: {
    fontSize: 56,
  },
  maxScore: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 4,
  },
  grade: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  label: {
    color: colors.gray[600],
    fontWeight: '600',
    marginTop: 4,
  },
  labelSmall: {
    fontSize: 12,
  },
  labelMedium: {
    fontSize: 13,
  },
  labelLarge: {
    fontSize: 14,
  },
});

export default TrustScoreCard;