// test/helpers/OutpatientHelper.js

import { login } from './AuthHelper.js';

/**
 * Patient Attendance By Pay Mode Report Helper
 *
 * Menu structure (from actual DOM inspection):
 *   Reports  ← li.ant-menu-item-group  (NOT a submenu!)
 *     └─ Hospital Operations  ← li.ant-menu-submenu  data-menu-id="...-reports-hospital-operations"
 *         └─ Outpatient  ← a[href="/reports/hospital/outpatient-reports"]
 *
 * The Patient Attendance By Pay Mode report is one of the cards on that Outpatient page.
 */

/**
 * Navigate to the Patient Attendance By Pay Mode report.
 *
 * Strategy:
 *   1. Login
 *   2. Navigate via sidebar to the Outpatient reports page
 *   3. Click the Patient Attendance By Pay Mode report card/link
 */
async function navigateToPatientAttendanceReport() {
  console.log('=== NAVIGATING TO PATIENT ATTENDANCE REPORT ===');

  try {
    // STEP 1: Login (handles already-logged-in state gracefully)
    await login();

    // STEP 2: Navigate via sidebar to Outpatient reports page
    await navigateViaSidebar();

    // STEP 3: Find the Patient Attendance By Pay Mode report link/card
    const reportLink = await findPatientAttendanceLink();

    if (!reportLink) {
      throw new Error(
        'Patient Attendance By Pay Mode link not found on the Outpatient reports page. ' +
          'Current URL: ' +
          (await browser.getUrl())
      );
    }

    await reportLink.click();
    await browser.pause(2000);
    console.log('✔ Patient Attendance By Pay Mode report page opened');
  } catch (error) {
    console.error('Failed to navigate to Patient Attendance report:', error.message);
    throw error;
  }
}

/**
 * Find the Patient Attendance By Pay Mode link on the current page.
 */
async function findPatientAttendanceLink() {
  const selectors = [
    '//a[contains(., "Patient Attendance")]',
    '//span[contains(., "Patient Attendance")]//ancestor::a',
    'a*=Patient Attendance',
    '//div[contains(., "Patient Attendance By Pay Mode")]//ancestor::a',
  ];

  for (const selector of selectors) {
    try {
      const items = await $$(selector);
      if (items.length > 0) {
        console.log(`✔ Found Patient Attendance link using: ${selector}`);
        return items[0];
      }
    } catch (e) {
      // continue
    }
  }
  return null;
}

/**
 * Sidebar menu fallback navigation.
 *
 * From the actual DOM:
 *  - "Reports" is an  li.ant-menu-item-group  — search its group title text
 *  - "Hospital Operations" is an  li.ant-menu-submenu  inside that group
 *  - "Outpatient" is an  <a href="/reports/hospital/outpatient-reports">
 *
 * The menu has style="height: 92vh; overflow-y: scroll" so scrolling is needed.
 */
