import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function ToolBar({
  onShowTabs,
  onShowHistory,
  onReload,
  onToggleOrientation,
  tabCount,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={onShowHistory}>
        <Text style={styles.icon}>🕐</Text>
        <Text style={styles.label}>History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onReload}>
        <Text style={styles.icon}>⟳</Text>
        <Text style={styles.label}>Reload</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onToggleOrientation}>
        <Text style={styles.icon}>⤢</Text>
        <Text style={styles.label}>Rotate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onShowTabs}>
        <View style={styles.tabBadge}>
          <Text style={styles.tabCount}>{tabCount}</Text>
        </View>
        <Text style={styles.label}>Tabs</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  btn: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  icon: {
    fontSize: 20,
    color: COLORS.text,
  },
  label: {
    color: COLORS.textDim,
    fontSize: FONTS.small,
    marginTop: 2,
  },
  tabBadge: {
    borderWidth: 1.5,
    borderColor: COLORS.text,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 22,
    alignItems: 'center',
  },
  tabCount: {
    color: COLORS.text,
    fontSize: FONTS.small,
    fontWeight: 'bold',
  },
});
