import { Component, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import { NotificationsService } from 'angular2-notifications';
import { Car } from './car.interface';
import { Owner } from './owner.interface';
import { tap} from "rxjs/operators";
import { CarOwnerService } from './car-owner.service';
declare const bootstrap: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  form: FormGroup = this.createForm(null);
  cars: Car[] = [];
  people: Owner[] = [];
  modal: any;

  get carsArray(): FormArray {
    return (this.form.get("cars") as FormArray)
  }

  constructor(private carOwnerService: CarOwnerService, private fb: FormBuilder, private notification: NotificationsService) {
  }


  ngOnInit() {
    this.updateOwnersList();
    this.modal = new bootstrap.Modal(document.getElementById('exampleModal'), {});
  }

  updateOwnersList(): void {
    this.carOwnerService.getOwners().subscribe((people: Owner[]) => this.people = people);
  }

  createForm(ownerId: number): FormGroup {

    if (ownerId) {
      this.carOwnerService.getOwnerById(ownerId).subscribe((owner: Owner) => {
        this.modal.show();
        this.form = new FormGroup({
          id: new FormControl(owner.id),
          lastName: new FormControl(owner.lastName, [Validators.required, Validators.pattern("^[А-Яа-я]+$")]),
          firstName: new FormControl(owner.firstName, [Validators.required, Validators.pattern("^[А-Яа-я]+$")]),
          middleName: new FormControl(owner.middleName, [Validators.required, Validators.pattern("^[А-Яа-я]+$")]),
          cars: this.fb.array([])
        });
        this.addCarControl(owner);
      });

    } else {
      this.modal?.show();
      this.form = new FormGroup({
        lastName: new FormControl('', [Validators.required, Validators.pattern("^[А-Яа-я]+$")]),
        firstName: new FormControl('', [Validators.required, Validators.pattern("^[А-Яа-я]+$")]),
        middleName: new FormControl('', [Validators.required, Validators.pattern("^[А-Яа-я]+$")]),
        cars: this.fb.array([])
      });
    }
    return this.form;
  }

  addCarControl(owner?: Owner): void {
    const carsControls = this.form.get('cars') as FormArray;
    if (owner) {
      owner.cars.forEach((car: Car) => {
        carsControls.push(new FormGroup({
          number:  new FormControl(car.number, [Validators.required, Validators.pattern("^[A-Z]{2}[1-9]{4}[A-Z]{2}$")]),
          mark:  new FormControl(car.mark, [Validators.required, Validators.pattern("^[A-Za-z]+$")]),
          model:  new FormControl(car.model, [Validators.required, Validators.pattern("^[A-Za-z]+$")]),
          year:  new FormControl(car.year, [Validators.required, Validators.pattern("^[1-9]{4}")]),
          ownerId:  new FormControl(car.ownerId)
        }));
      });
      return;
    }
    carsControls.push(new FormGroup({
      number:  new FormControl(),
      mark:  new FormControl(),
      model:  new FormControl(),
      year:  new FormControl()
    }));
  }

  updateOwner(owner: Owner): void {
    this.people = this.people.map( (oldOwner: Owner) => {
      if (oldOwner.id === owner.id) {
        return owner;
      }
      return oldOwner;
    });
  }

  isValidOwnerCars(owner: Owner): boolean {
    const existingCars: Car[] = this.getAllCars();
    const invalidCars: Car[] = [];
    owner.cars.forEach((newCar: Car) => {
      existingCars.forEach((existingCar: Car) => {
        if (existingCar.number === newCar.number && (newCar.ownerId !== existingCar.ownerId)) {
          console.log(existingCar, newCar);
          invalidCars.push(newCar);
        }
      })
    });
    return !invalidCars.length;
  }

  getAllCars(): Car[] {
    let allCars: Car[] = [];
    this.people.forEach(owner => {
      allCars = [...allCars, ...owner.cars];
    });
    return allCars;
  }


  submit() {

    const owner: Owner = {...this.form.value};

    if (!this.isValidOwnerCars(owner)) {
      alert('CAR is Exist');
    } else {
      if (owner.id) {
        this.carOwnerService.editOwner(owner)
        .pipe(tap(this.succsefullyUpdated.bind(this)))
        .subscribe(this.updateOwnersList.bind(this));
      } else {
        this.carOwnerService.createOwner(owner)
          .pipe(tap(this.succsefullyCreated.bind(this)))
          .subscribe(this.updateOwnersList.bind(this));
      }
    }
  }

  succsefullyUpdated() {
    this.notification.success('Owner succesfully updated', null, {
      timeOut: 3000
    });
  }

  succsefullyCreated() {
    this.notification.success('Owner is created', null, {
      timeOut: 3000
    });
  }

  succsefullyDeleted() {
    this.notification.success('Owner is deleted', null, {
      timeOut: 3000
    });
  }

  deleteOwner(ownerId: number) {
    this.carOwnerService.deleteOwner(ownerId)
    .pipe(tap(this.succsefullyDeleted.bind(this)))
    .subscribe(this.updateOwnersList.bind(this));
  }

  deleteCarControl(index: number): void {
    this.carsArray.removeAt(index);
  }

}

