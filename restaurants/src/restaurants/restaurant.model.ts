export interface RestaurantModel {
  id?: string;
  name: string;
  description: string;
  status: RestaurantStatus;
}

export enum RestaurantStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
