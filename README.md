# AI-Powered Test Automation Extension 🚀

**Enterprise-grade test automation code generator with intelligent locator strategies and BDD scenario creation**

[![Version](https://img.shields.io/badge/version-2.0-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)]()

---

## 🎯 Overview

An **AI-powered Chrome extension** that revolutionizes test automation by:
- **Recording end-to-end flows** across multiple pages
- **Generating production-ready code** with smart locator strategies
- **Creating BDD scenarios** automatically from user interactions
- **Providing multi-locator fallback** for maximum test stability
- **Supporting multiple frameworks** (Selenium, Playwright, Cypress, Puppeteer)

**Time Savings: 40-50% reduction in test creation time**

---

## ✨ Key Features

### 🎬 **Cross-Page Recording**
- Record complete user flows across multiple pages
- Automatic script injection on navigation
- Captures both navigation and interaction events
- Contextual step grouping

### 🎯 **Smart Multi-Locator Strategy**
Generate **5+ locator strategies** per element with stability scores:
1. `data-testid` (Score: 95) - Most stable
2. `id` attribute (Score: 90)
3. `name` attribute (Score: 85)
4. `aria-label` (Score: 88) - Accessibility
5. Smart CSS selector (Score: 80)
6. XPath (Score: 60) - Fallback only

### 🤖 **Action Type Detection**
Automatically detects and generates appropriate code for:
- **CLICK** - Buttons, links, checkboxes
- **TYPE** - Input fields, textareas
- **SELECT** - Dropdowns
- **UPLOAD** - File inputs
- **NAVIGATE** - Page transitions

### ⏱️ **Smart Wait Generation**
Eliminates flaky tests with intelligent wait strategies:
- `elementToBeClickable` for interactive elements
- `visibilityOfElement` for display verification
- `urlChange` for navigation
- Auto-wait for loading spinners

### 📝 **Enhanced BDD Generation**
Creates comprehensive Gherkin scenarios:
- Scenario Outlines with Examples
- Tags for organization (`@smoke`, `@regression`)
- Negative test scenarios
- Business-language steps

### 🧩 **Component Library**
- Reusable test components
- Team-wide sharing
- Centralized locator repository

### 🌐 **Multi-Framework Support**
- **Java**: Selenium, Cucumber
- **C#**: Selenium, SpecFlow
- **Python**: Selenium, Playwright, Behave
- **JavaScript**: Cypress, Puppeteer, Playwright

---

## 📦 Installation

### **Chrome/Edge Installation**

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd ai-extension
   ```

2. **Load Extension**
   - Open Chrome/Edge browser
   - Navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `ai-extension` directory

3. **Pin Extension**
   - Click the puzzle icon in browser toolbar
   - Pin the extension for easy access

---

## ⚙️ Configuration

### **1. Get API Keys**

#### **Groq API** (Recommended - Fast & Free Tier)
- Visit: https://console.groq.com/keys
- Sign up and create API key
- Models: `llama-3.3-70b-versatile`, `mixtral-8x7b`

#### **OpenAI API**
- Visit: https://platform.openai.com/api-keys
- Sign up and create API key
- Models: `gpt-4o`, `gpt-4o-mini`

### **2. Configure Extension**

1. Click extension icon → **Settings** tab
2. Configure:
   - **Language**: Java, C#, Python, TypeScript
   - **Framework**: Selenium, Playwright, Cypress
   - **LLM Provider**: Groq or OpenAI
   - **Model**: Select preferred model
3. Enter **API Key**
4. Save settings

---

## 🚀 Usage

### **Quick Start: Record Your First Flow**

1. **Open Extension**
   - Click extension icon
   - Side panel opens

2. **Start Recording**
   - Click **"Record Flow"** button (turns red)
   - Inspector automatically activates

3. **Interact with Page**
   - Navigate to login page
   - Click email field → Extension detects TYPE action
   - Click password field → Extension detects TYPE action
   - Click login button → Extension detects CLICK + NAVIGATE

4. **Continue Across Pages**
   - Click link to navigate
   - Extension automatically continues recording
   - Interact with elements on new page

5. **Stop Recording**
   - Click **"Stop Recording"**
   - View captured steps summary

6. **Generate Code**
   - Review recorded flow
   - Click **"Generate"**
   - Select generation type (BDD Feature, Page Object, etc.)
   - Copy generated code

### **Example Output**

#### **Generated BDD Feature File**
```gherkin
@authentication @smoke
Feature: User Authentication
  As a registered user
  I want to log into the application
  So that I can access my account
  
  Background:
    Given I am on the login page
    And the page has fully loaded
  
  @positive @critical
  Scenario Outline: Successful login with valid credentials
    When I enter "<email>" in the email field
    And I enter "<password>" in the password field
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see the welcome message "Welcome back"
    
    Examples:
      | email              | password  |
      | test@example.com   | Test@123  |
      | admin@example.com  | Admin@456 |
```

#### **Generated Page Object (Java)**
```java
package com.automation.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;

/**
 * Login Page Object with Smart Multi-Locator Strategy
 */
public class LoginPage {
    private WebDriver driver;
    private WebDriverWait wait;
    
    /**
     * Email Field - Multiple locator strategies for stability
     * Primary: data-testid (Score: 95)
     * Fallback: id (Score: 90)
     */
    @FindBy(css = "[data-testid='email-input']")
    private WebElement emailField;
    
    /**
     * Password Field
     */
    @FindBy(css = "[data-testid='password-input']")
    private WebElement passwordField;
    
    /**
     * Login Button
     */
    @FindBy(css = "[data-testid='login-btn']")
    private WebElement loginButton;
    
    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }
    
    public void enterEmail(String email) {
        wait.until(ExpectedConditions.visibilityOf(emailField));
        emailField.clear();
        emailField.sendKeys(email);
    }
    
    public void enterPassword(String password) {
        wait.until(ExpectedConditions.visibilityOf(passwordField));
        passwordField.clear();
        passwordField.sendKeys(password);
    }
    
    public void clickLogin() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        loginButton.click();
        // Wait for loading spinner
        wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.cssSelector(".loading, .spinner")
        ));
    }
}
```

---

## 📚 Documentation

### **Complete Guides**

- **[Implementation Guide](IMPLEMENTATION_GUIDE.md)** - Step-by-step usage guide with examples
- **[Enterprise Enhancements](ENTERPRISE_ENHANCEMENTS.md)** - Advanced features and roadmap
- **[Executive Proposal](EXECUTIVE_PROPOSAL.md)** - Business case and ROI analysis
- **[Cross-Page Recording](CROSS_PAGE_RECORDING.md)** - Multi-page flow recording details

### **Quick Reference**

#### **Locator Priority Order**
1. `data-testid` → Most stable
2. `id` → If unique and stable
3. `name` → Good for forms
4. `aria-label` → Semantic and accessible
5. `CSS` → Smart selector
6. `XPath` → Last resort

#### **Action Types**
- **Buttons/Links** → CLICK + wait for clickable
- **Text Inputs** → TYPE + clear before typing
- **Checkboxes** → SELECT + click
- **Dropdowns** → SELECT_DROPDOWN + Select API
- **File Upload** → UPLOAD + sendKeys(filePath)

---
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
