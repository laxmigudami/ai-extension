# Cross-Page Recording Feature

## Overview
The extension now supports **end-to-end flow recording** across multiple pages. You can now record user interactions that span across page navigations, creating complete test scenarios.

## What Changed

### 1. **Background Script (bg.js)**
- Added `chrome.tabs.onUpdated` listener to detect page navigations
- Automatically re-injects content script when navigating during recording
- Maintains recording state in `chrome.storage.local`
- Tracks recording session with unique session IDs
- Records both navigation events and interaction events

**New Message Types:**
- `START_RECORDING` - Initiates a recording session
- `STOP_RECORDING` - Ends recording and returns collected steps
- `SET_INSPECTOR_STATE` - Tracks inspector state for cross-page continuity

### 2. **Content Script (content.js)**
- Added `AUTO_START_INSPECTOR` message handler for automatic inspector restart after navigation
- Notifies background script when inspector state changes
- Enhanced element information extraction with:
  - XPath generation
  - CSS selector generation
  - Element attributes capture
  - Better metadata for test generation

### 3. **Chat UI (chat.js)**
- New **"Record Flow"** button in the UI
- `startRecording()` - Starts a multi-page recording session
- `stopRecording()` - Stops recording and displays captured steps
- `formatRecordingSteps()` - Formats steps for user display
- `formatRecordingForGeneration()` - Formats recording data for AI code generation

### 4. **UI Updates (panel.html)**
- Added "Record Flow" button next to the Inspector button
- Visual indicator when recording is active

### 5. **Styling (sidepanel.css)**
- Recording button has animated pulse effect when active
- Red color scheme during recording for clear visual feedback
- Smooth animations for better UX

## How to Use

### Recording an End-to-End Flow

1. **Click "Record Flow"**
   - The button will turn red with a pulsing animation
   - Inspector mode automatically activates

2. **Interact with the Page**
   - Click on elements you want to test
   - Fill out forms
   - Click buttons

3. **Navigate to Other Pages**
   - Click links or submit forms that navigate to new pages
   - The recording automatically continues on the new page
   - Navigation events are captured in the flow

4. **Continue Interactions on New Pages**
   - The inspector automatically re-activates after navigation
   - Keep selecting and interacting with elements

5. **Click "Stop Recording"**
   - Recording ends and shows you a summary of all captured steps
   - Steps are formatted and ready for code generation

### Example Flow

```
1. Navigate to: https://example.com/login
2. Interact with INPUT #username on example.com
3. Interact with INPUT #password on example.com
4. Interact with BUTTON #loginBtn on example.com
5. Navigate to: https://example.com/dashboard
6. Interact with BUTTON .create-project on example.com
7. Navigate to: https://example.com/project/new
8. Interact with INPUT #projectName on example.com
9. Interact with BUTTON #saveBtn on example.com
```

## Technical Details

### Recording Session Data Structure

```javascript
{
  isRecording: true,
  recordingTabId: 123,
  recordingSessionId: 1234567890,
  recordingStartUrl: "https://example.com",
  recordingSteps: [
    {
      type: "navigation",
      url: "https://example.com/page",
      timestamp: 1234567890,
      title: "Page Title"
    },
    {
      type: "interaction",
      content: "<button>...</button>",
      url: "https://example.com/page",
      timestamp: 1234567891,
      elementInfo: {
        tagName: "BUTTON",
        id: "submitBtn",
        className: "btn-primary",
        text: "Submit",
        xpath: "/html/body/div/button[1]",
        cssSelector: "button#submitBtn",
        attributes: {...}
      }
    }
  ]
}
```

### How It Works

1. **User clicks "Record Flow"**
   → Extension sends `START_RECORDING` message to background
   → Background initializes recording state in storage
   → Inspector auto-activates on current page

2. **User navigates to new page**
   → `chrome.tabs.onUpdated` detects the navigation
   → Background checks if recording is active for this tab
   → Content script is re-injected into new page
   → Navigation event is added to recording steps
   → Inspector auto-restarts if it was active

3. **User interacts with elements**
   → Content script captures element info
   → Interaction event is sent to background
   → Background adds to recording steps

4. **User clicks "Stop Recording"**
   → Extension sends `STOP_RECORDING` message
   → Background returns all collected steps
   → UI formats and displays the recorded flow

## Manifest Permissions

The extension already has the necessary permissions:
- `scripting` - For injecting content scripts
- `tabs` - For detecting navigation
- `storage` - For persisting recording state
- `activeTab` - For accessing current tab

## Benefits

✅ **Complete E2E Scenarios**: Record flows that span multiple pages  
✅ **Automatic Script Injection**: No manual intervention needed after navigation  
✅ **Better Context**: AI gets full flow context for better code generation  
✅ **Element Metadata**: Rich element information (XPath, CSS selectors, attributes)  
✅ **Visual Feedback**: Clear UI indicators during recording  
✅ **Session Persistence**: Recording state survives across page loads  

## Known Limitations

1. **Browser Restrictions**: Cannot record on `chrome://` or `chrome-extension://` pages
2. **Single Tab**: Recording is bound to the tab where it started
3. **Page Refreshes**: Content script needs to be re-injected (handled automatically)
4. **AJAX/SPA**: Client-side navigation without full page reload may not trigger navigation events

## Future Enhancements

- [ ] Support for recording multiple tabs simultaneously
- [ ] Better SPA (Single Page Application) support
- [ ] Action type detection (click, type, select, etc.)
- [ ] Wait conditions and timing capture
- [ ] Screenshot capture at each step
- [ ] Export recording as JSON for reuse
- [ ] Playback recorded flows
