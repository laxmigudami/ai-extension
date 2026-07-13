# 🚀 Quick Reference Card - AI Test Automation Extension

## 📱 One-Page Cheat Sheet

---

## ⚡ Quick Start (30 Seconds)

```
1. Click extension icon → Side panel opens
2. Click "Record Flow" → Button turns red
3. Interact with page → Elements auto-captured
4. Navigate to other pages → Recording continues
5. Click "Stop Recording" → View summary
6. Click "Generate" → Get production code
```

---

## 🎯 Locator Priority (Best → Worst)

| Priority | Locator | Score | Use When |
|----------|---------|-------|----------|
| ⭐⭐⭐⭐⭐ | `data-testid` | 95 | Always prefer (ask devs to add) |
| ⭐⭐⭐⭐ | `id` | 90 | If unique & stable |
| ⭐⭐⭐⭐ | `aria-label` | 88 | Semantic elements |
| ⭐⭐⭐ | `name` | 85 | Form elements |
| ⭐⭐⭐ | Smart CSS | 80 | When above not available |
| ⭐⭐ | Text XPath | 75 | For buttons/links with text |
| ⭐ | Absolute XPath | 60 | Last resort only |

---

## 🎬 Action Types & Generated Code

| Element | Action | Generated Code | Wait Strategy |
|---------|--------|----------------|---------------|
| **Button** | CLICK | `button.click()` | `elementToBeClickable` |
| **Link** | CLICK | `link.click()` | `elementToBeClickable` + URL wait |
| **Input[text]** | TYPE | `field.clear(); field.sendKeys(text)` | `visibilityOfElement` |
| **Input[checkbox]** | SELECT | `checkbox.click()` | `elementToBeClickable` |
| **Select** | SELECT | `new Select(el).selectByVisibleText()` | `elementToBeClickable` |
| **Input[file]** | UPLOAD | `input.sendKeys(filePath)` | `presenceOfElement` |

---

## ⏱️ Smart Wait Matrix

| Situation | Wait Type | Timeout | Code |
|-----------|-----------|---------|------|
| **Element not exist yet** | `presenceOfElementLocated` | 10s | `wait.until(presenceOf...)` |
| **Element exists, not visible** | `visibilityOfElementLocated` | 10s | `wait.until(visibilityOf...)` |
| **Element visible, not clickable** | `elementToBeClickable` | 10s | `wait.until(clickableOf...)` |
| **Page navigation** | `urlToBe` or `urlContains` | 10s | `wait.until(urlToBe(...))` |
| **AJAX/API call** | `invisibilityOfElementLocated` | 30s | `wait.until(invisibilityOf(spinner))` |
| **Text to appear** | `textToBePresentInElement` | 10s | `wait.until(textToBe...)` |

---

## 📝 BDD Step Patterns

### **Given Steps** (Setup)
```gherkin
Given I am on the login page
Given I am logged in as "admin"
Given the page has fully loaded
```

### **When Steps** (Actions)
```gherkin
When I enter "test@example.com" in the email field
When I click the login button
When I select "Premium" from the plan dropdown
When I upload a file to the attachment field
```

### **Then Steps** (Assertions)
```gherkin
Then I should be redirected to the dashboard
Then I should see the welcome message "Welcome back"
Then the success notification should be visible
Then the form should be submitted successfully
```

---

## 🧩 Component Pattern (Reusable Code)

### **Java Component Example**
```java
public class LoginComponent {
    @FindBy(css = "[data-testid='email']")
    private WebElement emailField;
    
    @FindBy(css = "[data-testid='password']")
    private WebElement passwordField;
    
    @FindBy(css = "[data-testid='login-btn']")
    private WebElement loginButton;
    
    public void login(String email, String password) {
        wait.until(visibilityOf(emailField));
        emailField.clear();
        emailField.sendKeys(email);
        
        wait.until(visibilityOf(passwordField));
        passwordField.clear();
        passwordField.sendKeys(password);
        
        wait.until(elementToBeClickable(loginButton));
        loginButton.click();
    }
}
```

---

## 🎯 Test Data Patterns

