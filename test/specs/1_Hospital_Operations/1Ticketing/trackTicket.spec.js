import { trackTicket } from '../../../helpers/TicketingHelper.js';

describe('Ticketing - Tracking', () => {
  it('should track ticket status', async () => {
    await trackTicket('TKT-001');

    // Verify tracking timeline shown
    const timeline = await $('.tracking-timeline, .status-history, .ticket-status')
      .isDisplayed()
      .catch(() => false);
    expect(timeline).toBe(true);
  });
});
