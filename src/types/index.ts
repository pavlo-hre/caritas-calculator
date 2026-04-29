
export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  time: number;
  price: number;
  defaultQty: number;
  subItems?: ServiceItem[];
}

export interface Section {
  section: string;
  items: ServiceItem[];
}

export interface SelectedService {
  code: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}
