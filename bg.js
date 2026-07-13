let selectedElements = [];
let recordingSession = {
  isActive: false,
  steps: [],
  startUrl: null,
  sessionId: null
};

/**
 * Handler: When the user clicks the extension's toolbar icon,
 * we open or focus the side panel associated with the current window.
 */
chrome.action.onClicked.addListener((tab) => {
  // This opens the side panel in Chrome (Experimental APIs).
  // Adjust if you're using a different approach or want to open a popup window, etc.
  chrome.sidePanel.open({ windowId: tab.windowId });
});

/**
 * Listen for tab updates to handle page navigation during recording
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Check if we're in recording mode
  const { isRecording, recordingTabId } = await chrome.storage.local.get(['isRecording', 'recordingTabId']);
  
  if (isRecording && recordingTabId === tabId && changeInfo.status === 'complete' && tab.url) {
    console.log('[background] Page loaded during recording:', tab.url);
    
    // Record navigation step
    const { recordingSteps = [] } = await chrome.storage.local.get(['recordingSteps']);
    recordingSteps.push({
      type: 'navigation',
      url: tab.url,
      timestamp: Date.now(),
      title: tab.title
    });
    await chrome.storage.local.set({ recordingSteps });
    
    // Inject content script into the new page
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['src/content/content.js']
      });
      console.log('[background] Content script re-injected after navigation');
      
      // Auto-start inspector if it was active
      const { inspectorWasActive } = await chrome.storage.local.get(['inspectorWasActive']);
      if (inspectorWasActive) {
        // Small delay to ensure content script is initialized
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { type: 'AUTO_START_INSPECTOR' });
        }, 100);
      }
    } catch (error) {
      console.error('[background] Error injecting content script:', error);
    }
  }
});

/**
 * Listen for messages from content.js or other parts of the extension.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SELECTED_DOM_CONTENT') {
    /**
     * content.js is sending the combined outerHTML of all currently selected elements.
     * Usually, you'll want to store each update or the final snippet for the user's next step.
     */
    console.log('[background.js] Received snippet:\n', message.content);

    const combinedSnippet = message.content; // string of concatenated outerHTML lines

    // For demonstration, store in memory:
    selectedElements = [combinedSnippet];

    // Also store it in chrome.storage.sync for easy retrieval in sidepanel or chat:
    chrome.storage.local.set({ combinedDomSnippet: combinedSnippet }, () => {
      console.log('[background] Stored combinedDomSnippet in chrome.storage.local:', combinedSnippet);
    });
    
    // If recording is active, add to recording steps
    chrome.storage.local.get(['isRecording', 'recordingSteps'], (result) => {
      if (result.isRecording) {
        const steps = result.recordingSteps || [];
        steps.push({
          type: 'interaction',
          content: message.content,
          url: sender.tab?.url,
          timestamp: Date.now(),
          elementInfo: message.elementInfo
        });
        chrome.storage.local.set({ recordingSteps: steps });
      }
    });

    sendResponse({ success: true });
    return true; // async
  } else if (message.type === 'START_RECORDING') {
    // Start a new recording session
    const sessionId = Date.now();
    chrome.storage.local.set({
      isRecording: true,
      recordingTabId: sender.tab?.id,
      recordingSteps: [],
      recordingSessionId: sessionId,
      recordingStartUrl: sender.tab?.url
    }, () => {
      console.log('[background] Recording started, session:', sessionId);
      sendResponse({ success: true, sessionId });
    });
    return true;
  } else if (message.type === 'STOP_RECORDING') {
    // Stop recording and return collected steps
    chrome.storage.local.get(['recordingSteps', 'isRecording'], (result) => {
      chrome.storage.local.set({
        isRecording: false,
        recordingTabId: null,
        inspectorWasActive: false
      }, () => {
        console.log('[background] Recording stopped. Steps collected:', result.recordingSteps?.length || 0);
        sendResponse({ success: true, steps: result.recordingSteps || [] });
      });
    });
    return true;
  } else if (message.type === 'SET_INSPECTOR_STATE') {
    // Track inspector state for cross-page continuity
    chrome.storage.local.set({ inspectorWasActive: message.isActive });
    sendResponse({ success: true });
    return true;
  }
});
/**
 * Handle extension unload (e.g., browser shutting down, extension disabled).
 * We attempt to send a 'CLEANUP' message to each tab so it can remove highlights, etc.
 */
chrome.runtime.onSuspend.addListener(async () => {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, { type: 'CLEANUP' });
      } catch (error) {
        // Ignore errors for tabs where the content script is not running
      }
    }
  } catch (error) {
    console.error('Error during extension cleanup:', error);
  }
});
