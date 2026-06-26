import { ProductivityAPI } from '../api/productivity.api';
import { ProductivityWorkspace } from '../types/productivity.types';

export class ProductivityService {
  static async getWorkspace(): Promise<ProductivityWorkspace> {
    const workspace = await ProductivityAPI.getWorkspace();
    return workspace;
  }
}
