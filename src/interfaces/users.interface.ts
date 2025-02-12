export interface Users {
    name: string;
    last_name: string;
    email: string;
    password: string;
    cargo:string;
    rol: 'ADMIN' | 'EDITOR' | 'VIEWER';
  }
 
