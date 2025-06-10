"use client";

import { useState, useEffect } from "react";
import type { Alumno } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { StudentForm } from "@/components/alumnos/student-form";
import { StudentTable } from "@/components/alumnos/student-table";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock data and functions - replace with actual API calls and server actions
const getAlumnosFromAPI = async (): Promise<Alumno[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would fetch from your backend
  return [
    { id: "1", nombres: "Ana", apellidos: "García López", email: "ana.garcia@example.com", carrera: "Educación Parvularia", semestre: 7, telefono: "+56911111111" },
    { id: "2", nombres: "Carlos", apellidos: "Rodríguez Soto", email: "carlos.rodriguez@example.com", carrera: "Pedagogía en Matemática y Física", semestre: 5, telefono: "+56922222222" },
    { id: "3", nombres: "Luisa", apellidos: "Martínez Vera", email: "luisa.martinez@example.com", carrera: "Psicopedagogía", semestre: 8 },
  ];
};

const addAlumnoToAPI = async (data: Omit<Alumno, "id">): Promise<Alumno> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...data, id: String(Date.now()) }; // Simple ID generation for mock
};

const updateAlumnoInAPI = async (alumno: Alumno): Promise<Alumno> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return alumno;
};

const deleteAlumnoFromAPI = async (alumnoId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // No return value needed for delete
};


export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState<Alumno[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlumnos = async () => {
      setIsLoading(true);
      const data = await getAlumnosFromAPI();
      setAlumnos(data);
      setFilteredAlumnos(data);
      setIsLoading(false);
    };
    fetchAlumnos();
  }, []);
  
  useEffect(() => {
    const results = alumnos.filter(alumno =>
      `${alumno.nombres} ${alumno.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.carrera.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlumnos(results);
  }, [searchTerm, alumnos]);


  const handleAddAlumno = () => {
    setEditingAlumno(null);
    setIsFormOpen(true);
  };

  const handleEditAlumno = (alumno: Alumno) => {
    setEditingAlumno(alumno);
    setIsFormOpen(true);
  };

  const handleDeleteAlumno = async (alumnoId: string) => {
    // This would be a server action in a real app
    await deleteAlumnoFromAPI(alumnoId);
    const updatedAlumnos = alumnos.filter((a) => a.id !== alumnoId);
    setAlumnos(updatedAlumnos);
  };

  const handleSubmitForm = async (data: Omit<Alumno, "id">) => {
    if (editingAlumno) {
      // This would be a server action
      const updatedAlumno = await updateAlumnoInAPI({ ...data, id: editingAlumno.id });
      setAlumnos(alumnos.map((a) => (a.id === updatedAlumno.id ? updatedAlumno : a)));
    } else {
      // This would be a server action
      const newAlumno = await addAlumnoToAPI(data);
      setAlumnos([...alumnos, newAlumno]);
    }
    setIsFormOpen(false);
    setEditingAlumno(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Alumnos</h1>
          <p className="text-muted-foreground">Administra la información de los estudiantes.</p>
        </div>
        <Button onClick={handleAddAlumno} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Alumno
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Alumnos</CardTitle>
          <CardDescription>Busca, visualiza y gestiona los alumnos registrados en el sistema.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, email o carrera..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando alumnos...</p> 
          ) : (
            <StudentTable
              alumnos={filteredAlumnos}
              onEdit={handleEditAlumno}
              onDelete={handleDeleteAlumno}
            />
          )}
        </CardContent>
      </Card>

      <StudentForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitForm}
        initialData={editingAlumno}
      />
    </div>
  );
}
