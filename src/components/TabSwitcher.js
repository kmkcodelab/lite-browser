import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

function TabItem({ tab, isActive, onSelect, onClose }) {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={() => onSelect(tab.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.tabTitle} numberOfLines={1}>
        {tab.title || 'New Tab'}
      </Text>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => onClose(tab.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function TabSwitcher({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onDismiss,
}) {
  return (
    <View style={styles.overlay}>
      <View style={styles.header}>
        <Text style={styles.heading}>Tabs ({tabs.length})</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.newBtn} onPress={onNewTab}>
            <Text style={styles.newBtnText}>+ New</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneBtn} onPress={onDismiss}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={tabs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TabItem
            tab={item}
            isActive={item.id === activeTabId}
            onSelect={(id) => {
              onSelectTab(id);
              onDismiss();
            }}
            onClose={onCloseTab}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.bg,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  heading: {
    color: COLORS.text,
    fontSize: FONTS.large,
    fontWeight: 'bold',
  },
  headerBtns: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  newBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
  },
  newBtnText: {
    color: COLORS.white,
    fontSize: FONTS.normal,
    fontWeight: '600',
  },
  doneBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  doneBtnText: {
    color: COLORS.accent,
    fontSize: FONTS.normal,
    fontWeight: '600',
  },
  list: {
    padding: SPACING.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    borderColor: COLORS.accent,
  },
  tabTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONTS.normal,
  },
  closeBtn: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  closeText: {
    color: COLORS.danger,
    fontSize: FONTS.medium,
    fontWeight: 'bold',
  },
});
