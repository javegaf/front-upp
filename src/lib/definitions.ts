
// Base entities
export type Comuna = {
  id: string;
  nombre: string;
};

export type Carrera = {
  id: string;
  nombre: string;
};

export type Tutor = {
  id: string;
  nombre: string;
  email: string;
};

// Main entities
export type Estudiante = {
  id: string;
  rut: string;
  nombre: string;
  ap_paterno: string;
  ap_materno: string;
  email: string;
  cond_especial?: string;
  carrera_id: string;
  comuna_id: string;
  tutor_id: string;
};

export type Establecimiento = {
  id: string;
  rbd: string;
  nombre: string;
  dependencia: string; // e.g., 'Municipal', 'Particular Subvencionado'
  comuna_id: string;
};

export type Directivo = {
  id: string;
  nombre: string;
  email: string;
  cargo: string;
  establecimiento_id: string;
};

export type NivelPractica = {
  id:string;
  nombre: string; // e.g., 'Práctica Profesional', 'Práctica Intermedia'
  carrera_id: string;
};

// Junction/relational entities
export type Cupo = {
  id: string;
  establecimiento_id: string;
  nivel_practica_id: string;
};

export type Ficha = {
  id: string;
  estudiante_id: string;
  establecimiento_id: string;
  cupo_id: string;
  fecha_inicio: string;
  fecha_termino: string;
  fecha_envio?: string;
};


// --- MOCK DATA ---

export const mockComunas: Comuna[] = [
  { id: 'com01', nombre: 'Concepción' },
  { id: 'com02', nombre: 'Talcahuano' },
  { id: 'com03', nombre: 'Chiguayante' },
  { id: 'com04', nombre: 'San Pedro de la Paz' },
  { id: 'com05', nombre: 'Coronel' },
  { id: 'com06', nombre: 'Hualpén' },
];

export const mockCarreras: Carrera[] = [
  { id: 'car01', nombre: 'Educación Parvularia' },
  { id: 'car02', nombre: 'Pedagogía en Matemática y Física' },
  { id: 'car03', nombre: 'Psicopedagogía' },
  { id: 'car04', nombre: 'Educación Básica' },
  { id: 'car05', nombre: 'Pedagogía en Inglés' },
  { id: 'car06', nombre: 'Pedagogía en Educación Diferencial' },
  { id: 'car07', nombre: 'Pedagogía en Educación Física' },
];

export const mockTutores: Tutor[] = [
    { id: 'tut01', nombre: 'Dra. Isabel Soto', email: 'isoto@universidad.cl' },
    { id: 'tut02', nombre: 'Dr. Mario Campos', email: 'mcampos@universidad.cl' },
    { id: 'tut03', nombre: 'Mg. Carolina Reyes', email: 'creyes@universidad.cl' },
    { id: 'tut04', nombre: 'Dr. Fernando Zúñiga', email: 'fzuniga@universidad.cl' },
];

export const mockEstudiantes: Estudiante[] = [
  { id: "est01", rut: "20.111.222-3", nombre: "Elena", ap_paterno: "Valdés", ap_materno: "Rojas", email: "elena.valdes@example.com", carrera_id: "car01", comuna_id: "com01", tutor_id: "tut01" },
  { id: "est02", rut: "19.222.333-4", nombre: "Javier", ap_paterno: "Mora", ap_materno: "Tapia", email: "javier.mora@example.com", carrera_id: "car02", comuna_id: "com02", tutor_id: "tut01" },
  { id: "est03", rut: "21.333.444-5", nombre: "Camila", ap_paterno: "Silva", ap_materno: "Castro", email: "camila.silva@example.com", carrera_id: "car03", comuna_id: "com01", tutor_id: "tut02", cond_especial: "Requiere apoyo visual" },
  { id: "est04", rut: "20.444.555-6", nombre: "Andrés", ap_paterno: "Pérez", ap_materno: "Luna", email: "andres.perez@example.com", carrera_id: "car04", comuna_id: "com03", tutor_id: "tut02" },
  { id: "est05", rut: "19.555.666-7", nombre: "Sofía", ap_paterno: "González", ap_materno: "Ríos", email: "sofia.gonzalez@example.com", carrera_id: "car05", comuna_id: "com04", tutor_id: "tut01" },
];

