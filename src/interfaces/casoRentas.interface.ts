export interface CasoRentas {
    id?: number;
    escritura_id: number;
    radicado: string;
    observaciones?: string;
    estado?: 'activo' | 'finalizado';
    pdf?: boolean;
}

export interface CasoRentasResponse {
    id: number;
    radicado: string;
    observaciones: string;
    estado: string;
    pdf: boolean;
    numero_escritura: string;
    name: string;
    user_id:number;
    fecha:string;
    last_name: string;
    email: string;
  }
  