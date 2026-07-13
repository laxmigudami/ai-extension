/**
 * Enhanced Prompts with Smart Locator Strategy and Action Detection
 */

export const ENHANCED_PROMPTS = {
  
  /**
   * Enhanced Selenium Java Page Object with Multi-Locator Fallback
   */
  SELENIUM_JAVA_SMART_PAGE: `
    Instructions:
    - Generate a Selenium Java Page Object Class with SMART MULTI-LOCATOR STRATEGY
    - Include multiple @FindBy annotations with fallback locators (ordered by stability)
    - Add explicit waits based on element action types
    - Include JavaDoc with locator strategy explanation
    - Use Page Factory pattern
    - Include helper methods with proper waits
    
    CRITICAL: Use the provided locator strategies in priority order:
    1. data-testid (most stable)
    2. id attribute
    3. name attribute
    4. aria-label (accessibility)
    5. CSS selector
    6. XPath (least stable - fallback only)

    Context:
    Element Information (JSON):
    \`\`\`json
    \${elementInfo}
    \`\`\`
    
    DOM Snippet:
    \`\`\`html
    \${domContent}
    \`\`\`
    
    Page URL: \${pageUrl}

    Example Output:
    \`\`\`java
    package com.automation.pages;

    import org.openqa.selenium.*;
    import org.openqa.selenium.support.*;
    import org.openqa.selenium.support.ui.*;
    import java.time.Duration;

    /**
     * Page Object for Login Page
     * Generated with Smart Locator Strategy for maximum stability
     */
    public class LoginPage {
        private WebDriver driver;
        private WebDriverWait wait;
        
        public LoginPage(WebDriver driver) {
            this.driver = driver;
            this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            PageFactory.initElements(driver, this);
        }
        
        /**
         * Email Input Field
         * Primary: data-testid (Score: 95) - Most stable
         * Fallback: id attribute (Score: 85)
         * Fallback: name attribute (Score: 80)
         */
        @FindBy(css = "[data-testid='email-input']")
        private WebElement emailField;
        
        /**
         * Password Input Field  
         * Primary: data-testid (Score: 95)
         * Fallback: CSS selector (Score: 80)
         */
        @FindBy(css = "[data-testid='password-input']")
        private WebElement passwordField;
        
        /**
         * Login Button
         * Primary: data-testid (Score: 95)
         * Fallback: XPath by text (Score: 75)
         */
        @FindBy(css = "[data-testid='login-btn']")
        private WebElement loginButton;
        
        /**
         * Enter email address
         * Wait Strategy: Wait for element to be visible
         * Action: TYPE (clear before entering)
         */
        public void enterEmail(String email) {
            WebElement element = wait.until(ExpectedConditions.visibilityOf(emailField));
            element.clear();
            element.sendKeys(email);
        }
        
        /**
         * Enter password
         * Wait Strategy: Wait for element to be visible
         * Action: TYPE (clear before entering)
         */
        public void enterPassword(String password) {
            WebElement element = wait.until(ExpectedConditions.visibilityOf(passwordField));
            element.clear();
            element.sendKeys(password);
        }
        
        /**
         * Click login button
         * Wait Strategy: Wait for element to be clickable
         * Post-action: Wait for page navigation
         */
        public void clickLogin() {
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(loginButton));
            element.click();
            // Wait for potential loading spinner
            wait.until(ExpectedConditions.invisibilityOfElementLocated(
                By.cssSelector(".loading, .spinner, [data-loading='true']")
            ));
        }
        
        /**
         * Complete login flow
         */
        public void login(String email, String password) {
            enterEmail(email);
            enterPassword(password);
            clickLogin();
        }
    }
    \`\`\`

    Persona:
    - Audience: Senior automation engineers who need robust, maintainable tests

    Output Format:
    - Single Java class in \`\`\`java\`\`\` block
    - Include all locator strategies from element info
    - Add wait strategies based on action types

    Tone:
    - Enterprise-grade, production-ready, defensive programming
  `,

  /**
   * Enhanced BDD Feature with Smart Step Generation
   */
  ENHANCED_BDD_FEATURE: `
    Instructions:
    - Generate a comprehensive BDD Feature file using recorded flow information
    - Use proper Gherkin syntax (Given/When/Then/And/But)
    - Include tags for organization (@smoke, @regression, @critical)
    - Generate BOTH positive and negative scenarios
    - Include Scenario Outlines with Examples for data-driven testing
    - Use descriptive scenario names based on business value
    - Add Background section for common setup steps
    
    CRITICAL RULES:
    - Each step should be atomic (one action per step)
    - Use business language, not technical details
    - Steps should be reusable across scenarios
    - Include proper assertions (Then steps)
    - Generate realistic test data for Examples

    Context:
    Recorded Flow:
    \`\`\`json
    \${recordingSteps}
    \`\`\`
    
    Element Actions Detected:
    \${elementActions}
    
    Page URL: \${pageUrl}

    Example Output:
    \`\`\`gherkin
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
        And I should see the welcome message "Welcome back, <name>"
        And the user profile icon should be visible
        
        Examples:
          | email              | password    | name         |
          | test@example.com   | Test@123    | Test User    |
          | admin@example.com  | Admin@456   | Admin User   |
          | user@example.com   | User@789    | Regular User |
      
      @negative
      Scenario: Login fails with invalid email
        When I enter "invalid-email" in the email field
        And I enter "Test@123" in the password field
        And I click the login button
        Then I should see an error message "Invalid email format"
        And I should remain on the login page
      
      @negative
      Scenario: Login fails with incorrect password
        When I enter "test@example.com" in the email field
        And I enter "WrongPassword" in the password field
        And I click the login button
        Then I should see an error message "Invalid credentials"
        And the password field should be cleared
        And I should remain on the login page
      
      @negative @boundary
      Scenario: Login fails with empty credentials
        When I click the login button without entering credentials
        Then I should see validation errors
        And the email field should show "Email is required"
        And the password field should show "Password is required"
    \`\`\`

    Persona:
    - Audience: Product owners, QA analysts, and automation engineers

    Output Format:
    - Valid Gherkin in \`\`\`gherkin\`\`\` block
    - Include multiple scenarios (positive + negative)
    - Use Scenario Outline for data-driven tests

    Tone:
    - Business-focused, clear, comprehensive
  `,

  /**
   * Enhanced Cucumber Step Definitions with Smart Waits
   */
  ENHANCED_CUCUMBER_STEPS: `
    Instructions:
    - Generate Cucumber Step Definitions in Java with SMART WAIT STRATEGIES
    - Use explicit waits based on element action types
    - Include Page Object integration
    - Add proper error handling and logging
    - Use multi-locator fallback strategy
    - Include reusable utility methods
    
    WAIT STRATEGIES BY ACTION TYPE:
    - CLICK: Wait for elementToBeClickable
    - TYPE: Wait for visibilityOfElement, then clear before typing
    - SELECT: Wait for elementToBeClickable
    - NAVIGATE: Wait for URL change or page load
    - VERIFY: Wait for visibilityOfElement
    - Always wait for loading spinners to disappear after actions

    Context:
    Element Information:
    \`\`\`json
    \${elementInfo}
    \`\`\`
    
    BDD Steps:
    \${bddSteps}
    
    Page URL: \${pageUrl}

    Example Output:
    \`\`\`java
    package com.automation.stepdefs;

    import io.cucumber.java.en.*;
    import io.cucumber.java.Before;
    import io.cucumber.java.After;
    import org.openqa.selenium.*;
    import org.openqa.selenium.chrome.ChromeDriver;
    import org.openqa.selenium.support.ui.*;
    import java.time.Duration;
    import java.util.logging.Logger;

    public class LoginStepDefinitions {
        private static final Logger LOGGER = Logger.getLogger(LoginStepDefinitions.class.getName());
        private WebDriver driver;
        private WebDriverWait wait;
        
        @Before
        public void setUp() {
            driver = new ChromeDriver();
            wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            driver.manage().window().maximize();
            LOGGER.info("Browser initialized successfully");
        }
        
        @After
        public void tearDown() {
            if (driver != null) {
                driver.quit();
                LOGGER.info("Browser closed");
            }
        }
        
        @Given("I am on the login page")
        public void navigateToLoginPage() {
            driver.get("\${pageUrl}");
            wait.until(ExpectedConditions.urlToBe("\${pageUrl}"));
            LOGGER.info("Navigated to login page");
        }
        
        @Given("the page has fully loaded")
        public void waitForPageLoad() {
            // Wait for common loading indicators to disappear
            try {
                wait.until(ExpectedConditions.invisibilityOfElementLocated(
                    By.cssSelector(".loading, .spinner, [data-loading='true']")
                ));
            } catch (TimeoutException e) {
                LOGGER.fine("No loading indicator found - page likely already loaded");
            }
            LOGGER.info("Page fully loaded");
        }
        
        @When("I enter {string} in the email field")
        public void enterEmail(String email) {
            // Multi-locator fallback strategy
            By[] locators = {
                By.cssSelector("[data-testid='email-input']"),  // Priority 1: data-testid
                By.id("email"),                                   // Priority 2: id
                By.name("email"),                                 // Priority 3: name
                By.cssSelector("input[type='email']")            // Priority 4: CSS
            };
            
            WebElement emailField = findElementWithFallback(locators);
            wait.until(ExpectedConditions.visibilityOf(emailField));
            emailField.clear();
            emailField.sendKeys(email);
            LOGGER.info("Entered email: " + email);
        }
        
        @When("I enter {string} in the password field")
        public void enterPassword(String password) {
            By[] locators = {
                By.cssSelector("[data-testid='password-input']"),
                By.id("password"),
                By.name("password"),
                By.cssSelector("input[type='password']")
            };
            
            WebElement passwordField = findElementWithFallback(locators);
            wait.until(ExpectedConditions.visibilityOf(passwordField));
            passwordField.clear();
            passwordField.sendKeys(password);
            LOGGER.info("Entered password");
        }
        
        @When("I click the login button")
        public void clickLoginButton() {
            By[] locators = {
                By.cssSelector("[data-testid='login-btn']"),
                By.id("loginBtn"),
                By.xpath("//button[contains(text(),'Login') or contains(text(),'Sign In')]")
            };
            
            WebElement loginButton = findElementWithFallback(locators);
            wait.until(ExpectedConditions.elementToBeClickable(loginButton));
            loginButton.click();
            
            // Wait for loading to complete
            waitForLoadingToComplete();
            LOGGER.info("Clicked login button");
        }
        
        @Then("I should be redirected to the dashboard")
        public void verifyRedirectToDashboard() {
            wait.until(ExpectedConditions.urlContains("/dashboard"));
            String currentUrl = driver.getCurrentUrl();
            assert currentUrl.contains("/dashboard") : "Expected to be on dashboard, but was on: " + currentUrl;
            LOGGER.info("Successfully redirected to dashboard");
        }
        
        @Then("I should see the welcome message {string}")
        public void verifyWelcomeMessage(String expectedMessage) {
            By welcomeLocator = By.cssSelector(".welcome-message, [data-testid='welcome']");
            WebElement welcomeElement = wait.until(ExpectedConditions.visibilityOfElementLocated(welcomeLocator));
            String actualMessage = welcomeElement.getText();
            assert actualMessage.contains(expectedMessage) : 
                "Expected message to contain: " + expectedMessage + ", but got: " + actualMessage;
            LOGGER.info("Welcome message verified");
        }
        
        /**
         * Utility: Find element with multi-locator fallback
         */
        private WebElement findElementWithFallback(By[] locators) {
            for (By locator : locators) {
                try {
                    return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
                } catch (TimeoutException e) {
                    LOGGER.fine("Locator failed, trying next: " + locator);
                }
            }
            throw new NoSuchElementException("Element not found with any of the provided locators");
        }
        
        /**
         * Utility: Wait for common loading indicators to disappear
         */
        private void waitForLoadingToComplete() {
            try {
                wait.until(ExpectedConditions.invisibilityOfElementLocated(
                    By.cssSelector(".loading, .spinner, .loader, [data-loading='true']")
                ));
            } catch (TimeoutException e) {
                LOGGER.fine("No loading indicator found");
            }
        }
    }
    \`\`\`

    Persona:
    - Audience: Automation engineers building production-grade test suites

    Output Format:
    - Complete Java step definitions in \`\`\`java\`\`\` block
    - Include multi-locator fallback
    - Add smart waits and error handling

    Tone:
    - Production-ready, robust, well-documented
  `
};

export function getEnhancedPrompt(type, data) {
  const template = ENHANCED_PROMPTS[type];
  if (!template) return null;
  
  // Replace placeholders with actual data
  return template
    .replace(/\$\{elementInfo\}/g, JSON.stringify(data.elementInfo, null, 2))
    .replace(/\$\{domContent\}/g, data.domContent || '')
    .replace(/\$\{pageUrl\}/g, data.pageUrl || window.location.href)
    .replace(/\$\{recordingSteps\}/g, JSON.stringify(data.recordingSteps, null, 2))
    .replace(/\$\{elementActions\}/g, data.elementActions || '')
    .replace(/\$\{bddSteps\}/g, data.bddSteps || '');
}
