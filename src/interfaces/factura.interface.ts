export interface Factura {
    id?: number; 
    rentasyregistro_id?: number;
    numero_factura: string;
    valor: number;
    estado: 'cancelado' | 'sin cancelar';
  }
  


