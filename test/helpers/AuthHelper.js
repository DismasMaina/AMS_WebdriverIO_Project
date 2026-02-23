// test/helpers/AuthHelper.js

/**
 * Authentication Helper
 * Handles login flow with multiple selector strategies and detailed logging
 */

export async function login(username = 'test_maina', password = '8750@Don') {
  console.log('=== LOGIN HELPER STARTED ===');

  try {
    // Step 1: Navigate to application
    await navigateToApp();

    // Step 2: Find and click Sign In button
    await clickSignInButton();

    // Step 3: Fill username field
    await fillUsername(username);

    // Step 4: Fill password field
    await fillPassword(password);

    // Step 5: Show/hide password briefly for verification
    await togglePasswordVisibility();

    // Step 6: Submit login form
    await submitLoginForm();

    console.log('=== LOGIN COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('LOGIN FAILED:', error.message);
    throw error;
  }
}

/**
 * Navigate to the application URL
 */
async function navigateToApp() {
  const appUrl = 'https://hmis-demo.ams.co.ke/';
  const currentUrl = await browser.getUrl();

  // If already on app, just check if logged in
  if (currentUrl.includes('hmis-demo.ams.co.ke')) {
    console.log('Already on application URL, checking login state');
    return;
  }

  console.log(`Navigating to: ${appUrl}`);
  await browser.url(appUrl);
  console.log('Navigation completed');

  // Wait for page to load by checking for body or a common element
  await browser.waitUntil(
    async () => {
      const body = await $('body');
      return body.isDisplayed();
    },
    { timeout: 10000, timeoutMsg: 'Page did not load within 10 seconds' }
  );

  console.log('Page loaded successfully');
}

/**
 * Find and click the Sign In button using multiple selector strategies
 */
async function clickSignInButton() {
  console.log('Looking for Sign In button...');

  // Check if already logged in by looking for dashboard/menu elements
  const alreadyLoggedIn = await checkIfLoggedIn();
  if (alreadyLoggedIn) {
    console.log('✓ Already logged in, skipping sign in');
    return;
  }

  console.log('⚠ Not logged in, searching for Sign In button');

  const signInSelectors = [
    {
      type: 'xpath',
      selector: './/button[contains(., "Sign In") and not(.//button)]',
      description: 'XPath with text contains',
    },
    { type: 'partial', selector: 'button*=Sign', description: 'Partial text match - Sign' },
    { type: 'exact', selector: 'button=Sign In', description: 'Exact text match' },
  ];

  let signInButton = null;
  let foundSelector = null;

  for (const selectorObj of signInSelectors) {
    try {
      const buttons = await $$(selectorObj.selector);
      if (buttons.length > 0) {
        signInButton = buttons[0];
        foundSelector = selectorObj.selector;
        console.log(`✓ Found Sign In button using: ${selectorObj.description}`);
        break;
      }
    } catch (err) {
      console.log(`✗ Selector failed: ${selectorObj.description}`);
    }
  }

  if (!signInButton) {
    // Check again if we're actually logged in (page might have loaded)
    const isLoggedInNow = await checkIfLoggedIn();
    if (isLoggedInNow) {
      console.log('✓ Page loaded as logged in, skipping sign in');
      return;
    }

    // Debug: Log all buttons
    await logAllButtons();
    throw new Error('Sign In button not found. Check button list above.');
  }

  await browser.pause(500);
  await signInButton.click();
  console.log(`✓ Clicked Sign In button`);
  await browser.pause(2000);
}

/**
 * Check if user is already logged in
 */
async function checkIfLoggedIn() {
  try {
    // FIRST: Check if we're ON the login page
    // If username field exists, we're definitely on login page = NOT logged in
    try {
      const loginInputs = await $$('[name="username"]');
      if (loginInputs.length > 0) {
        console.log('⚠ Login form found - NOT logged in');
        return false; // On login page, not logged in
      }
    } catch (err) {
      // Couldn't check, continue
    }

    // SECOND: Look for logged-in indicators (menu, dashboard, etc)
    const loggedInSelectors = [
      'span=Ticketing', // Menu text (most reliable)
      '=Ticketing', // Ticketing menu item
      '[class*="ant-menu"]', // Ant Design menu
      '.ant-menu-title-content', // Menu content
      'button*=Generate', // Generate Ticket button (on ticketing page)
      'input[type="tel"]', // Phone input field (on ticketing page)
    ];

    for (const selector of loggedInSelectors) {
      try {
        const elements = await $$(selector);
        if (elements.length > 0) {
          // Double-check it's actually visible
          try {
            const isVisible = await elements[0].isDisplayed();
            if (isVisible) {
              console.log(`✓ Detected logged-in state (found: ${selector})`);
              return true;
            }
          } catch (visErr) {
            // Element exists but may not be visible, continue checking
          }
        }
      } catch (err) {
        // Continue to next selector
      }
    }

    return false;
  } catch (err) {
    console.log('⚠ Could not determine login state');
    return false;
  }
}

/**
 * Fill username field with typing effect
 */
async function fillUsername(username) {
  try {
    // Check if username field exists
    const fields = await $$('[name="username"]');

    if (fields.length === 0) {
      console.log('⚠ Username field not found - likely already logged in');
      return;
    }

    console.log(`Filling username: ${username}`);
    await fields[0].clearValue();

    // Type each character with small delay for realistic input
    for (let i = 0; i < username.length; i++) {
      await fields[0].addValue(username[i]);
      await browser.pause(80);
    }

    await browser.pause(1000);
    console.log('✓ Username field filled');
  } catch (err) {
    console.log('⚠ Username field error - likely already logged in');
  }
}

/**
 * Fill password field with typing effect
 */
async function fillPassword(password) {
  try {
    // Check if password field exists
    const fields = await $$('[name="password"]');

    if (fields.length === 0) {
      console.log('⚠ Password field not found - likely already logged in');
      return;
    }

    console.log('Filling password field');
    await fields[0].clearValue();

    // Type each character with small delay
    for (let i = 0; i < password.length; i++) {
      await fields[0].addValue(password[i]);
      await browser.pause(40);
    }

    console.log('✓ Password field filled');
  } catch (err) {
    console.log('⚠ Password field error - likely already logged in');
  }
}

/**
 * Toggle password visibility to verify input
 */
async function togglePasswordVisibility() {
  console.log('Toggling password visibility for verification');

  try {
    await browser.execute((sel) => {
      const el = document.querySelector(sel);
      if (el) el.type = 'text';
    }, '[name="password"]');

    await browser.pause(500);

    await browser.execute((sel) => {
      const el = document.querySelector(sel);
      if (el) el.type = 'password';
    }, '[name="password"]');

    console.log('✓ Password visibility toggled');
  } catch (err) {
    console.log('⚠ Password visibility toggle failed (non-critical)');
  }
}

/**
 * Submit the login form using multiple strategies
 */
async function submitLoginForm() {
  console.log('Checking for login form...');

  const submitSelectors = [
    { selector: '[type="submit"]', description: 'Submit button by type' },
    { selector: 'button[type="submit"]', description: 'Submit button element' },
    { selector: 'button*=Sign In', description: 'Sign In button' },
    { selector: '[name="submit"]', description: 'Submit button by name' },
  ];

  let submitted = false;

  for (const selectorObj of submitSelectors) {
    try {
      const buttons = await $$(selectorObj.selector);
      if (buttons.length > 0) {
        await buttons[0].click();
        submitted = true;
        console.log(`✓ Form submitted using: ${selectorObj.description}`);
        break;
      }
    } catch (err) {
      console.log(`✗ Submit selector failed: ${selectorObj.description}`);
    }
  }

  if (!submitted) {
    console.log('⚠ No submit button found - checking if already logged in');
    const isLoggedIn = await checkIfLoggedIn();
    if (isLoggedIn) {
      console.log('✓ Already logged in, skipping form submission');
      return;
    }

    console.log('No submit button found, pressing Enter key');
    await browser.keys('Enter');
  }

  await browser.pause(5000);
  console.log('✓ Login form submission completed');
}

/**
 * Log all buttons on the page for debugging
 */
async function logAllButtons() {
  try {
    const allButtons = await $$('button');
    console.log(`\n=== ALL BUTTONS ON PAGE (${allButtons.length}) ===`);

    for (let i = 0; i < allButtons.length; i++) {
      try {
        const text = await allButtons[i].getText();
        const classes = await allButtons[i].getAttribute('class');
        console.log(`Button ${i}: "${text}" [class="${classes}"]`);
      } catch (err) {
        console.log(`Button ${i}: [unable to read]`);
      }
    }
    console.log('=== END BUTTONS ===\n');
  } catch (err) {
    console.log('Failed to log buttons');
  }
}
