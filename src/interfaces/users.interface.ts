export interface Users {
    id?:number
    name: string;
    last_name: string;
    email: string;
    password: string;
    cargo:string;
    rol: 'ADMIN' | 'EDITOR' | 'VIEWER';
    created_at?:string
  }
 
