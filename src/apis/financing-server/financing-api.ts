import { ApiInstance } from '../api-instance';

export class FinancingApi {
  private client: ApiInstance

  constructor(client?: ApiInstance) {
    // Always ending the FINANCING_BASE_URL with '/'
    this.client = client || new ApiInstance(import.meta.env.FINANCING_BASE_URL, 30000);
  }
}