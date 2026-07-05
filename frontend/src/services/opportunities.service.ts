import { opportunityApi } from '../api/opportunity.api';
import { OpeningCreate, OpeningResponse } from '../types/api/opportunity.types';
import { Opportunity, MOCK_OPPORTUNITIES } from '../data/mock-opportunities';

export type ExtendedOpening = OpeningResponse & Opportunity;

class OpportunitiesService {
  mapToExtended(opp: OpeningResponse): ExtendedOpening {
    // Diagnostic: warn when essential fields are missing so UI doesn't show 'undefined'
    if (!(opp as any).title && !opp.project_title && !opp.role_name) {
      console.warn('OpeningResponse missing title fields (title, project_title, role_name):', opp);
    }
    if (!(opp as any).description && !opp.role_description) {
      console.warn('OpeningResponse missing description fields (description, role_description):', opp);
    }

    // Support multiple possible ID field names returned by different APIs
    const openingId = (opp as any).opening_id || (opp as any).id || (opp as any).openingId || (opp as any).opportunity_id || '';
    const createdAt = (opp as any).created_at || (opp as any).createdAt || '';

    const fee = parseFloat(opp.fee as any) || parseFloat((opp as any).fee_amount) || 0;
    const stipend = parseFloat(opp.stipend as any) || parseFloat((opp as any).stipend_amount) || 0;
    const derivedType = (opp as any).internshipType || (opp as any).value || (fee > 0 ? 'paid' : stipend > 0 ? 'stipend' : 'free');

    return {
      ...opp,
      id: openingId,
      title: ((opp as any).title && String((opp as any).title).trim()) || (opp.project_title && opp.project_title.trim()) || (opp.role_name && opp.role_name.trim()) || `Opportunity ${openingId || 'unknown'}`,
      type: 'Internship',
      value: derivedType,
      description: (opp as any).description || opp.role_description,
      duration: '6 Months',
      mode: 'Remote',
      seats: '10',
      eligibility: 'Any Degree',
      startDate: opp.created_at || new Date().toISOString(),
      color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400',
      internshipType: derivedType,
      amount: fee > 0 ? `$${fee}` : stipend > 0 ? `$${stipend}` : '$0',
      programId: (opp as any).program_id || (opp as any).programId,
      status: 'Open' as any,
      postedDate: createdAt ? String(createdAt).split('T')[0] : ''
    } as any;
  }

  async getOpportunities(): Promise<ExtendedOpening[]> {
  try {
    const dataAny: any = await opportunityApi.getOpenings();

    // Normalize possible API response shapes to an array of openings
    let openings: any[] = [];
    if (Array.isArray(dataAny)) {
      openings = dataAny;
    } else if (dataAny && Array.isArray(dataAny.data)) {
      openings = dataAny.data;
    } else if (dataAny && Array.isArray(dataAny.results)) {
      openings = dataAny.results;
    } else if (dataAny && Array.isArray(dataAny.openings)) {
      openings = dataAny.openings;
    } else {
      console.warn('opportunityApi.getOpenings returned unexpected shape:', dataAny);
      openings = [];
    }

    return openings.map(opp => this.mapToExtended(opp));
  } catch (e) {
    console.error(e);
    return [];
  }
}

  async getOpportunity(id: string): Promise<ExtendedOpening | undefined> {
  try {
    const opp = await opportunityApi.getOpening(id);

    return this.mapToExtended(opp);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

  async createOpportunity(opp: OpeningCreate): Promise<ExtendedOpening> {
  const res = await opportunityApi.createOpening(opp);
  return this.mapToExtended(res);
}
}

export const opportunitiesService = new OpportunitiesService();
