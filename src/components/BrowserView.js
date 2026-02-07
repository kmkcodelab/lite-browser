import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { AD_BLOCK_SCRIPT, FULLSCREEN_DETECT_SCRIPT } from '../utils/adblock';
import { COLORS } from '../constants/theme';

const INJECTED_JS = AD_BLOCK_SCRIPT + '\n' + FULLSCREEN_DETECT_SCRIPT;

const BrowserView = forwardRef(function BrowserView(
  { url, onUrlChange, onTitleChange, onFullscreenChange, isActive },
  ref
) {
  const webRef = useRef(null);

  useImperativeHandle(ref, () => ({
    goBack: () => webRef.current?.goBack(),
    goForward: () => webRef.current?.goForward(),
    reload: () => webRef.current?.reload(),
    stopLoading: () => webRef.current?.stopLoading(),
    canGoBack: false,
  }));

  const handleMessage = useCallback(
    (event) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'fullscreen') {
          onFullscreenChange?.(data.value);
        }
      } catch {}
    },
    [onFullscreenChange]
  );

  const handleNavigationChange = useCallback(
    (navState) => {
      onUrlChange?.(navState.url, navState.canGoBack);
      if (navState.title) onTitleChange?.(navState.title);
    },
    [onUrlChange, onTitleChange]
  );

  if (!url) return <View style={styles.empty} />;

  return (
    <View style={[styles.container, !isActive && styles.hidden]}>
      <WebView
        ref={webRef}
        source={{ uri: url }}
        style={styles.webview}
        injectedJavaScript={INJECTED_JS}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationChange}
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        setSupportMultipleWindows={false}
        startInLoadingState
        renderLoading={() => <View style={styles.loading} />}
        allowsInlineMediaPlayback
        mixedContentMode="compatibility"
        cacheEnabled
        cacheMode="LOAD_DEFAULT"
        textZoom={100}
        overScrollMode="never"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
    position: 'absolute',
    top: -9999,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  empty: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});

export default React.memo(BrowserView);
