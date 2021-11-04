import { Car } from "./car.interface";

export interface Owner {
  id?: number;
  firstName: string;
  lastName: string;
  middleName: string;
  cars: Car[];
}
