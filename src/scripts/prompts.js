/**
 * Collection of default prompts for different use cases (ICE POT Format)
 */
export const DEFAULT_PROMPTS = {
 
  /**
   * Selenium Java Page Object Prompt (No Test Class)
   */
  SELENIUM_JAVA_PAGE_ONLY: `
    Instructions:
    - Generate ONLY a Selenium Java Page Object Class (no test code).
    - Add JavaDoc for methods & class.
    - Use Selenium 2.30+ compatible imports.
    - Use meaningful method names.
    - Do NOT include explanations or test code.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`

    Example:
    \`\`\`java
    package com.automation.pages;

    /**
     * Page Object for Component Page
     */
    public class ComponentPage {
        // Add methods as per the DOM
    }
    \`\`\`

    Persona:
    - Audience: Automation engineer focusing on maintainable POM structure.

    Output Format:
    - A single Java class inside a \`\`\`java\`\`\` block.

    Tone:
    - Clean, maintainable, enterprise-ready.
  `,

  /**
   * BDD Feature File Only Prompt (Gherkin)
   */
  CUCUMBER_ONLY: `
    Instructions:
    - Generate ONLY a BDD feature file (.feature) with Gherkin syntax.
    - Compatible with Cucumber (Java), Behave (Python), pytest-bdd (Python), and other BDD frameworks.
    - Use Scenario Outline with Examples table.
    - Make sure every step is relevant to the provided DOM.
    - Do not combine multiple actions into one step.
    - Use South India realistic dataset (names, addresses, pin codes, mobile numbers).
    - Use dropdown values only from provided DOM.
    - Generate multiple scenarios if applicable.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`

    Example:
    \`\`\`gherkin
    Feature: Login to OpenTaps

    Scenario Outline: Successful login with valid credentials
      Given I open the login page
      When I type "<username>" into the Username field
      And I type "<password>" into the Password field
      And I click the Login button
      Then I should be logged in successfully

    Examples:
      | username   | password  |
      | testuser   | testpass  |
      | admin      | admin123  |
    \`\`\`

    Persona:
    - Audience: BDD testers who only need feature files (Behave, Cucumber, pytest-bdd).

    Output Format:
    - Only valid Gherkin in a \`\`\`gherkin\`\`\` block.

    Tone:
    - Clear, structured, executable.
  `,

  /**
   * Cucumber with Step Definitions
   */
  CUCUMBER_WITH_SELENIUM_JAVA_STEPS: `
    Instructions:
    - Generate BOTH:
      1. A Cucumber .feature file.
      2. A Java step definition class for selenium.
    - Do NOT include Page Object code.
    - Step defs must include WebDriver setup, explicit waits, and actual Selenium code.
    - Use Scenario Outline with Examples table (South India realistic data).

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`
    URL: \${pageUrl}

    Example:
    \`\`\`gherkin
    Feature: Login to OpenTaps

    Scenario Outline: Successful login with valid credentials
      Given I open the login page
      When I type "<username>" into the Username field
      And I type "<password>" into the Password field
      And I click the Login button
      Then I should be logged in successfully

    Examples:
      | username   | password  |
\      | "admin"    | "admin123"|
    \`\`\`

    \`\`\`java
    package com.automation.stepdefs;

    import io.cucumber.java.en.*;
    import org.openqa.selenium.*;
    import org.openqa.selenium.chrome.ChromeDriver;
    import org.openqa.selenium.support.ui.*;

    public class LoginStepDefinitions {
        private WebDriver driver;
        private WebDriverWait wait;

        @io.cucumber.java.Before
        public void setUp() {
            driver = new ChromeDriver();
            wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            driver.manage().window().maximize();
        }

        @io.cucumber.java.After
        public void tearDown() {
            if (driver != null) driver.quit();
        }

        @Given("I open the login page")
        public void openLoginPage() {
            driver.get("\${pageUrl}");
        }

        @When("I type {string} into the Username field")
        public void enterUsername(String username) {
            WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.id("username")));
            el.sendKeys(username);
        }

        @When("I type {string} into the Password field")
        public void enterPassword(String password) {
            WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.id("password")));
            el.sendKeys(password);
        }

        @When("I click the Login button")
        public void clickLogin() {
            driver.findElement(By.xpath("//button[contains(text(),'Login')]")).click();
        }

        @Then("I should be logged in successfully")
        public void verifyLogin() {
            WebElement success = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("success")));
            assert success.isDisplayed();
        }
    }
    \`\`\`

    Persona:
    - Audience: QA engineers working with Cucumber & Selenium.

    Output Format:
    - Gherkin in \`\`\`gherkin\`\`\` block + Java code in \`\`\`java\`\`\` block.

    Tone:
    - Professional, executable, structured.
  `,

  /**
   * Playwright Python Page Object Prompt (No Test Class)
   */
  PLAYWRIGHT_PYTHON_PAGE_ONLY: `
    Instructions:
    - Generate ONLY a Playwright Python Page Object Class (no test code).
    - Add docstrings for methods & class.
    - Use Playwright for Python (playwright library).
    - Use synchronous API (not async/await) for Behave compatibility.
    - Use meaningful method names.
    - Do NOT include explanations or test code.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`

    Example:
    \`\`\`python
    from playwright.sync_api import Page

    class ComponentPage:
        """Page Object for Component Page"""
        
        def __init__(self, page: Page):
            self.page = page
            
        def navigate(self, url: str):
            """Navigate to the specified URL"""
            self.page.goto(url)
            self.page.wait_for_load_state("networkidle")
            
        # Add methods as per the DOM
    \`\`\`

    Persona:
    - Audience: Automation engineer focusing on maintainable POM structure with Python & Playwright.

    Output Format:
    - A single Python class inside a \`\`\`python\`\`\` block.

    Tone:
    - Clean, maintainable, modern, pythonic.
  `,

  /**
   * Behave BDD with Playwright Python Step Definitions
   */
  BEHAVE_WITH_PLAYWRIGHT_PYTHON_STEPS: `
    Instructions:
    - Generate THREE files:
      1. A Behave (.feature) file with Gherkin syntax.
      2. An environment.py file for browser setup/teardown.
      3. A Python step definition file using Behave with Playwright.
    - Do NOT include Page Object code.
    - Use Behave framework (not pytest-bdd or Cucumber).
    - Step defs must use context object and Playwright sync API.
    - Use Scenario Outline with Examples table (South India realistic data).
    - Include proper browser context and page management.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`
    URL: \${pageUrl}

    Example:
    \`\`\`gherkin
    Feature: Login to Application

    Scenario Outline: Successful login with valid credentials
      Given I open the login page
      When I type "<username>" into the Username field
      And I type "<password>" into the Password field
      And I click the Login button
      Then I should be logged in successfully

    Examples:
      | username   | password  |
      | testuser   | testpass  |
      | admin      | admin123  |
    \`\`\`

    \`\`\`python
    # environment.py
    from playwright.sync_api import sync_playwright

    def before_all(context):
        """Initialize playwright before all tests"""
        context.playwright = sync_playwright().start()
        context.browser = context.playwright.chromium.launch(headless=False)

    def before_scenario(context, scenario):
        """Create new browser context and page for each scenario"""
        context.context = context.browser.new_context(viewport={'width': 1920, 'height': 1080})
        context.page = context.context.new_page()

    def after_scenario(context, scenario):
        """Close browser context after each scenario"""
        context.page.close()
        context.context.close()

    def after_all(context):
        """Close browser and playwright after all tests"""
        context.browser.close()
        context.playwright.stop()
    \`\`\`

    \`\`\`python
    # steps/login_steps.py
    from behave import given, when, then
    from playwright.sync_api import expect

    @given("I open the login page")
    def open_login_page(context):
        """Navigate to login page"""
        context.page.goto("\${pageUrl}")
        context.page.wait_for_load_state("networkidle")

    @when('I type "{username}" into the Username field')
    def enter_username(context, username):
        """Enter username into the username field"""
        context.page.fill('input#username', username)

    @when('I type "{password}" into the Password field')
    def enter_password(context, password):
        """Enter password into the password field"""
        context.page.fill('input#password', password)

    @when("I click the Login button")
    def click_login(context):
        """Click the login button"""
        context.page.click('button:has-text("Login")')

    @then("I should be logged in successfully")
    def verify_login(context):
        """Verify successful login"""
        expect(context.page.locator('.success')).to_be_visible()
    \`\`\`

    Persona:
    - Audience: Python QA engineers working with Behave BDD & Playwright.

    Output Format:
    - Gherkin in \`\`\`gherkin\`\`\` block + environment.py in \`\`\`python\`\`\` block + step definitions in \`\`\`python\`\`\` block.

    Tone:
    - Professional, pythonic, modern, Behave-idiomatic.
  `
};

/**
 * Helper function to escape code blocks in prompts
 */
function escapeCodeBlocks(text) {
  return text.replace(/```/g, '\\`\\`\\`');
}

/**
 * Function to fill template variables in a prompt
 */
export function getPrompt(promptKey, variables = {}) {
  let prompt = DEFAULT_PROMPTS[promptKey];
  if (!prompt) {
    throw new Error(`Prompt not found: ${promptKey}`);
  }

  Object.entries(variables).forEach(([k, v]) => {
    const regex = new RegExp(`\\$\\{${k}\\}`, 'g');
    prompt = prompt.replace(regex, v);
  });

  return prompt.trim();
}

export const CODE_GENERATOR_TYPES = {
  SELENIUM_JAVA_PAGE_ONLY: 'Selenium-Java-Page-Only',
  CUCUMBER_ONLY: 'Cucumber-Only',
  CUCUMBER_WITH_SELENIUM_JAVA_STEPS: 'Cucumber-With-Selenium-Java-Steps',
  PLAYWRIGHT_PYTHON_PAGE_ONLY: 'Playwright-Python-Page-Only',
  BEHAVE_WITH_PLAYWRIGHT_PYTHON_STEPS: 'Behave-With-Playwright-Python-Steps',
};
