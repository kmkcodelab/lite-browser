import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import AddressBar from '../components/AddressBar';
import BrowserView from '../components/BrowserView';
import ToolBar from '../components/ToolBar';
import TabSwitcher from '../components/TabSwitcher';
import HistoryPanel from '../components/HistoryPanel';
import useOrientation from '../hooks/useOrientation';
import { addHistoryEntry } from '../utils/storage';

let nextTabId = 1;

function createTab(url) {
  return {
    id: String(nextTabId++),
    url: url || '',
    title: url ? '' : 'New Tab',
    canGoBack: false,
  };
}

export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const [tabs, setTabs] = useState([createTab('https://www.google.com')]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [showTabs, setShowTabs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const webViewRefs = useRef({});
  const { lockLandscape, lockPortrait, toggleOrientation } = useOrientation();

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const updateTab = useCallback((tabId, changes) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, ...changes } : t))
    );
  }, []);

  const handleNavigate = useCallback(
    (url) => {
      updateTab(activeTabId, { url });
    },
    [activeTabId, updateTab]
  );

  const handleUrlChange = useCallback(
    (tabId) => (url, canGoBack) => {
      updateTab(tabId, { url, canGoBack });
    },
    [updateTab]
  );

  const handleTitleChange = useCallback(
    (tabId) => async (title) => {
      updateTab(tabId, { title });
      const tab = tabs.find((t) => t.id === tabId);
      if (tab?.url) {
        await addHistoryEntry(tab.url, title);
      }
    },
    [tabs, updateTab]
  );

  const handleFullscreenChange = useCallback(
    (isFullscreen) => {
      if (isFullscreen) {
        lockLandscape();
      } else {
        lockPortrait();
      }
    },
    [lockLandscape, lockPortrait]
  );

  const handleNewTab = useCallback(() => {
    const tab = createTab('https://www.google.com');
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
  }, []);

  const handleCloseTab = useCallback(
    (tabId) => {
      setTabs((prev) => {
        const updated = prev.filter((t) => t.id !== tabId);
        if (updated.length === 0) {
          const newTab = createTab('https://www.google.com');
          setActiveTabId(newTab.id);
          return [newTab];
        }
        if (tabId === activeTabId) {
          setActiveTabId(updated[updated.length - 1].id);
        }
        delete webViewRefs.current[tabId];
        return updated;
      });
    },
    [activeTabId]
  );

  const handleBack = useCallback(() => {
    webViewRefs.current[activeTabId]?.goBack();
  }, [activeTabId]);

  const handleReload = useCallback(() => {
    webViewRefs.current[activeTabId]?.reload();
  }, [activeTabId]);

  const handleHistoryNavigate = useCallback(
    (url) => {
      handleNavigate(url);
    },
    [handleNavigate]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AddressBar
        currentUrl={activeTab.url}
        onNavigate={handleNavigate}
        canGoBack={activeTab.canGoBack}
        onBack={handleBack}
      />

      <View style={styles.webviewContainer}>
        {tabs.map((tab) => (
          <BrowserView
            key={tab.id}
            ref={(el) => {
              if (el) webViewRefs.current[tab.id] = el;
            }}
            url={tab.url}
            isActive={tab.id === activeTabId}
            onUrlChange={handleUrlChange(tab.id)}
            onTitleChange={handleTitleChange(tab.id)}
            onFullscreenChange={handleFullscreenChange}
          />
        ))}
      </View>

      <ToolBar
        tabCount={tabs.length}
        onShowTabs={() => setShowTabs(true)}
        onShowHistory={() => setShowHistory(true)}
        onReload={handleReload}
        onToggleOrientation={toggleOrientation}
      />

      {showTabs && (
        <TabSwitcher
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
          onCloseTab={handleCloseTab}
          onNewTab={handleNewTab}
          onDismiss={() => setShowTabs(false)}
        />
      )}

      {showHistory && (
        <HistoryPanel
          onNavigate={handleHistoryNavigate}
          onDismiss={() => setShowHistory(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  webviewContainer: {
    flex: 1,
  },
});
