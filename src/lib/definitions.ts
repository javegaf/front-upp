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
  personaContacto: string;
  emailContacto: string;
  telefonoContacto?: string;
};

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