async function navigateViaSidebar() {
  console.log('Navigating via sidebar menu...');

  // Wait for the sidebar menu to be loaded
  await browser.waitUntil(
    async () => {
      const menu = await $('ul.ant-menu.ant-menu-root').catch(() => null);
      return menu !== null;
    },
    {
      timeout: 10000,
      timeoutMsg: 'Sidebar menu not loaded within 10 seconds',
    }
  );

  // Scroll the sidebar to the bottom to reveal the Reports group
  async function scrollSidebar() {
    await browser.execute(() => {
      const el =
        document.querySelector('ul.ant-menu.ant-menu-root') ||
        document.querySelector('aside .ant-menu') ||
        document.querySelector('.ant-layout-sider .ant-menu') ||
        document.querySelector('aside');
      if (el) el.scrollTop = el.scrollHeight;
    });
    await browser.pause(700);
  }

  // ── STEP 1: Scroll and find "Reports" group, expand it ──
  await scrollSidebar();

  // Find the Reports group by its title
  const reportsGroupSelectors = [
    'li.ant-menu-item-group .ant-menu-item-group-title span',
    '//li[contains(@class,"ant-menu-item-group")]//span[normalize-space(text())="Reports"]',
  ];

  let reportsGroupTitle = null;
  for (const sel of reportsGroupSelectors) {
    const items = await $$(sel);
    if (items.length > 0) {
      reportsGroupTitle = items[0];
      console.log(`✔ Found Reports group title using: ${sel}`);
      break;
    }
  }

  if (reportsGroupTitle) {
    await reportsGroupTitle.scrollIntoView();
    await browser.pause(400);
    await reportsGroupTitle.click();
    await browser.pause(1000);
    console.log('✔ Reports group expanded');
  } else {
    console.log('⚠ Reports group title not found, assuming already expanded');
  }

  // ── STEP 2: Find "Hospital Operations" submenu inside the Reports group ──
  // The Reports section is an ant-menu-item-group near the bottom of the sidebar.
  // Its children include the "Hospital Operations" submenu.
  let hospitalOpsSubmenu = null;

  // Strategy A: match by data-menu-id suffix
  const allSubmenuDivs = await $$('li.ant-menu-submenu > div[data-menu-id]');
  for (const div of allSubmenuDivs) {
    const menuId = await div.getAttribute('data-menu-id').catch(() => '');
    if (menuId.includes('reports-hospital-operations')) {
      hospitalOpsSubmenu = div;
      console.log(`✔ Found Hospital Operations submenu via data-menu-id: ${menuId}`);
      break;
    }
  }

  // Strategy B: fallback — match by span text
  if (!hospitalOpsSubmenu) {
    for (const div of allSubmenuDivs) {
      const text = await div.getText().catch(() => '');
      if (text.trim().startsWith('Hospital Operations')) {
        // Confirm it's inside the Reports group by checking ancestors
        const isInReports = await browser.execute((el) => {
          let node = el.parentElement;
          while (node) {
            if (node.matches('li.ant-menu-item-group')) {
              const title = node.querySelector('.ant-menu-item-group-title span');
              return title && title.textContent.trim().toUpperCase() === 'REPORTS';
            }
            node = node.parentElement;
          }
          return false;
        }, div);

        if (isInReports) {
          hospitalOpsSubmenu = div;
          console.log(`✔ Found Hospital Operations submenu via text match`);
          break;
        }
      }
    }
  }

  if (!hospitalOpsSubmenu) {
    throw new Error(
      'Hospital Operations submenu not found in the Reports section of the sidebar. ' +
        `Checked ${allSubmenuDivs.length} submenu divs.`
    );
  }

  await hospitalOpsSubmenu.scrollIntoView();
  await browser.pause(400);
  await hospitalOpsSubmenu.click();
  await browser.pause(1500);
  console.log('✔ Hospital Operations submenu opened');

  // ── STEP 3: Click the Outpatient link ──
  // From DOM: <a href="/reports/hospital/outpatient-reports">Outpatient</a>
  const outpatientSelectors = [
    `a[href="/reports/hospital/outpatient-reports"]`,
    '//a[@href="/reports/hospital/outpatient-reports"]',
    '//a[normalize-space(text())="Outpatient"]',
  ];

  let outpatientLink = null;
  for (const sel of outpatientSelectors) {
    const items = await $$(sel);
    if (items.length > 0) {
      outpatientLink = items[0];
      console.log(`✔ Found Outpatient link using: ${sel}`);
      break;
    }
  }

  if (!outpatientLink) {
    throw new Error('Outpatient link not found after opening Hospital Operations submenu');
  }

  await outpatientLink.scrollIntoView();
  await browser.pause(300);
  await outpatientLink.click();
  await browser.pause(2000);
  console.log('✔ Outpatient reports page opened via sidebar');
}

/**
 * Set date range using the Ant Design RangePicker by typing the dates directly.
 * @param {string} startDate - e.g. "01/01/2025"
 * @param {string} endDate   - e.g. "23/02/2026"
 */
