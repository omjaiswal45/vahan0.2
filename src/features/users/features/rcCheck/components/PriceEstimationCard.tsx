// src/features/users/features/rcCheck/components/PriceEstimationCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/colors';
import { PriceEstimation } from '../types';

interface PriceEstimationCardProps {
  estimation: PriceEstimation;
}

const PriceEstimationCard: React.FC<PriceEstimationCardProps> = ({ estimation }) => {
  const formatPrice = (price: number) => {
    return `₹${(price / 1000).toFixed(0)}K`;
  };

  const formatFullPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Price Estimation</Text>

      <View style={styles.priceContainer}>
        <View style={styles.mainPrice}>
          <Text style={styles.label}>Estimated Value</Text>
          <Text style={styles.price}>{formatFullPrice(estimation.estimatedPrice)}</Text>
        </View>

        <View style={styles.priceRange}>
          <View style={styles.rangeItem}>
            <Text style={styles.rangeLabel}>Min</Text>
            <Text style={styles.rangeValue}>
              {formatPrice(estimation.priceRange.min)}
            </Text>
          </View>
          <View style={styles.rangeDivider} />
          <View style={styles.rangeItem}>
            <Text style={styles.rangeLabel}>Max</Text>
            <Text style={styles.rangeValue}>
              {formatPrice(estimation.priceRange.max)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.depreciation}>
        <Text style={styles.depreciationLabel}>Depreciation</Text>
        <Text style={styles.depreciationValue}>
          {estimation.depreciationPercentage}%
        </Text>
      </View>

      <View style={styles.factorsSection}>
        <Text style={styles.factorsTitle}>Price Factors</Text>
        {estimation.factors.map((factor, index) => {
          const impactColor =
            factor.impact === 'positive'
              ? colors.green[600]
              : factor.impact === 'negative'
              ? colors.red[600]
              : colors.gray[600];

          const impactSign =
            factor.impact === 'positive'
              ? '+'
              : factor.impact === 'negative'
              ? '-'
              : '';

          return (
            <View key={index} style={styles.factorItem}>
              <View style={styles.factorLeft}>
                <Text style={styles.factorName}>{factor.factor}</Text>
                <Text style={styles.factorValue}>{factor.value}</Text>
              </View>
              <Text style={[styles.factorImpact, { color: impactColor }]}>
                {impactSign}₹{Math.abs(factor.priceImpact).toLocaleString()}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.marketValue}>
        <Text style={styles.marketLabel}>Market Value</Text>
        <Text style={styles.marketPrice}>
          {formatFullPrice(estimation.marketValue)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 16,
  },
  priceContainer: {
    backgroundColor: colors.green[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  mainPrice: {
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.gray[600],
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.green[700],
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rangeItem: {
    alignItems: 'center',
  },
  rangeLabel: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '600',
    marginBottom: 4,
  },
  rangeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.green[600],
  },
  rangeDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.green[200],
  },
  depreciation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.orange[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  depreciationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
  },
  depreciationValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.orange[600],
  },
  factorsSection: {
    marginBottom: 16,
  },
  factorsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 12,
  },
  factorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  factorLeft: {
    flex: 1,
  },
  factorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 2,
  },
  factorValue: {
    fontSize: 12,
    color: colors.gray[600],
  },
  factorImpact: {
    fontSize: 14,
    fontWeight: '700',
  },
  marketValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue[50],
    padding: 12,
    borderRadius: 8,
  },
  marketLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
  },
  marketPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.blue[700],
  },
});

export default PriceEstimationCard;