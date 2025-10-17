export interface Edificio {
  id: number;
  nombre: string;
  calle: string;
  numero: number;
  piso?: string;
}

export interface Dependencia {
  id: number;
  nombre: string;
  numeroOficina: string;
  edificio: Edificio;
}

export interface Empleado {
  id: number;
  legajo: string;
  nombre: string;
  apellido: string;
  dni: string;
  dependencia: Dependencia;
}

export interface HistorialTraslado {
  id: number;
  empleado: Empleado;
  dependenciaOrigen: Dependencia;
  dependenciaDestino: Dependencia;
  fechaTraslado: Date;
}