async function setDateRange(startDate, endDate) {
  console.log(`Setting date range: ${startDate} to ${endDate}`);

  try {
    // Find the start date input
    const startInput = await $('aria/Start date').catch(() =>
      $('.ant-picker-range input:first-child')
    );
    if (!startInput) throw new Error('Start date input not found');

    // Clear and type the start date
    await startInput.clearValue();
    await startInput.setValue(startDate);
    await browser.pause(500);

    // Find the end date input
    const endInput = await $('aria/End date').catch(() => $('.ant-picker-range input:last-child'));
    if (!endInput) throw new Error('End date input not found');

    // Clear and type the end date
    await endInput.clearValue();
    await endInput.setValue(endDate);
    await browser.pause(500);

    console.log(`✔ Date range set: ${startDate} to ${endDate}`);
  } catch (error) {
    console.error('Failed to set date range:', error.message);
    throw error;
  }
}

/**
 * Click the View (eye icon) button to render the report.
 */
async function viewReport() {
  console.log('Clicking View Report button...');

  try {
    const selectors = [
      'span[role="img"][aria-label="eye"]',
      'aria/eye',
      'div.ant-space > div:nth-of-type(1) button',
    ];

    let btn = null;
    for (const sel of selectors) {
      const items = await $$(sel);
      if (items.length > 0) {
        btn = items[0];
        console.log(`✔ View button: ${sel}`);
        break;
      }
    }

    if (!btn) {
      const clicked = await browser.execute(() => {
        const b = document.querySelector('button span[aria-label="eye"]')?.closest('button');
        if (b) {
          b.click();
          return true;
        }
        return false;
      });
      if (clicked) {
        await browser.pause(2000);
        return true;
      }
      throw new Error('View button not found');
    }

    await btn.click();
    await browser.pause(2000);
    console.log('✔ Report view triggered');
    return true;
  } catch (error) {
    console.error('Failed to click View button:', error.message);
    throw error;
  }
}

/**
 * Click the Download/Export button in the report card header.
 */
async function downloadReport() {
  console.log('Clicking Download Report button...');

  try {
    const selectors = [
      'div.ant-card-head > div > div > div > div > div:nth-of-type(1) button',
      'div.ant-card-head button',
    ];

    let btn = null;
    for (const sel of selectors) {
      const items = await $$(sel);
      if (items.length > 0) {
        btn = items[0];
        console.log(`✔ Download button: ${sel}`);
        break;
      }
    }

    if (!btn) {
      const clicked = await browser.execute(() => {
        const b = document.querySelector('.ant-card-head svg')?.closest('button');
        if (b) {
          b.click();
          return true;
        }
        return false;
      });
      if (clicked) {
        await browser.pause(2000);
        return true;
      }
      throw new Error('Download button not found');
    }

    await btn.click();
    await browser.pause(2000);
    console.log('✔ Report download triggered');
    return true;
  } catch (error) {
    console.error('Failed to click Download button:', error.message);
    throw error;
  }
}

/**
 * Full flow: Generate Patient Attendance By Pay Mode report.
 */
export async function generatePatientAttendanceReport(startDate, endDate, download = true) {
  console.log(`=== GENERATE PATIENT ATTENDANCE REPORT ===`);
  console.log(`Date range: ${startDate} → ${endDate}`);

  try {
    await navigateToPatientAttendanceReport();
    await setDateRange(startDate, endDate);
    await viewReport();
    if (download) await downloadReport();

    console.log('=== PATIENT ATTENDANCE REPORT GENERATED SUCCESSFULLY ===');
    return {
      status: 'success',
      startDate,
      endDate,
      downloaded: download,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('GENERATE PATIENT ATTENDANCE REPORT FAILED:', error.message);
    throw error;
  }
}

export { navigateToPatientAttendanceReport, setDateRange, viewReport, downloadReport };
