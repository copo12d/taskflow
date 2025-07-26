import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios (solo admin)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }
}
