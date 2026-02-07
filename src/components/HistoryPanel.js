import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import {
  getHistory,
  togglePin,
  clearHistory,
  deleteHistoryItem,
} from '../utils/storage';

function HistoryItem({ item, onNavigate, onTogglePin, onDelete }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onNavigate(item.url)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        {item.pinned && <Text style={styles.pinIcon}>📌 </Text>}
        <View style={styles.itemText}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemUrl} numberOfLines={1}>
            {item.url}
          </Text>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onTogglePin(item.id)}
        >
          <Text style={[styles.actionText, item.pinned && { color: COLORS.pinned }]}>
            {item.pinned ? 'Unpin' : 'Pin'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(item.id)}
        >
          <Text style={[styles.actionText, { color: COLORS.danger }]}>Del</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function HistoryPanel({ onNavigate, onDismiss }) {
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleTogglePin = useCallback(async (id) => {
    const updated = await togglePin(id);
    setHistory(updated);
  }, []);

  const handleDelete = useCallback(async (id) => {
    const updated = await deleteHistoryItem(id);
    setHistory(updated);
  }, []);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Delete all history except pinned items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const updated = await clearHistory();
            setHistory(updated);
          },
        },
      ]
    );
  }, []);

  const handleNavigate = useCallback(
    (url) => {
      onNavigate(url);
      onDismiss();
    },
    [onNavigate, onDismiss]
  );

  return (
    <View style={styles.overlay}>
      <View style={styles.header}>
        <Text style={styles.heading}>History ({history.length})</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneBtn} onPress={onDismiss}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No history yet</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryItem
              item={item}
              onNavigate={handleNavigate}
              onTogglePin={handleTogglePin}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
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
  clearBtn: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
  },
  clearText: {
    color: COLORS.white,
    fontSize: FONTS.normal,
    fontWeight: '600',
  },
  doneBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  doneText: {
    color: COLORS.accent,
    fontSize: FONTS.normal,
    fontWeight: '600',
  },
  list: {
    padding: SPACING.md,
  },
  item: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  pinIcon: {
    fontSize: FONTS.small,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    color: COLORS.text,
    fontSize: FONTS.normal,
    fontWeight: '500',
  },
  itemUrl: {
    color: COLORS.textDim,
    fontSize: FONTS.small,
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  actionBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  actionText: {
    color: COLORS.accent,
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textDim,
    fontSize: FONTS.medium,
  },
});
