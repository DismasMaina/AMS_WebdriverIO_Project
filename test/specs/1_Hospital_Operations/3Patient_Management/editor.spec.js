// test/specs/1-Hospital-Operations/3Patient-Management/patientEditor.spec.js

import {
  getPatientDetails,
  updatePatientInfo,
  registerPatient,
} from '../../../helpers/PatientManagementHelper.js';

describe('Patient Management - Patient Editor', () => {
  /**
   * TEST 1: Get Patient Details
   * Verifies patient information can be retrieved
   */
  it('should retrieve patient details', async () => {
    try {
      console.log('=== TEST: Get Patient Details ===');

      const result = await getPatientDetails('Nimo');

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: Patient details retrieved');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 2: Update Patient Phone Number
   * Verifies phone number can be updated
   */
  it('should update patient phone number', async () => {
    try {
      console.log('=== TEST: Update Patient - Phone Number ===');

      const updates = {
        phoneNumber: '2547111111111',
      };

      const result = await updatePatientInfo('Nimo', updates);

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: Phone number updated');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 3: Update Patient Email
   * Verifies email address can be updated
   */
  it('should update patient email address', async () => {
    try {
      console.log('=== TEST: Update Patient - Email ===');

      const updates = {
        email: 'nimo.new@email.com',
      };

      const result = await updatePatientInfo('David', updates);

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: Email updated');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 4: Update Patient Address
   * Verifies address can be updated
   */
  it('should update patient address', async () => {
    try {
      console.log('=== TEST: Update Patient - Address ===');

      const updates = {
        address: '456 New Street',
        city: 'Mombasa',
      };

      const result = await updatePatientInfo('Nimo', updates);

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: Address updated');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 5: Update Multiple Patient Fields
   * Verifies multiple fields can be updated at once
   */
  it('should update multiple patient fields', async () => {
    try {
      console.log('=== TEST: Update Patient - Multiple Fields ===');

      const updates = {
        phoneNumber: '2547222222222',
        email: 'multi.update@email.com',
        address: '789 Multiple Street',
        city: 'Kisumu',
      };

      const result = await updatePatientInfo('David', updates);

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: Multiple fields updated');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 6: Update Patient Gender
   * Verifies gender can be changed
   */
  it('should update patient gender', async () => {
    try {
      console.log('=== TEST: Update Patient - Gender ===');

      const updates = {
        gender: 'Female',
      };

      const result = await updatePatientInfo('Nimo', updates);

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: Gender updated');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 7: Update Patient ID Number
   * Verifies ID number can be updated
   */
  it('should update patient ID number', async () => {
    try {
      console.log('=== TEST: Update Patient - ID Number ===');

      const updates = {
        idNumber: 'ID999888',
      };

      const result = await updatePatientInfo('David', updates);

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: ID number updated');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 8: Update Patient - Full Edit
   * Verifies complete patient information can be edited
   */
  it('should complete full patient edit workflow', async () => {
    try {
      console.log('=== TEST: Full Patient Edit Workflow ===');

      // Step 1: Register patient
      const patientData = {
        firstName: 'EditTest',
        lastName: 'Patient',
        phoneNumber: '2547333333333',
      };

      const registered = await registerPatient(patientData);
      expect(registered.status).toBe('success');
      console.log('  ✓ Patient registered');

      // Step 2: Get patient details
      const details = await getPatientDetails('EditTest');
      expect(details.status).toBe('success');
      console.log('  ✓ Patient details retrieved');

      // Step 3: Update patient information
      const updates = {
        phoneNumber: '2547444444444',
        email: 'edittest@email.com',
        address: '999 Edit Avenue',
        city: 'Nairobi',
      };

      const updated = await updatePatientInfo('EditTest', updates);
      expect(updated.status).toBe('success');
      console.log('  ✓ Patient information updated');

      console.log('✓ Test PASSED: Full edit workflow completed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 9: Update Patient - Contact Information
   * Verifies contact details can be changed
   */
  it('should update patient contact information', async () => {
    try {
      console.log('=== TEST: Update Patient - Contact Info ===');

      const updates = {
        phoneNumber: '2547555555555',
        email: 'contact.update@email.com',
      };

      const result = await updatePatientInfo('Nimo', updates);

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: Contact information updated');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 10: Update Patient - Location Information
   * Verifies location details can be changed
   */
  it('should update patient location information', async () => {
    try {
      console.log('=== TEST: Update Patient - Location Info ===');

      const locations = [
        { address: '100 Main St', city: 'Nairobi' },
        { address: '200 Beach Rd', city: 'Mombasa' },
        { address: '300 Lake Ave', city: 'Kisumu' },
      ];

      for (const location of locations) {
        const result = await updatePatientInfo('David', location);
        expect(result.status).toBe('success');
        console.log(`  ✓ Updated to ${location.city}`);
      }

      console.log('✓ Test PASSED: Location updates completed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });
});
