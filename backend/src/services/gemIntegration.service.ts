/**
 * Government e-Marketplace (GeM) Startup Runway Handoff Adapter
 * (Simulated Demo Integration — Clearly Labeled)
 * 
 * Prepares and exports a standardized procurement dossier from a validated pilot
 * directly into GeM for direct departmental purchasing under GFR Rule 149.
 */

export interface GemExportInput {
  pilotId: string;
  challengeTitle: string;
  department: string;
  startupName: string;
  dpiitNumber: string;
  validatedOutcomeKpis: string[];
  unitCostPricing: number; // In INR
  validationReportRef: string;
}

export interface GemExportDocket {
  isSimulated: true;
  gemDocketId: string;
  exportTimestamp: string;
  catalogCategory: string;
  offeringType: 'PRODUCT' | 'SERVICE' | 'INTEGRATED_SOLUTION';
  startupDossier: {
    name: string;
    dpiitNumber: string;
    state: string;
  };
  validatedSpecifications: {
    originatingDepartment: string;
    pilotRef: string;
    validationCertificate: string;
    kpisCertified: string[];
  };
  procurementListing: {
    recommendedPathway: 'GeM Startup Runway Direct Purchase (GFR 149)';
    directPurchaseCeilingINR: number;
    unitPriceINR: number;
    status: 'READY_FOR_STATEWIDE_INDENTING';
  };
  apiStatus: 'EXPORT_SIMULATED_SUCCESS';
}

export class GemIntegrationService {
  public static exportToGemRunway(input: GemExportInput): GemExportDocket {
    const timestamp = new Date().toISOString();
    const cleanId = input.pilotId.slice(0, 8).toUpperCase();
    const docketId = `GEM-MH-RUNWAY-2026-${cleanId}`;

    return {
      isSimulated: true,
      gemDocketId: docketId,
      exportTimestamp: timestamp,
      catalogCategory: 'Public Innovation & Smart Governance Solutions',
      offeringType: 'INTEGRATED_SOLUTION',
      startupDossier: {
        name: input.startupName,
        dpiitNumber: input.dpiitNumber,
        state: 'Maharashtra',
      },
      validatedSpecifications: {
        originatingDepartment: input.department,
        pilotRef: input.pilotId,
        validationCertificate: input.validationReportRef,
        kpisCertified: input.validatedOutcomeKpis,
      },
      procurementListing: {
        recommendedPathway: 'GeM Startup Runway Direct Purchase (GFR 149)',
        directPurchaseCeilingINR: 5000000, // 50 Lakhs GFR limit
        unitPriceINR: input.unitCostPricing || 125000,
        status: 'READY_FOR_STATEWIDE_INDENTING',
      },
      apiStatus: 'EXPORT_SIMULATED_SUCCESS',
    };
  }
}
