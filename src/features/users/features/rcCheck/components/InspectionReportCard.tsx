// src/features/users/features/rcCheck/components/InspectionReportCard.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../../../../styles/colors';
import { InspectionReport, InspectionCategory } from '../types';

interface InspectionReportCardProps {
  report: InspectionReport;
}

const InspectionReportCard: React.FC<InspectionReportCardProps> = ({ report }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return colors.green[600];
      case 'fair':
        return colors.amber[600];
      case 'needs_attention':
        return colors.orange[600];
      case 'critical':
        return colors.red[600];
      default:
        return colors.gray[600];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return '✅';
      case 'fair':
        return '⚠️';
      case 'needs_attention':
        return '🔧';
      case 'critical':
        return '❌';
      default:
        return '•';
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 85) return colors.green[600];
    if (score >= 70) return colors.amber[600];
    if (score >= 50) return colors.orange[600];
    return colors.red[600];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Inspection Report</Text>

      <View style={styles.overallScore}>
        <View style={styles.scoreCircle}>
          <Text
            style={[
              styles.scoreText,
              { color: getGradeColor(report.overallScore) },
            ]}
          >
            {report.overallScore}
          </Text>
          <Text style={styles.scoreLabel}>Overall</Text>
        </View>
        <View style={styles.scoreDetails}>
          <Text style={styles.gradeText}>{report.overallGrade}</Text>
          <Text style={styles.dateText}>
            Inspected: {report.inspectionDate}
          </Text>
          <Text style={styles.repairCost}>
            Est. Repair: ₹{report.estimatedRepairCost.toLocaleString()}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.categoriesSection}>
        {report.categories.map((category, index) => (
          <CategoryItem
            key={index}
            category={category}
            isExpanded={expandedCategory === category.name}
            onToggle={() =>
              setExpandedCategory(
                expandedCategory === category.name ? null : category.name
              )
            }
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            getGradeColor={getGradeColor}
          />
        ))}
      </ScrollView>

      {report.recommendations.length > 0 && (
        <View style={styles.recommendations}>
          <Text style={styles.recommendationsTitle}>
            📋 Recommendations
          </Text>
          {report.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationBullet}>•</Text>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

interface CategoryItemProps {
  category: InspectionCategory;
  isExpanded: boolean;
  onToggle: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
  getGradeColor: (score: number) => string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isExpanded,
  onToggle,
  getStatusColor,
  getStatusIcon,
  getGradeColor,
}) => {
  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity style={styles.categoryHeader} onPress={onToggle}>
        <View style={styles.categoryLeft}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={[styles.categoryGrade, { color: getGradeColor(category.score) }]}>
            {category.grade}
          </Text>
        </View>
        <View style={styles.categoryRight}>
          <Text style={[styles.categoryScore, { color: getGradeColor(category.score) }]}>
            {category.score}
          </Text>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.itemsList}>
          {category.items.map((item, index) => (
            <View key={index} style={styles.inspectionItem}>
              <Text style={styles.statusIcon}>
                {getStatusIcon(item.status)}
              </Text>
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.notes && (
                  <Text style={styles.itemNotes}>{item.notes}</Text>
                )}
                {item.estimatedCost && (
                  <Text style={styles.itemCost}>
                    Cost: ₹{item.estimatedCost.toLocaleString()}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              />
            </View>
          ))}
        </View>
      )}
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
  overallScore: {
    flexDirection: 'row',
    backgroundColor: colors.blue[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 3,
    borderColor: colors.blue[300],
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 11,
    color: colors.gray[600],
    fontWeight: '600',
  },
  scoreDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: colors.gray[600],
    marginBottom: 4,
  },
  repairCost: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.orange[600],
  },
  categoriesSection: {
    maxHeight: 400,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.gray[50],
  },
  categoryLeft: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 2,
  },
  categoryGrade: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryScore: {
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
  },
  expandIcon: {
    fontSize: 12,
    color: colors.gray[600],
  },
  itemsList: {
    padding: 12,
    backgroundColor: colors.white,
  },
  inspectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  statusIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 2,
  },
  itemNotes: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: 2,
  },
  itemCost: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.orange[600],
    marginTop: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
    marginTop: 4,
  },
  recommendations: {
    backgroundColor: colors.amber[50],
    borderRadius: 12,
    padding: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recommendationBullet: {
    fontSize: 16,
    color: colors.amber[600],
    marginRight: 8,
    fontWeight: '700',
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    color: colors.gray[700],
    lineHeight: 18,
  },
});

export default InspectionReportCard;