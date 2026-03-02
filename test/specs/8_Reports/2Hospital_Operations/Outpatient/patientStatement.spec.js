// test/specs/PatientStatement.spec.js

import { generatePatientAttendanceReport } from '../../../../helpers/OutpatientHelper.js';

describe('Patient Outpatient Statement Report', () => {
  it('should generate and download the Patient Outpatient Statement report', async () => {
    const result = await generatePatientAttendanceReport('01/01/2026', '23/02/2026', true);

    expect(result.status).toBe('success');
    expect(result.downloaded).toBe(true);
  });
});
