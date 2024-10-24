import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Recuperar usuarios del localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  register(user: User): Observable<boolean> {
    // Verificar si el email ya existe
    if (this.users.find(u => u.email === user.email)) {
      return of(false);
    }

    // Agregar nuevo usuario
    const newUser = {
      ...user,
      id: this.users.length + 1
    };
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    return of(true);
  }

  login(email: string, password: string): Observable<boolean> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }
}