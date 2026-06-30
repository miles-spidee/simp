import { feeApi } from '../api/fee.api';
import { FeeStructure } from '../types/fee.types';

class FeeService {
  async getFees(): Promise<FeeStructure[]> {
    return await feeApi.getFees();
  }

  async getFeeById(id: string): Promise<FeeStructure> {
    return await feeApi.getFeeById(id);
  }

  async createFee(data: Partial<FeeStructure>): Promise<FeeStructure> {
    return await feeApi.createFee(data);
  }

  async updateFee(id: string, data: Partial<FeeStructure>): Promise<FeeStructure> {
    return await feeApi.updateFee(id, data);
  }

  async deleteFee(id: string): Promise<void> {
    return await feeApi.deleteFee(id);
  }

  async getActiveFees(): Promise<FeeStructure[]> {
    const fees = await this.getFees();
    return fees.filter(f => f.status === 'Active');
  }
}

export const feeService = new FeeService();
