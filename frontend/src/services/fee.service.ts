import { feeApi } from '../api/fee.api';
import { FeeStructure } from '../types/fee.types';

class FeeService {
  async getFees(): Promise<FeeStructure[]> {
    return await feeApi.getFees();
  }

  async getActiveFees(): Promise<FeeStructure[]> {
    const fees = await this.getFees();
    return fees.filter(f => f.status === 'Active');
  }
}

export const feeService = new FeeService();
