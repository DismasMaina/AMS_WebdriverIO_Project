// test/specs/consultation/ConsultationPending.spec.js

import {
  openPendingConsultation,
  viewPendingConsultation,
  getTableRows,
  closeModal,
} from '../../../helpers/ConsultationHelper.js';

describe('Consultation - Pending', () => {
  // Page & Table

  it('should load the pending page with at least one row', async () => {
    await openPendingConsultation();

    const rows = await getTableRows();
    expect(rows.length).toBeGreaterThan(0);
  });

  // Row Actions

  it('should open a modal when a row action is clicked and close it', async () => {
    await openPendingConsultation();

    const rows = await getTableRows();
    expect(rows.length).toBeGreaterThan(0);

    const btns = await rows[0].$$('button');
    expect(btns.length).toBeGreaterThan(0);

    await btns[0].click();
    await browser.pause(1500);

    const modal = await $('.ant-modal').catch(() => null);
    const drawer = await $('.ant-drawer').catch(() => null);

    const isVisible =
      (modal && (await modal.isDisplayed().catch(() => false))) ||
      (drawer && (await drawer.isDisplayed().catch(() => false)));

    await closeModal();

    expect(isVisible).toBe(true);
  });

  // End-to-End 

  it('should complete the pending view flow', async () => {
    const result = await viewPendingConsultation({ rowIndex: 1, closeAfter: true });

    expect(result.status).toBe('success');
    expect(result.flow).toBe('pending');
  });
});
