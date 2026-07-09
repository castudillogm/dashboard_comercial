export interface AttentionRecord {
  comercial: string;
  fecha: string;
  mes: string;
  mesNum: number;
  delegacion: string;
  tipoAtencion: string;
}

export interface DashboardFilters {
  meses: string[]; // Selected months. If empty, means all (Semestre Completo)
  delegaciones: string[]; // Selected delegations. If empty, means all (Todas las Carteras)
  comerciales: string[]; // Selected agents. If empty, means all (Todo el Equipo)
  tiposAtencion: string[]; // Selected types. If empty, means all (Todas las Categorías)
}

export interface KpiData {
  totalAtenciones: number;
  mediaPorComercial: number;
}
