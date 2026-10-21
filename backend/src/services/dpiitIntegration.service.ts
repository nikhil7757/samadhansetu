/**
 * DPIIT / Startup India Integration Adapter
 * (Simulated Demo Integration — Clearly Labeled)
 * 
 * Simulates real-time verification of startup credentials against the
 * Department for Promotion of Industry and Internal Trade (DPIIT) database.
 */

export interface DpiitVerificationResult {
  isSimulated: true;
  status: 'VERIFIED' | 'INVALID' | 'EXPIRED';
  dpiitNumber: string;
  legalEntityName: string;
  incorporationDate: string;
  registeredState: string;
  industrySector: string;
  eligibleForTurnoverRelaxation: boolean;
  eligibleForExperienceRelaxation: boolean;
  taxExemptionSection80IAC: boolean;
  verifiedAt: string;
}

export class DpiitIntegrationService {
  public static verifyCertificate(dpiitNumber: string): DpiitVerificationResult {
    const cleanNumber = (dpiitNumber || '').trim().toUpperCase();
    const isValidPattern = /^DPIIT-([A-Z]{2})-(\d{4})-(\d+)$/i.test(cleanNumber) || cleanNumber.startsWith('DPIIT');

    if (!cleanNumber || cleanNumber.length < 5) {
      return {
        isSimulated: true,
        status: 'INVALID',
        dpiitNumber: cleanNumber,
        legalEntityName: 'Unknown Entity',
        incorporationDate: 'N/A',
        registeredState: 'Unknown',
        industrySector: 'Unknown',
        eligibleForTurnoverRelaxation: false,
        eligibleForExperienceRelaxation: false,
        taxExemptionSection80IAC: false,
        verifiedAt: new Date().toISOString(),
      };
    }

    // Deterministic simulation based on DPIIT certificate string
    return {
      isSimulated: true,
      status: 'VERIFIED',
      dpiitNumber: cleanNumber,
      legalEntityName: `${cleanNumber.split('-')[1] || 'MH'} Innovations Private Limited`,
      incorporationDate: '2021-06-15',
      registeredState: 'Maharashtra',
      industrySector: 'Enterprise Software & Artificial Intelligence',
      eligibleForTurnoverRelaxation: true,
      eligibleForExperienceRelaxation: true,
      taxExemptionSection80IAC: true,
      verifiedAt: new Date().toISOString(),
    };
  }
}
