export interface Module {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  status: 'ACTIVE' | 'INACTIVE';
  features: any[];
}
