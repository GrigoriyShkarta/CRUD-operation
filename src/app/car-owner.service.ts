import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from './car.interface';
import { Owner } from './owner.interface';

@Injectable({
  providedIn: 'root'
})
export class CarOwnerService {

  constructor(private http: HttpClient) { }

  getOwners(): Observable<Owner[]> {
    return this.http.get<Owner[]>('/api/people')
  }

  getOwnerById(ownerId: number): Observable<Owner> {
    return this.http.get<Owner>('api/people/' + ownerId);
  }

  createOwner(
    owner: Owner
  ): Observable<Owner[]> {
    return this.http.post<Owner[]>(`/api/people`, owner)
  }

  editOwner(owner: Owner): Observable<Owner[]> {
    return this.http.post<Owner[]>(`/api/people/${owner.id}`, owner);
  }

  deleteOwner(ownerId: number): Observable<Owner[]> {
    return this.http.delete<Owner[]>(`/api/people/${ownerId}`)
   }
  }
