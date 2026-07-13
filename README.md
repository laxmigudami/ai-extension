# Test Automation Code Generator

An AI-powered browser extension for generating test automation code across multiple frameworks and languages.

## Overview

This extension helps QA engineers and automation developers quickly generate test automation code by inspecting web elements and leveraging AI models to create production-ready code in various formats.

## Features

- **Multi-Framework Support**: Generate code for Selenium, Playwright, Cypress, and Puppeteer
- **Multiple Languages**: Java, C#, Python, and TypeScript
- **BDD Support**: Generate Cucumber feature files and step definitions
- **Page Object Pattern**: Create maintainable Page Object classes
- **AI-Powered**: Integration with Groq and OpenAI for intelligent code generation
- **DOM Inspector**: Visual element selector for targeted code generation
- **Syntax Highlighting**: Beautiful code rendering with Prism.js
- **Real-time Generation**: Generate code as you work

## Installation

1. Clone or download this repository
2. Open Chrome/Edge browser
3. Navigate to `chrome://extensions/` (or `edge://extensions/`)
4. Enable "Developer mode" in the top right
5. Click "Load unpacked"
6. Select the extension directory

## Configuration

### 1. Get API Keys

**Groq API** (Recommended - Fast & Free Tier Available):
- Visit: https://console.groq.com/keys
- Sign up and generate an API key
- Models: llama-3.3-70b-versatile, gpt-oss-120b

**OpenAI API**:
- Visit: https://platform.openai.com/api-keys
- Sign up and generate an API key
- Models: GPT-4o, GPT-4o Mini

### 2. Configure the Extension

1. Click the extension icon in your browser toolbar
2. Navigate to the **Settings** tab
3. Select your preferred:
   - **Language Binding**: Java, C#, Python, or TypeScript
   - **Browser Engine**: Selenium, Playwright, Cypress, or Puppeteer
   - **LLM Provider**: Groq or OpenAI
   - **Model**: Choose from available models
4. Enter your API key
5. Switch to the **Code Generator** tab

## Usage

### Basic Workflow

1. **Navigate** to the web page you want to automate
2. **Click** the extension icon to open the side panel
3. **Click** the "Inspect" button
4. **Select** elements on the page (they will highlight)
5. **Provide** additional instructions in the text area (optional)
6. **Click** "Generate" to create code
7. **Copy** the generated code from the panel

### Generation Options

- **Feature File**: Generate Cucumber BDD feature files
- **Page Class**: Generate Page Object Model classes

### Example Use Cases

**Create Login Page Object**:
1. Navigate to login page
2. Inspect username, password, and login button
3. Check "Page Class"
4. Add instruction: "Create LoginPage with validation methods"
5. Generate

**Generate Feature File**:
1. Navigate to application page
2. Inspect form elements
3. Check "Feature File"
4. Add instruction: "Create user registration scenarios"
5. Generate

## Project Structure

```
ai-extension/
├── manifest.json          # Extension configuration
├── panel.html            # Side panel UI
├── bg.js                 # Background service worker
├── assets/               # Images and icons
├── lib/                  # External libraries
│   ├── marked/          # Markdown rendering
│   └── prism/           # Syntax highlighting
└── src/
    ├── config/          # Application configuration
    │   ├── appConfig.js        # Branding and colors
    │   └── configUtils.js      # Config utilities
    ├── content/         # Content scripts
    │   └── content.js          # DOM inspector
    ├── scripts/         # Core functionality
    │   ├── chat.js             # Chat UI and logic
    │   ├── popup.js            # Settings management
    │   ├── prompts.js          # AI prompt templates
    │   ├── tabs.js             # Tab navigation
    │   └── api/                # API integrations
    │       ├── groq-api.js
    │       └── openai-api.js
    └── styles/          # CSS stylesheets
        ├── chat.css
        ├── sidepanel.css
        ├── styles.css
        └── vars.css
```

## Customization

### Updating Branding

Edit `src/config/appConfig.js`:

```javascript
export const appConfig = {
  appName: 'Your Company Name',
  logoPath: 'assets/images/your-logo.png',
  colors: {
    primary: '#007acc',      // Main brand color
    primaryLight: '#005a9e', // Lighter variant
    accent: '#0098ff',       // Accent color
    success: '#107c10',      // Success messages
    danger: '#e81123',       // Error messages
    darkBg: '#1e1e1e',      // Background
    panelBg: '#252526',     // Panel background
    mutedText: '#858585'    // Secondary text
  }
};
```

### Updating Package Names

Edit `src/scripts/prompts.js` to change Java package structure:

```javascript
// Change from:
package com.automation.pages;

// To:
package com.yourcompany.automation.pages;
```

### Adding Custom Prompts

In `src/scripts/prompts.js`, add new prompt templates:

```javascript
export const DEFAULT_PROMPTS = {
  YOUR_CUSTOM_PROMPT: `
    Instructions:
    - Your specific requirements
    
    Context:
    DOM: \${domContent}
    
    Output Format:
    - Expected format
  `
};
```

## AI Provider Configuration

### Groq (Recommended)
- **Speed**: Very fast inference
- **Cost**: Generous free tier
- **Models**: Open-source models
- **Best for**: Development and testing

### OpenAI
- **Speed**: Fast
- **Cost**: Pay-per-use
- **Models**: GPT-4o family
- **Best for**: Production use

## Troubleshooting

### Extension Not Working
- Ensure you're not on a `chrome://` or `edge://` page
- Check that content scripts are allowed
- Refresh the page and try again

### No Code Generated
- Verify API key is correctly entered
- Check browser console for errors
- Ensure you've selected DOM elements first

### API Errors
- Verify API key is valid
- Check your API usage limits
- Try switching providers

## Best Practices

1. **Inspect Specific Elements**: Select only relevant elements for better code quality
2. **Provide Context**: Add clear instructions for better AI understanding
3. **Review Generated Code**: Always review and test generated code
4. **Iterative Refinement**: Regenerate with more specific instructions if needed
5. **Save API Keys Securely**: Use environment-specific keys

## Development

### Local Setup
```bash
# No build process required - it's vanilla JavaScript
# Just load the extension directory in developer mode
```

### Adding New API Providers

1. Create new API client in `src/scripts/api/`
2. Follow the pattern from `groq-api.js`
3. Update `popup.js` to include provider in dropdown
4. Update `chat.js` to handle new provider

### Testing
- Test across different browsers (Chrome, Edge)
- Test with different frameworks and languages
- Verify generated code compiles and runs

## Security Notes

- API keys are stored locally in Chrome's sync storage
- Keys are not transmitted except to configured API providers
- Use environment-specific keys for team deployments
- Consider enterprise secret management for production

## Roadmap

- [ ] Support for more languages (Ruby, Go)
- [ ] Custom prompt library
- [ ] Team collaboration features
- [ ] Export/import settings
- [ ] Code templates library
- [ ] Integration with IDE

## License

Proprietary - Internal Use Only

## Support

For issues or questions, contact your team lead or create an issue in the internal repository.

---

**Version**: 1.0  
**Last Updated**: June 2026  
**Maintained By**: QA Automation Team
