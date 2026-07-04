export interface Module {
  id: string;
  displayId?: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  status: 'ACTIVE' | 'INACTIVE';
  active?: boolean;
  desc?: string;
  features: unknown[];
}
