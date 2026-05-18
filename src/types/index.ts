
export interface ServiceType {
  id: string;
  code: string;
  name: string;
  time: number;
  price: number;
  defaultQty: number;
  subItems?: ServiceType[];
}

export interface Section {
  section: string;
  items: ServiceType[];
}

export interface SelectedService extends ServiceType{
  quantity: number;
  total: number;
}