export const mockEstablecimientos: Establecimiento[] = [
  { id: "estbl01", rbd: "12345-6", nombre: "COLEGIO POLIVALENTE DOMINGO PARRA CORVALÁN", dependencia: "Particular Subvencionado", comuna_id: "com01" },
  { id: "estbl02", rbd: "23456-7", nombre: "LICEO ENRIQUE MOLINA GARMENDIA", dependencia: "Municipal", comuna_id: "com01" },
  { id: "estbl03", rbd: "34567-8", nombre: "COLEGIO SALESIANO CONCEPCIÓN", dependencia: "Particular Pagado", comuna_id: "com01" },
  { id: "estbl04", rbd: "45678-9", nombre: "COLEGIO INMACULADA CONCEPCIÓN", dependencia: "Particular Pagado", comuna_id: "com02" },
];

export const mockDirectivos: Directivo[] = [
    { id: 'dir01', establecimiento_id: 'estbl01', nombre: 'Arturo Ortega', email: 'aortega@dpcorvalan.cl', cargo: 'Jefe UTP' },
    { id: 'dir02', establecimiento_id: 'estbl02', nombre: 'Beatriz Salamanca', email: 'bsalamanca@lemg.cl', cargo: 'Directora' },
    { id: 'dir03', establecimiento_id: 'estbl03', nombre: 'Carlos Valenzuela', email: 'cvalenzuela@salesianosconcepcion.cl', cargo: 'Jefe UTP' },
    { id: 'dir04', establecimiento_id: 'estbl04', nombre: 'Daniela Figueroa', email: 'dfigueroa@cic.cl', cargo: 'Coordinadora Académica' },
    { id: 'dir05', establecimiento_id: 'estbl01', nombre: 'Mariela Paz', email: 'mpaz@dpcorvalan.cl', cargo: 'Orientadora' },
    { id: 'dir06', establecimiento_id: 'estbl02', nombre: 'Roberto Fuentes', email: 'rfuentes@lemg.cl', cargo: 'Inspector General' },
];

export const mockNivelesPractica: NivelPractica[] = [
    { id: 'np01', nombre: 'Práctica Inicial', carrera_id: 'car01' },
    { id: 'np02', nombre: 'Práctica Intermedia', carrera_id: 'car01' },
    { id: 'np03', nombre: 'Práctica Profesional', carrera_id: 'car01' },
    { id: 'np04', nombre: 'Práctica Profesional', carrera_id: 'car02' },
    { id: 'np05', nombre: 'Práctica Profesional', carrera_id: 'car04' },
    { id: 'np06', nombre: 'Práctica de Observación', carrera_id: 'car05' },
    { id: 'np07', nombre: 'Práctica Profesional', carrera_id: 'car05' },
    { id: 'np08', nombre: 'Práctica Psicopedagógica', carrera_id: 'car03' },
    { id: 'np09', nombre: 'Práctica en NEE Transitorias', carrera_id: 'car06' },
    { id: 'np10', nombre: 'Práctica en NEE Permanentes', carrera_id: 'car06' },
];

export const mockCupos: Cupo[] = [
    { id: 'cup01', establecimiento_id: 'estbl01', nivel_practica_id: 'np02' },
    { id: 'cup02', establecimiento_id: 'estbl01', nivel_practica_id: 'np03' },
    { id: 'cup03', establecimiento_id: 'estbl02', nivel_practica_id: 'np04' },
    { id: 'cup04', establecimiento_id: 'estbl02', nivel_practica_id: 'np05' },
    { id: 'cup05', establecimiento_id: 'estbl03', nivel_practica_id: 'np07' },
    { id: 'cup06', establecimiento_id: 'estbl04', nivel_practica_id: 'np03' },
];
