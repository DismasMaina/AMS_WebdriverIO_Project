import { displayTicket } from '../../../helpers/TicketingHelper.js';

describe('Ticketing - Display', () => {
  it('should display ticket details', async () => {
    await displayTicket('TKT-001');

    // Verify details shown
    const details = await $('.ticket-details, .ticket-info')
      .isDisplayed()
      .catch(() => false);
    expect(details).toBe(true);
  });
});
