import { Tenant } from '@common/common/tenant/tenant.entity';

declare global {
  namespace Express {
    export interface User {
      userId: number;
      email: string;
      tenants: Tenant[];
    }
  }
}
