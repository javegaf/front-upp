export type Alumno = {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  carrera: string;
  semestre: number;
  telefono?: string;
};

export type Colegio = {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  personaContacto: string; // Será usado como Jefe UTP o similar
  emailContacto: string;
  telefonoContacto?: string;
};

export const mockColegios: Colegio[] = [
  { id: "col001", nombre: "COLEGIO POLIVALENTE DOMINGO PARRA CORVALÁN", direccion: "Av. Siempreviva 742", ciudad: "Concepción", personaContacto: "Arturo Ortega", emailContacto: "aortega@dpcorvalan.cl" },
  { id: "col002", nombre: "LICEO ENRIQUE MOLINA GARMENDIA", direccion: "Victor Lamas 123", ciudad: "Concepción", personaContacto: "Beatriz Salamanca", emailContacto: "bsalamanca@lemg.cl" },
  { id: "col003", nombre: "COLEGIO SALESIANO CONCEPCIÓN", direccion: "Freire 456", ciudad: "Concepción", personaContacto: "Carlos Valenzuela", emailContacto: "cvalenzuela@salesianosconcepcion.cl" },
  { id: "col004", nombre: "COLEGIO INMACULADA CONCEPCIÓN", direccion: "O'Higgins 789", ciudad: "Concepción", personaContacto: "Daniela Figueroa", emailContacto: "dfigueroa@cic.cl" },
];


export type PracticaStatus = "Pendiente" | "Asignada" | "En Curso" | "Finalizada" | "Cancelada";

export const practicaStatuses: PracticaStatus[] = ["Pendiente", "Asignada", "En Curso", "Finalizada", "Cancelada"];

export type Practica = {
  id: string;
  alumnoId: string;
  colegioId: string;
  fechaInicio: string; 
  fechaFin: string; 
  estado: PracticaStatus;
  alumnoNombre?: string; // For display
  colegioNombre?: string; // For display
};

export const carreras = [
  "Educación Parvularia",
  "Educación Básica",
  "Pedagogía en Lenguaje y Comunicación",
  "Pedagogía en Matemática y Física",
  "Pedagogía en Historia y Ciencias Sociales",
  "Pedagogía en Inglés",
  "Psicopedagogía",
];

