// content.js
// Only initialize if not already initialized
if (!window.elementInspector) {
    class ElementInspector {
        constructor() {
            this.isActive = false;
            this.selectedElements = new Set();
            this.highlightedElement = null;
            this.currentPort = null;
        }

        init() {
            // Add styles for highlighting if you haven't already
            const style = document.createElement('style');
            style.textContent = `
                .genai-highlight {
                    outline: 2px solid var(--color-primary, #ff6b2b) !important;
                    outline-offset: 1px !important;
                    cursor: crosshair !important;
                }
                .genai-selected {
                    outline: 2px dashed var(--color-primary, #ff6b2b) !important;
                    outline-offset: 1px !important;
                    background-color: rgba(255, 107, 43, 0.1) !important;
                }
            `;
            document.head.appendChild(style);

            // Bind event handlers
            this.handleMouseOver = this.handleMouseOver.bind(this);
            this.handleMouseOut = this.handleMouseOut.bind(this);
            this.handleClick = this.handleClick.bind(this);

            // Setup connection listener
            chrome.runtime.onConnect.addListener(this.handleConnection.bind(this));

            // Listen for one-off messages
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                try {
                    switch (message.type) {
                        case 'CLEAR_SELECTION':
                            // Remove highlight from all selected elements
                            this.selectedElements.forEach(element => {
                                element.classList.remove('genai-selected');
                                element.classList.remove('genai-highlight');
                            });
                            this.selectedElements.clear();
                            this.highlightedElement = null;
                            sendResponse({ success: true });
                            break;

                        case 'CLEANUP':
                            this.cleanup();
                            sendResponse({ success: true });
                            break;

                        case 'AUTO_START_INSPECTOR':
                            // Auto-start inspector after page navigation
                            console.log('[content.js] Auto-starting inspector after navigation');
                            this.startInspecting();
                            sendResponse({ success: true });
                            break;

                        default:
                            // no-op
                            break;
                    }
                    return true; // Indicate async
                } catch (error) {
                    console.error('Error handling message:', error);
                    sendResponse({ error: error.message });
                    return true;
                }
            });
        }

        handleConnection(port) {
            this.currentPort = port;
            
            port.onMessage.addListener((message) => {
                if (message.type === 'TOGGLE_INSPECTOR') {
                    if (!this.isActive) {
                        this.startInspecting();
                    } else {
                        this.stopInspecting();
                    }
                    port.postMessage({ 
                        type: 'INSPECTOR_STATE', 
                        isActive: this.isActive,
                        hasContent: this.selectedElements.size > 0 
                    });
                } else if (message.type === 'CLEANUP') {
                    this.cleanup();
                }
            });

            port.onDisconnect.addListener(() => {
                this.cleanup();
                this.currentPort = null;
            });
        }

        startInspecting() {
            this.isActive = true;
            document.addEventListener('mouseover', this.handleMouseOver);
            document.addEventListener('mouseout', this.handleMouseOut);
            document.addEventListener('click', this.handleClick, true);
            document.body.style.cursor = 'crosshair';
            
            // Notify background script that inspector is active
            chrome.runtime.sendMessage({ type: 'SET_INSPECTOR_STATE', isActive: true });
        }

        stopInspecting() {
            this.isActive = false;
            document.removeEventListener('mouseover', this.handleMouseOver);
            document.removeEventListener('mouseout', this.handleMouseOut);
            document.removeEventListener('click', this.handleClick, true);
            document.body.style.cursor = '';

            if (this.highlightedElement) {
                this.highlightedElement.classList.remove('genai-highlight');
                this.highlightedElement = null;
            }
            
            // Notify background script that inspector is inactive
            chrome.runtime.sendMessage({ type: 'SET_INSPECTOR_STATE', isActive: false });
        }

        handleMouseOver(event) {
            if (!this.isActive) return;
            
            event.preventDefault();
            event.stopPropagation();
            
            if (this.highlightedElement) {
                this.highlightedElement.classList.remove('genai-highlight');
            }
            
            this.highlightedElement = event.target;
            this.highlightedElement.classList.add('genai-highlight');
        }

        handleMouseOut(event) {
            if (!this.isActive) return;
            
            event.preventDefault();
            event.stopPropagation();
            
            if (this.highlightedElement) {
                this.highlightedElement.classList.remove('genai-highlight');
                this.highlightedElement = null;
            }
        }

        handleClick(event) {
            if (!this.isActive) return;
            
            event.preventDefault();
            event.stopPropagation();
            
            const element = event.target;

            // Toggle selection for multi-element usage
            if (this.selectedElements.has(element)) {
                // If already selected, unselect it
                this.selectedElements.delete(element);
                element.classList.remove('-selected');
            } else {
                // Otherwise add it
                this.selectedElements.add(element);
                element.classList.add('genai-selected');
            }

            // Build aggregated DOM content from all selected elements
            const domContent = Array.from(this.selectedElements)
                .map(el => el.outerHTML)
                .join('\n');

            console.log('[content.js] Built snippet (string?):', domContent);
            console.log('[content.js] Type is:', typeof domContent); 

            // Extract element metadata for better recording
            const elementInfo = this.extractElementInfo(element);

            // Send updated content to the extension (background)
            chrome.runtime.sendMessage({
                type: 'SELECTED_DOM_CONTENT',
                content: domContent,
                elementInfo: elementInfo
            });
        }

        extractElementInfo(element) {
            // Extract useful information about the element
            const locators = this.generateMultipleLocators(element);
            const actionType = this.detectActionType(element);
            
            return {
                tagName: element.tagName,
                id: element.id,
                className: element.className,
                text: element.textContent?.trim().substring(0, 100), // First 100 chars
                attributes: {
                    type: element.type,
                    name: element.name,
                    placeholder: element.placeholder,
                    href: element.href,
                    src: element.src,
                    value: element.value,
                    'aria-label': element.getAttribute('aria-label'),
                    'aria-labelledby': element.getAttribute('aria-labelledby'),
                    'data-testid': element.getAttribute('data-testid'),
                    'data-test': element.getAttribute('data-test'),
                    'data-qa': element.getAttribute('data-qa'),
                    'role': element.getAttribute('role'),
                    'title': element.getAttribute('title')
                },
                // Legacy single locators (for backward compatibility)
                xpath: this.getXPath(element),
                cssSelector: this.getCssSelector(element),
                // NEW: Multiple locator strategies with scores
                locators: locators,
                // NEW: Detected action type
                actionType: actionType,
                // NEW: Smart wait recommendation
                waitStrategy: this.getWaitStrategy(element, actionType),
                // NEW: BDD step suggestion
                bddStep: this.generateBDDStep(element, actionType)
            };
        }

        generateMultipleLocators(element) {
            const locators = [];
            
            // Strategy 1: data-testid (Highest priority - most stable)
            const testId = element.getAttribute('data-testid') || 
                          element.getAttribute('data-test') || 
                          element.getAttribute('data-qa');
            if (testId) {
                locators.push({
                    type: 'data-testid',
                    value: `[data-testid="${testId}"]`,
                    score: 95,
                    priority: 1,
                    reason: 'Dedicated test attribute - most stable'
                });
            }
            
            // Strategy 2: ID (High priority if unique)
            if (element.id && !element.id.match(/^(ember|react|vue|ng)\d+/)) {
                const isUnique = document.querySelectorAll(`#${element.id}`).length === 1;
                locators.push({
                    type: 'id',
                    value: `#${element.id}`,
                    score: isUnique ? 90 : 70,
                    priority: 2,
                    reason: isUnique ? 'Unique ID' : 'ID exists but may not be unique'
                });
            }
            
            // Strategy 3: Name attribute (for form elements)
            if (element.name) {
                locators.push({
                    type: 'name',
                    value: `[name="${element.name}"]`,
                    score: 85,
                    priority: 3,
                    reason: 'Name attribute - stable for forms'
                });
            }
            
            // Strategy 4: Accessibility attributes
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel) {
                locators.push({
                    type: 'aria-label',
                    value: `[aria-label="${ariaLabel}"]`,
                    score: 88,
                    priority: 2,
                    reason: 'Accessibility label - semantic and stable'
                });
            }
            
            // Strategy 5: Text-based XPath (for buttons, links)
            const text = element.textContent?.trim();
            if (text && text.length > 0 && text.length < 50) {
                const tag = element.tagName.toLowerCase();
                if (['button', 'a', 'span', 'div'].includes(tag)) {
                    locators.push({
                        type: 'xpath-text',
                        value: `//${tag}[text()="${text}"]`,
                        score: 75,
                        priority: 4,
                        reason: 'Text content - readable but may change'
                    });
                }
            }
            
            // Strategy 6: Smart CSS selector
            const smartCss = this.getSmartCssSelector(element);
            if (smartCss) {
                locators.push({
                    type: 'css',
                    value: smartCss,
                    score: 80,
                    priority: 3,
                    reason: 'Optimized CSS selector'
                });
            }
            
            // Strategy 7: XPath (Fallback - least stable)
            const xpath = this.getXPath(element);
            locators.push({
                type: 'xpath',
                value: xpath,
                score: 60,
                priority: 5,
                reason: 'Absolute XPath - fragile fallback'
            });
            
            // Sort by priority
            return locators.sort((a, b) => a.priority - b.priority);
        }

        detectActionType(element) {
            const tag = element.tagName.toLowerCase();
            const type = element.type?.toLowerCase();
            const role = element.getAttribute('role');
            
            // Click actions
            if (tag === 'button' || type === 'button' || type === 'submit' || role === 'button') {
                return {
                    action: 'CLICK',
                    description: 'Click button',
                    selenium: 'click()',
                    waitBefore: 'elementToBeClickable'
                };
            }
            
            if (tag === 'a' || role === 'link') {
                return {
                    action: 'CLICK',
                    description: 'Click link',
                    selenium: 'click()',
                    waitBefore: 'elementToBeClickable',
                    waitAfter: 'pageLoad'
                };
            }
            
            // Input actions
            if (tag === 'input') {
                if (type === 'checkbox' || type === 'radio') {
                    return {
                        action: 'SELECT',
                        description: `${type === 'checkbox' ? 'Check' : 'Select'} option`,
                        selenium: 'click()',
                        waitBefore: 'elementToBeClickable'
                    };
                }
                if (type === 'text' || type === 'email' || type === 'password' || type === 'search' || !type) {
                    return {
                        action: 'TYPE',
                        description: 'Enter text',
                        selenium: 'sendKeys(String text)',
                        waitBefore: 'visibilityOfElement',
                        clearBefore: true
                    };
                }
                if (type === 'file') {
                    return {
                        action: 'UPLOAD',
                        description: 'Upload file',
                        selenium: 'sendKeys(String filePath)',
                        waitBefore: 'presenceOfElement'
                    };
                }
            }
            
            if (tag === 'textarea') {
                return {
                    action: 'TYPE',
                    description: 'Enter text',
                    selenium: 'sendKeys(String text)',
                    waitBefore: 'visibilityOfElement',
                    clearBefore: true
                };
            }
            
            if (tag === 'select') {
                return {
                    action: 'SELECT_DROPDOWN',
                    description: 'Select from dropdown',
                    selenium: 'new Select(element).selectByVisibleText(String text)',
                    waitBefore: 'elementToBeClickable'
                };
            }
            
            // Default to click
            return {
                action: 'CLICK',
                description: 'Click element',
                selenium: 'click()',
                waitBefore: 'elementToBeClickable'
            };
        }

        getWaitStrategy(element, actionType) {
            const strategies = [];
            
            // Pre-action wait
            if (actionType.waitBefore) {
                strategies.push({
                    timing: 'before',
                    type: actionType.waitBefore,
                    timeout: 10,
                    description: `Wait for element to be ${actionType.waitBefore.replace('elementToBe', '').replace('Of', ' of ')}`
                });
            }
            
            // Post-action wait (for navigation, AJAX, etc.)
            if (actionType.waitAfter === 'pageLoad') {
                strategies.push({
                    timing: 'after',
                    type: 'urlChange',
                    timeout: 10,
                    description: 'Wait for page navigation to complete'
                });
            }
            
            // Check for loading indicators
            const commonLoaders = [
                '.loading', '.spinner', '[data-loading="true"]',
                '.loader', '#loading', '.progress'
            ];
            strategies.push({
                timing: 'after',
                type: 'invisibilityOfLoader',
                selectors: commonLoaders,
                timeout: 30,
                description: 'Wait for loading indicators to disappear'
            });
            
            return strategies;
        }

        generateBDDStep(element, actionType) {
            const text = element.textContent?.trim() || '';
            const placeholder = element.getAttribute('placeholder') || '';
            const ariaLabel = element.getAttribute('aria-label') || '';
            const name = element.name || '';
            
            const label = text || ariaLabel || placeholder || name || 'element';
            
            switch (actionType.action) {
                case 'CLICK':
                    return `When I click the "${label}" button`;
                case 'TYPE':
                    return `When I enter "<text>" in the "${label}" field`;
                case 'SELECT':
                    return `When I check the "${label}" checkbox`;
                case 'SELECT_DROPDOWN':
                    return `When I select "<option>" from the "${label}" dropdown`;
                case 'UPLOAD':
                    return `When I upload a file to "${label}"`;
                default:
                    return `When I interact with "${label}"`;
            }
        }

        getSmartCssSelector(element) {
            // Try to build a unique, stable CSS selector
            const parts = [];
            let current = element;
            let depth = 0;
            
            while (current && current !== document.body && depth < 4) {
                let selector = current.tagName.toLowerCase();
                
                // Prefer ID
                if (current.id && !current.id.match(/^(ember|react|vue|ng)\d+/)) {
                    return `#${current.id}`;
                }
                
                // Use meaningful classes (avoid framework-generated ones)
                const meaningfulClasses = Array.from(current.classList || [])
                    .filter(cls => !cls.match(/^(ng-|_|ember|css-|makeStyles)/))
                    .slice(0, 2);
                
                if (meaningfulClasses.length > 0) {
                    selector += '.' + meaningfulClasses.join('.');
                }
                
                // Add nth-child if needed for uniqueness
                if (current.parentElement) {
                    const siblings = Array.from(current.parentElement.children);
                    const sameTagSiblings = siblings.filter(s => s.tagName === current.tagName);
                    if (sameTagSiblings.length > 1) {
                        const index = siblings.indexOf(current) + 1;
                        selector += `:nth-child(${index})`;
                    }
                }
                
                parts.unshift(selector);
                current = current.parentElement;
                depth++;
            }
            
            return parts.join(' > ');
        }

        getXPath(element) {
            if (element.id !== '') {
                return 'id("' + element.id + '")';
            }
            if (element === document.body) {
                return element.tagName;
            }
            let ix = 0;
            const siblings = element.parentNode?.childNodes || [];
            for (let i = 0; i < siblings.length; i++) {
                const sibling = siblings[i];
                if (sibling === element) {
                    return this.getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
                }
                if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                    ix++;
                }
            }
        }

        getCssSelector(element) {
            if (element.id) {
                return '#' + element.id;
            }
            if (element.className) {
                const classes = element.className.split(' ')
                    .filter(c => c && !c.startsWith('genai-'))
                    .join('.');
                if (classes) {
                    return element.tagName.toLowerCase() + '.' + classes;
                }
            }
            return element.tagName.toLowerCase();
        }

        cleanup() {
            this.stopInspecting();
            this.selectedElements.forEach(element => {
                element.classList.remove('genai-selected');
            });
            this.selectedElements.clear();
        }
    }

    // Initialize and store in window object
    window.elementInspector = new ElementInspector();
    window.elementInspector.init();
}
