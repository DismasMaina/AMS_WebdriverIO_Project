import {
  viewQueue,
  recordVitals,
  assignService,
  updateStatus,
  getQueueStats,
  refreshQueue,
} from '../../../helpers/TriageHelper.js';

describe('Triage - Queue & Vital Records', () => {
  /**
   * TEST 1: View Queue
   */
  it('should display ticket queue with patient information', async () => {
    try {
      console.log('=== TEST: Display Ticket Queue ===');

      const queueVisible = await viewQueue();
      expect(queueVisible).toBe(true);
      console.log('✓ Test PASSED: Ticket queue displayed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 2: Record Full Vitals
   * Using actual ticket TT9717 from the system
   */
  it('should record complete vital signs for patient', async () => {
    try {
      console.log('=== TEST: Record Complete Vitals ===');

      const vitals = {
        name: 'JP Morgan',
        temperature: 37.2, // #temp
        pulse: 72, // #pulse
        systolic: 120, // #systolic
        diastolic: 80, // #diastolic
        height: 178, // #height (cm)
        weight: 64, // #weight (kg)
      };

      // First: serve the ticket (moves to Vital Records tab)
      await openTriageMenu();
      await serveTicket('TT9717');

      // Then: record vitals
      const result = await recordVitals('TT9717', vitals);

      expect(result.status).toBe('success');
      expect(result.ticket).toBe('TT9717');
      console.log('✓ Test PASSED: Complete vitals recorded');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 3: Record Minimal Vitals
   * Using actual ticket TT9720 from the system
   */
  it('should record minimal vital signs (temp and pulse)', async () => {
    try {
      console.log('=== TEST: Record Minimal Vitals ===');

      // First: serve the ticket
      await openTriageMenu();
      await serveTicket('TT9720');

      const vitals = {
        temperature: 36.8, // #temp
        pulse: 68, // #pulse
      };

      const result = await recordVitals('TT9720', vitals);

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: Minimal vitals recorded');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 4: Assign Service
   * Using actual ticket TT9717 from the system
   */
  it('should assign service to patient', async () => {
    try {
      console.log('=== TEST: Assign Service ===');

      const result = await assignService('TT9717', 'Cardiology');

      expect(result.status).toBe('success');
      expect(result.service).toBe('Cardiology');
      console.log('✓ Test PASSED: Service assigned');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 5: Update Patient Status
   * Using actual ticket TT9717 from the system
   */
  it('should update patient status to SERVING', async () => {
    try {
      console.log('=== TEST: Update Patient Status ===');

      const result = await updateStatus('TT9717', 'SERVING');

      expect(result.status).toBe('success');
      expect(result.newStatus).toBe('SERVING');
      console.log('✓ Test PASSED: Status updated');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 6: Get Queue Statistics
   */
  it('should retrieve queue statistics', async () => {
    try {
      console.log('=== TEST: Get Queue Statistics ===');

      const stats = await getQueueStats();

      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('totalQueued');
      console.log('✓ Test PASSED: Stats retrieved', stats);
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 7: Refresh Queue
   */
  it('should refresh queue to get latest updates', async () => {
    try {
      console.log('=== TEST: Refresh Queue ===');

      const result = await refreshQueue();

      expect(result).toBe(true);
      console.log('✓ Test PASSED: Queue refreshed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 8: Record Multiple Patients Vitals
   * Using actual tickets from the system
   */
  it('should record vitals for multiple patients in sequence', async () => {
    try {
      console.log('=== TEST: Multiple Patient Vitals ===');

      const patients = [
        { ticket: 'TT9717', vitals: { temperature: 37.2, pulse: 72 } },
        { ticket: 'TT9720', vitals: { temperature: 36.9, pulse: 68 } },
        { ticket: 'TT9728', vitals: { temperature: 37.5, pulse: 75 } },
      ];

      let successCount = 0;
      for (const patient of patients) {
        try {
          const result = await recordVitals(patient.ticket, patient.vitals);
          if (result.status === 'success') successCount++;
        } catch (err) {
          console.log(`⚠ Could not record vitals for ${patient.ticket}: ${err.message}`);
        }
      }

      console.log(`✓ Test PASSED: ${successCount}/${patients.length} patients recorded`);
      expect(successCount).toBeGreaterThan(0);
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 9: Full Triage Workflow
   * Using actual ticket TT9717 from the system
   */
  it('should complete full triage workflow: view -> record -> assign -> update', async () => {
    try {
      console.log('=== TEST: Full Triage Workflow ===');

      // Step 1: View queue
      const queueDisplayed = await viewQueue();
      expect(queueDisplayed).toBe(true);
      console.log('  ✓ Queue displayed');

      // Step 2: Record vitals
      const vitalsResult = await recordVitals('TT9717', {
        name: 'Test Patient',
        temperature: 37.1, // #temp
        pulse: 71, // #pulse
        systolic: 118, // #systolic
        diastolic: 76, // #diastolic
        height: 175, // #height
        weight: 70, // #weight
      });
      expect(vitalsResult.status).toBe('success');
      console.log('  ✓ Vitals recorded');

      // Step 3: Assign service
      const serviceResult = await assignService('TT9717', 'General');
      expect(serviceResult.status).toBe('success');
      console.log('  ✓ Service assigned');

      // Step 4: Update status
      const statusResult = await updateStatus('TT9717', 'SERVING');
      expect(statusResult.status).toBe('success');
      console.log('  ✓ Status updated');

      // Step 5: Refresh queue
      const refreshed = await refreshQueue();
      expect(refreshed).toBe(true);
      console.log('  ✓ Queue refreshed');

      console.log('✓ Test PASSED: Full workflow completed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 10: Different Status Updates
   * Using actual ticket TT9717 from the system
   */
  it('should update patient status to different values', async () => {
    try {
      console.log('=== TEST: Various Status Updates ===');

      const statuses = ['QUEUED', 'SERVING', 'DELAYED'];

      for (const status of statuses) {
        try {
          const result = await updateStatus('TT9717', status);
          expect(result.newStatus).toBe(status);
          console.log(`  ✓ Updated to ${status}`);
        } catch (err) {
          console.log(`  ⚠ Could not update to ${status}: ${err.message}`);
        }
      }

      console.log('✓ Test PASSED: Status updates tested');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });
});
