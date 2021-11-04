import { InMemoryDbService } from "angular-in-memory-web-api";
import { Owner } from "./owner.interface";

export class ICarOwnersService implements InMemoryDbService {
  createDb() {
    const people: Owner[] = [
      {
        id: 1,
        lastName: "Шкарта",
        firstName: "Григорий",
        middleName: "Павлович",
        cars: [
          {
            number: 'AX1231JH',
            mark: 'Audi',
            model: 'RE43',
            year: 2000,
            ownerId: 1
          }
        ]
      },
    ];

    return {people}
  }
}
