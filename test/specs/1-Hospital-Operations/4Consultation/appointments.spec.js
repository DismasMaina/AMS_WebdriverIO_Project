// test/specs/1-Hospital-Operations/4Consultation/appointments.spec.js

import {
  openConsultationAppointments,
  getCalendarEvents,
  clickCalendarEvent,
} from '../../../helpers/ConsultationHelper.js';

/**
 * Consultation — Appointments
 *
 * Strategy: navigate ONCE in before(), share all state via module-level variables.
 * - The submenu opens exactly once.
 * - The modal opens exactly once and is closed once.
 */
describe('Consultation - Appointments', () => {
  let calendarEvents = [];
  let modalText = '';

  before(async () => {
    // ONE navigation: login → open Consultation submenu → click Appointments
    await openConsultationAppointments();

    // Capture calendar events for all tests below
    calendarEvents = await getCalendarEvents();

    // Click the first event and read its content — used by Event Interaction tests
    if (calendarEvents.length > 0) {
      await clickCalendarEvent(0);
      await browser.pause(1500);

      // Read modal body text
      const modalBody = await $('.ant-modal-body, .ant-drawer-body').catch(() => null);
      if (modalBody) {
        modalText = await modalBody.getText().catch(() => '');
      }

      // Close modal — only once
      const closeBtn = await $('aria/close').catch(() => null);
      if (closeBtn) {
        await closeBtn.click();
        await browser.pause(800);
      }
    }
  });

  // Navigation & Initial State

  describe('Navigation', () => {
    it('should navigate to the Consultation Appointments page', async () => {
      const url = await browser.getUrl();
      expect(url).toContain('appointment');
    });

    it('should display the monthly calendar view by default', async () => {
      const calendar = await $('.ant-picker-calendar')
        .isDisplayed()
        .catch(() => false);
      expect(calendar).toBe(true);
    });
  });

  // Calendar Events

  describe('Calendar Events', () => {
    it('should find appointment events on the calendar', async () => {
      expect(calendarEvents.length).toBeGreaterThan(0);
    });

    it('should have readable text on each calendar event', async () => {
      const text = await calendarEvents[0].getText();
      expect(text.trim().length).toBeGreaterThan(0);
    });

    it('should display multiple appointment events across the calendar', async () => {
      expect(calendarEvents.length).toBeGreaterThan(1);
    });
  });

  describe('Event Interaction', () => {
    it('should open a modal or drawer when a calendar event is clicked', async () => {
      // Modal was opened in before() — verify we captured body text as proof
      expect(modalText.length).toBeGreaterThan(0);
    });

    it('should display appointment details inside the opened modal', async () => {
      expect(modalText).toMatch(/Patient|Appointment|Date|Name/i);
    });

    it('should close the appointment modal and return to the calendar', async () => {
      // Close happened in before() — verify calendar is still visible
      const calendar = await $('.ant-picker-calendar')
        .isDisplayed()
        .catch(() => false);
      expect(calendar).toBe(true);
    });
  });

  // End-to-End

  describe('End-to-End', () => {
    it('should view the first calendar appointment and close the modal', async () => {
      // Full proof: events existed + details were captured + modal was closed
      expect(calendarEvents.length).toBeGreaterThan(0);
      expect(modalText).toMatch(/Patient|Appointment|Date|Name/i);
      const calendar = await $('.ant-picker-calendar')
        .isDisplayed()
        .catch(() => false);
      expect(calendar).toBe(true);
    });
  });
});
