export interface Module {
  id: string;
  displayId?: string;
  code: string;
  name: string;
  route: string;
  active: boolean;
  desc?: string;
  description?: string;
}