### **Scenario Outline with Examples**
```gherkin
Scenario Outline: Login with different users
  When I login with "<email>" and "<password>"
  Then I should see "<result>"
  
  Examples:
    | email              | password | result      |
    | valid@test.com     | Pass123! | Dashboard   |
    | invalid@test.com   | wrong    | Error msg   |
```

---

## 🚨 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| **Locator not found** | Check score (if < 70, add data-testid) |
| **Flaky tests** | Add explicit wait before action |
| **Element not clickable** | Change to `elementToBeClickable` wait |
| **Slow page** | Increase timeout to 30s |
| **AJAX content** | Add `invisibilityOfLoader` wait |
| **Navigation not working** | Add `urlChange` wait |
| **Stale element** | Re-find element after page change |

---

## 💡 Pro Tips

### **#1 Always Prefer data-testid**
❌ Bad: `By.xpath("//div[@class='btn-container']/button[2]")`  
✅ Good: `By.cssSelector("[data-testid='submit-btn']")`

### **#2 Use Multi-Locator Fallback**
```java
By[] locators = {
    By.cssSelector("[data-testid='email']"),  // Try first
    By.id("email"),                            // Fallback 1
    By.name("email")                           // Fallback 2
};
```

### **#3 Always Clear Before Type**
```java
// Wrong
emailField.sendKeys(email);

// Right
emailField.clear();
emailField.sendKeys(email);
```

### **#4 Wait for Loaders**
```java
// After action, wait for spinner to disappear
loginButton.click();
wait.until(invisibilityOfElementLocated(
    By.cssSelector(".loading, .spinner")
));
```

### **#5 Use Page Object Pattern**
❌ Test file with locators → Hard to maintain  
✅ Page Object with locators → Reusable & clean

---

## ⚙️ Extension Settings

### **Recommended Configuration**

```
Language: Java
Framework: Selenium
LLM Provider: Groq (Free & Fast)
Model: llama-3.3-70b-versatile
Timeout: 10 seconds (default)
```

### **API Keys**

**Groq** (Recommended):
- Free tier: 30 requests/minute
- Fast response (~2-3 seconds)
- URL: https://console.groq.com/keys

**OpenAI** (Alternative):
- Pay-per-use
- Higher quality (GPT-4)
- URL: https://platform.openai.com/api-keys

---

## 📊 Metrics to Track

### **Individual Metrics**
- ✅ Tests created per day
- ✅ Time spent on test creation
- ✅ Code quality score
- ✅ Flaky test percentage

### **Team Metrics**
- ✅ Total time saved (hours/week)
- ✅ Reusable components created
- ✅ Test coverage increase
- ✅ Team productivity (tests/week)

---

## 🎓 Learning Path

### **Beginner (Week 1)**
1. Install extension
2. Record simple login flow
3. Generate BDD scenario
4. Review generated code

### **Intermediate (Week 2-3)**
1. Record multi-page flows
2. Create reusable components
3. Customize prompts
4. Use data-driven tests

### **Advanced (Month 2+)**
1. Build component library
2. Create custom templates
3. Integrate with CI/CD
4. Share with team

---

## 🔗 Quick Links

| Resource | Location |
|----------|----------|
| **Full Documentation** | [README.md](README.md) |
| **Implementation Guide** | [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) |
| **Enterprise Features** | [ENTERPRISE_ENHANCEMENTS.md](ENTERPRISE_ENHANCEMENTS.md) |
| **Executive Proposal** | [EXECUTIVE_PROPOSAL.md](EXECUTIVE_PROPOSAL.md) |
| **Summary** | [SUMMARY.md](SUMMARY.md) |

---

## 🎯 Success Formula

```
✅ Use data-testid attributes (ask devs)
✅ Record cross-page flows
✅ Review generated code (90% ready)
✅ Build component library
✅ Track time savings
✅ Share with team
✅ Iterate and improve

= 40-50% Time Savings + Better Quality + Happy Team
```

---

## 📞 Need Help?

1. Check [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
2. Review troubleshooting section
3. Ask team champions
4. Report issues on GitHub
5. Join Slack #qa-automation

---

**Print this page and keep it handy!** 📄✨
