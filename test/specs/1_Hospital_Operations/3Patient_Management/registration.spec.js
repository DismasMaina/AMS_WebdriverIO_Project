// test/specs/1-Hospital-Operations/3Patient-Management/patientRegistration.spec.js

import {
  registerPatient,
  searchPatient,
  viewPatientQueue,
} from '../../../helpers/PatientManagementHelper.js';

describe('Patient Management - Patient Registration', () => {
  /**
   * TEST 1: View Patient Queue
   * Verifies the patient registration queue is displayed
   */
  it('should display patient registration queue', async () => {
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
   * TEST 2: Register Patient with Complete Data
   * Verifies patient can be registered with all information fields
   */
  it('should register patient with complete information', async () => {
    try {
      console.log('=== TEST: Register Patient - Complete Data ===');

      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        phoneNumber: '2547123456789',
        email: 'john.doe@email.com',
        address: '123 Main Street',
        city: 'Nairobi',
        idNumber: 'ID123456',
      };

      const result = await registerPatient(patientData);

      expect(result.status).toBe('success');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      console.log('✓ Test PASSED: Patient registered with complete data');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 3: Register Patient with Minimal Data
   * Verifies patient can be registered with only required fields
   */
  it('should register patient with minimal required data', async () => {
    try {
      console.log('=== TEST: Register Patient - Minimal Data ===');

      const patientData = {
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '2547987654321',
      };

      const result = await registerPatient(patientData);

      expect(result.status).toBe('success');
      expect(result.firstName).toBe('Jane');
      console.log('✓ Test PASSED: Patient registered with minimal data');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 4: Register Patient with Email and Address
   * Verifies patient can be registered with contact and location details
   */
  it('should register patient with email and address', async () => {
    try {
      console.log('=== TEST: Register Patient - With Email & Address ===');

      const patientData = {
        firstName: 'Michael',
        lastName: 'Johnson',
        phoneNumber: '2547555555555',
        email: 'michael.johnson@email.com',
        address: '456 Oak Avenue',
        city: 'Mombasa',
      };

      const result = await registerPatient(patientData);

      expect(result.status).toBe('success');
      console.log('✓ Test PASSED: Patient registered with email and address');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 5: Register Multiple Patients
   * Verifies system can handle registering multiple patients in sequence
   */
  it('should register multiple patients in sequence', async () => {
    try {
      console.log('=== TEST: Register Multiple Patients ===');

      const patients = [
        {
          firstName: 'Alice',
          lastName: 'Brown',
          phoneNumber: '2547111111111',
          dateOfBirth: '1985-03-20',
        },
        {
          firstName: 'Bob',
          lastName: 'Wilson',
          phoneNumber: '2547222222222',
          dateOfBirth: '1992-07-10',
        },
        {
          firstName: 'Carol',
          lastName: 'Davis',
          phoneNumber: '2547333333333',
          dateOfBirth: '1988-11-25',
        },
      ];

      let successCount = 0;
      for (const patient of patients) {
        try {
          const result = await registerPatient(patient);
          if (result.status === 'success') {
            successCount++;
            console.log(`  ✓ ${patient.firstName} registered`);
          }
        } catch (err) {
          console.log(`  ⚠ Could not register ${patient.firstName}: ${err.message}`);
        }
      }

      expect(successCount).toBeGreaterThan(0);
      console.log(`✓ Test PASSED: ${successCount}/${patients.length} patients registered`);
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 6: Search for Registered Patient
   * Verifies patient can be searched after registration
   */
  it('should search for registered patient by name', async () => {
    try {
      console.log('=== TEST: Search Registered Patient ===');

      // Register a patient first
      const patientData = {
        firstName: 'David',
        lastName: 'Miller',
        phoneNumber: '2547444444444',
      };

      const registered = await registerPatient(patientData);
      expect(registered.status).toBe('success');

      // Search for the patient
      const searched = await searchPatient('David');
      expect(searched).toBe(true);

      console.log('✓ Test PASSED: Patient searched successfully');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 7: Register Patient with Full Personal Details
   * Verifies all personal information fields are properly saved
   */
  it('should register patient with full personal details', async () => {
    try {
      console.log('=== TEST: Register Patient - Full Details ===');

      const patientData = {
        firstName: 'Sarah',
        lastName: 'Taylor',
        dateOfBirth: '1995-08-22',
        gender: 'Female',
        phoneNumber: '2547666666666',
        email: 'sarah.taylor@email.com',
        address: '789 Pine Road',
        city: 'Kisumu',
        idNumber: 'ID789012',
      };

      const result = await registerPatient(patientData);

      expect(result.status).toBe('success');
      expect(result.firstName).toBe('Sarah');
      expect(result.lastName).toBe('Taylor');
      console.log('✓ Test PASSED: Patient registered with full details');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 8: Patient Registration Workflow
   * Verifies complete registration workflow from queue to search
   */
  it('should complete full patient registration workflow', async () => {
    try {
      console.log('=== TEST: Full Patient Registration Workflow ===');

      // Step 1: View queue
      const queueDisplayed = await viewPatientQueue();
      expect(queueDisplayed).toBe(true);
      console.log('  ✓ Queue displayed');

      // Step 2: Register patient
      const patientData = {
        firstName: 'Robert',
        lastName: 'Anderson',
        phoneNumber: '2547888888888',
        email: 'robert.anderson@email.com',
        dateOfBirth: '1987-12-30',
      };

      const registered = await registerPatient(patientData);
      expect(registered.status).toBe('success');
      console.log('  ✓ Patient registered');

      // Step 3: Search for registered patient
      const searched = await searchPatient('Robert');
      expect(searched).toBe(true);
      console.log('  ✓ Patient searched');

      console.log('✓ Test PASSED: Full registration workflow completed');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 9: Register Patient with Different Genders
   * Verifies system handles different gender selections
   */
  it('should register patients with different gender options', async () => {
    try {
      console.log('=== TEST: Register Patients - Different Genders ===');

      const patients = [
        { firstName: 'Emma', lastName: 'White', phoneNumber: '2547999999999', gender: 'Female' },
        { firstName: 'James', lastName: 'Black', phoneNumber: '2548000000000', gender: 'Male' },
        { firstName: 'Alex', lastName: 'Gray', phoneNumber: '2548111111111', gender: 'Other' },
      ];

      for (const patient of patients) {
        const result = await registerPatient(patient);
        expect(result.status).toBe('success');
        console.log(`  ✓ ${patient.firstName} (${patient.gender}) registered`);
      }

      console.log('✓ Test PASSED: All gender options registered successfully');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });

  /**
   * TEST 10: Register Patient with Different Cities
   * Verifies system handles different city inputs
   */
  it('should register patients from different cities', async () => {
    try {
      console.log('=== TEST: Register Patients - Different Cities ===');

      const patients = [
        { firstName: 'Thomas', lastName: 'Harris', phoneNumber: '2548222222222', city: 'Nairobi' },
        {
          firstName: 'Patricia',
          lastName: 'Martin',
          phoneNumber: '2548333333333',
          city: 'Mombasa',
        },
        { firstName: 'Christopher', lastName: 'Lee', phoneNumber: '2548444444444', city: 'Kisumu' },
      ];

      for (const patient of patients) {
        const result = await registerPatient(patient);
        expect(result.status).toBe('success');
        console.log(`  ✓ ${patient.firstName} from ${patient.city} registered`);
      }

      console.log('✓ Test PASSED: Patients from different cities registered');
    } catch (error) {
      console.error('✗ Test FAILED:', error.message);
      throw error;
    }
  });
});
