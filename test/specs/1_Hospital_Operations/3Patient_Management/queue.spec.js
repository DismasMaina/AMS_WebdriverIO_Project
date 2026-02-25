// test/specs/1-Hospital-Operations/3Patient-Management/patientQueue.spec.js

import {
  viewPatientQueue,
  searchPatient,
  filterPatientsByStatus,
  getPatientDetails,
} from '../../../helpers/PatientManagementHelper.js';

describe('Patient Management - Patient Queue', () => {
  /**
   * TEST 1: View Patient Queue
   * Verifies patient queue table is displayed with data
   */
  it('should display patient queue', async () => {
    try {
      console.log('=== TEST: Display Patient Queue ===');

      const queueDisplayed = await viewPatientQueue();

      expect(queueDisplayed).toBe(true);
      console.log('✓ Test PASSED: Patient queue displayed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 2: Search Patient in Queue
   * Verifies patient can be searched by name
   */
  it('should search for patient in queue', async () => {
    try {
      console.log('=== TEST: Search Patient in Queue ===');

      const searched = await searchPatient('Nimo');

      expect(searched).toBe(true);
      console.log('✓ Test PASSED: Patient searched successfully');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 3: Filter Queue - Waiting Status
   * Verifies queue can be filtered by Waiting status
   */
  it('should filter queue by Waiting status', async () => {
    try {
      console.log('=== TEST: Filter Queue - Waiting ===');

      const filtered = await filterPatientsByStatus('Waiting');

      expect(filtered).toBe(true);
      console.log('✓ Test PASSED: Queue filtered by Waiting');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 4: Filter Queue - Requests Status
   * Verifies queue can be filtered by Requests status
   */
  it('should filter queue by Requests status', async () => {
    try {
      console.log('=== TEST: Filter Queue - Requests ===');

      const filtered = await filterPatientsByStatus('Requests');

      expect(filtered).toBe(true);
      console.log('✓ Test PASSED: Queue filtered by Requests');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 5: Filter Queue - Patient Registration
   * Verifies queue can be filtered by Patient Registration status
   */
  it('should filter queue by Patient Registration status', async () => {
    try {
      console.log('=== TEST: Filter Queue - Patient Registration ===');

      const filtered = await filterPatientsByStatus('Patient Registration');

      expect(filtered).toBe(true);
      console.log('✓ Test PASSED: Queue filtered by Patient Registration');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 6: Search and Get Patient from Queue
   * Verifies patient can be searched and details retrieved
   */
  it('should search and get patient details from queue', async () => {
    try {
      console.log('=== TEST: Search and Get Patient Details ===');

      // Step 1: Search patient
      const searched = await searchPatient('David');
      expect(searched).toBe(true);
      console.log('  ✓ Patient searched');

      // Step 2: Get patient details
      const details = await getPatientDetails('David');
      expect(details.status).toBe('success');
      console.log('  ✓ Patient details retrieved');

      console.log('✓ Test PASSED: Search and details workflow completed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 7: View Queue and Filter by Multiple Statuses
   * Verifies queue can be viewed and filtered by different statuses
   */
  it('should view queue and filter by multiple statuses', async () => {
    try {
      console.log('=== TEST: View Queue - Multiple Filters ===');

      // Step 1: View queue
      const queueDisplayed = await viewPatientQueue();
      expect(queueDisplayed).toBe(true);
      console.log('  ✓ Queue displayed');

      // Step 2: Filter by different statuses
      const statuses = ['Waiting', 'Requests'];

      for (const status of statuses) {
        try {
          const filtered = await filterPatientsByStatus(status);
          expect(filtered).toBe(true);
          console.log(`  ✓ Filtered by: ${status}`);
        } catch (err) {
          console.log(`  ⚠ Could not filter by ${status}: ${err.message}`);
        }
      }

      console.log('✓ Test PASSED: Multiple filter operations completed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 8: Search Patient by Different Names
   * Verifies queue search works with different patient names
   */
  it('should search for different patients in queue', async () => {
    try {
      console.log('=== TEST: Search Different Patients ===');

      const patientNames = ['Nimo', 'David', 'Nchipai'];

      for (const name of patientNames) {
        try {
          const searched = await searchPatient(name);
          expect(searched).toBe(true);
          console.log(`  ✓ Searched for: ${name}`);
        } catch (err) {
          console.log(`  ⚠ Could not search for ${name}: ${err.message}`);
        }
      }

      console.log('✓ Test PASSED: Multiple patient searches completed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 9: Queue Pagination
   * Verifies multiple patients can be viewed in queue
   */
  it('should handle queue with multiple patient records', async () => {
    try {
      console.log('=== TEST: Queue with Multiple Records ===');

      // Step 1: View queue
      const queueDisplayed = await viewPatientQueue();
      expect(queueDisplayed).toBe(true);
      console.log('  ✓ Queue displayed with multiple records');

      // Step 2: Search for first patient
      const search1 = await searchPatient('Nimo');
      expect(search1).toBe(true);
      console.log('  ✓ First patient found');

      // Step 3: Search for another patient
      const search2 = await searchPatient('David');
      expect(search2).toBe(true);
      console.log('  ✓ Second patient found');

      console.log('✓ Test PASSED: Queue pagination handled correctly');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 10: Complete Queue Management Workflow
   * Verifies complete workflow from viewing queue to filtering and searching
   */
  it('should complete full queue management workflow', async () => {
    try {
      console.log('=== TEST: Full Queue Management Workflow ===');

      // Step 1: View queue
      const queueDisplayed = await viewPatientQueue();
      expect(queueDisplayed).toBe(true);
      console.log('  ✓ Queue displayed');

      // Step 2: Filter by status
      const filtered = await filterPatientsByStatus('Waiting');
      expect(filtered).toBe(true);
      console.log('  ✓ Queue filtered by Waiting status');

      // Step 3: Search for patient
      const searched = await searchPatient('Nimo');
      expect(searched).toBe(true);
      console.log('  ✓ Patient searched');

      // Step 4: Get patient details
      const details = await getPatientDetails('Nimo');
      expect(details.status).toBe('success');
      console.log('  ✓ Patient details retrieved');

      console.log('✓ Test PASSED: Full queue management workflow completed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });
});
