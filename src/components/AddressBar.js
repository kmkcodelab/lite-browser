import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

function sanitizeUrl(input) {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(trimmed)) return 'https://' + trimmed;
  return 'https://www.google.com/search?q=' + encodeURIComponent(trimmed);
}

export default function AddressBar({ currentUrl, onNavigate, canGoBack, onBack }) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!focused) {
      setText(currentUrl || '');
    }
  }, [currentUrl, focused]);

  const handleSubmit = useCallback(() => {
    if (!text.trim()) return;
    const url = sanitizeUrl(text);
    onNavigate(url);
    inputRef.current?.blur();
  }, [text, onNavigate]);

  return (
    <View style={styles.container}>
      {canGoBack && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      )}
      <TextInput
        ref={inputRef}
        style={[styles.input, !canGoBack && { marginLeft: 0 }]}
        value={text}
        onChangeText={setText}
        onFocus={() => {
          setFocused(true);
          setText(currentUrl || '');
        }}
        onBlur={() => setFocused(false)}
        onSubmitEditing={handleSubmit}
        placeholder="Search or enter URL"
        placeholderTextColor={COLORS.textDim}
        returnKeyType="go"
        autoCapitalize="none"
        autoCorrect={false}
        selectTextOnFocus
        keyboardType="url"
      />
      <TouchableOpacity style={styles.goBtn} onPress={handleSubmit}>
        <Text style={styles.goText}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.xs,
  },
  backText: {
    color: COLORS.accent,
    fontSize: FONTS.large,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    color: COLORS.text,
    fontSize: FONTS.normal,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  goBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  goText: {
    color: COLORS.accent,
    fontSize: FONTS.large,
    fontWeight: 'bold',
  },
});
