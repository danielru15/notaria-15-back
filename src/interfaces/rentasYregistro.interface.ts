export interface RentasYRegistro {
    id?: number; 
    escritura_id?: number;
    valor_rentas?: number;
    metodo_pago_rentas?: 'pse' | 'efectivo';
    valor_registro?: number;
    metodo_pago_registro?: 'pse' | 'efectivo';
    fecha?: string; 
    total_facturas_canceladas?: number;
    total_facturas_sin_cancelar?: number;
    total_ryr?: number;
    devoluciones?: number;
    excedentes?: number;
    observaciones?: string; 
    total_rentasyregistro?: number;
  }
  