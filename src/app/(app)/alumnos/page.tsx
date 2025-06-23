
"use client";

import { useState, useEffect } from "react";
import type { Estudiante, Carrera, Comuna, Tutor } from "@/lib/definitions";
import { mockEstudiantes, mockCarreras, mockComunas, mockTutores } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { StudentForm } from "@/components/alumnos/student-form";
import { StudentTable } from "@/components/alumnos/student-table";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock data and functions - replace with actual API calls and server actions
const getEstudiantesFromAPI = async (): Promise<Estudiante[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would fetch from your backend
  return mockEstudiantes;
};

const addEstudianteToAPI = async (data: Omit<Estudiante, "id">): Promise<Estudiante> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...data, id: String(Date.now()) }; // Simple ID generation for mock
};

const updateEstudianteInAPI = async (estudiante: Estudiante): Promise<Estudiante> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return estudiante;
};

const deleteEstudianteFromAPI = async (estudianteId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // No return value needed for delete
};


export default function AlumnosPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<Estudiante[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // For passing to form selects
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const data = await getEstudiantesFromAPI();
      setEstudiantes(data);
      setFilteredEstudiantes(data);
      // In a real app, these would also be API calls
      setCarreras(mockCarreras);
      setComunas(mockComunas);
      setTutores(mockTutores);
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    const results = estudiantes.filter(estudiante =>
      `${estudiante.nombre} ${estudiante.ap_paterno} ${estudiante.ap_materno}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (carreras.find(c => c.id === estudiante.carrera_id)?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEstudiantes(results);
  }, [searchTerm, estudiantes, carreras]);


  const handleAddEstudiante = () => {
    setEditingEstudiante(null);
    setIsFormOpen(true);
  };

  const handleEditEstudiante = (estudiante: Estudiante) => {
    setEditingEstudiante(estudiante);
    setIsFormOpen(true);
  };

  const handleDeleteEstudiante = async (estudianteId: string) => {
    // This would be a server action in a real app
    await deleteEstudianteFromAPI(estudianteId);
    const updatedEstudiantes = estudiantes.filter((a) => a.id !== estudianteId);
    setEstudiantes(updatedEstudiantes);
  };

  const handleSubmitForm = async (data: Omit<Estudiante, "id">) => {
    if (editingEstudiante) {
      // This would be a server action
      const updatedEstudiante = await updateEstudianteInAPI({ ...data, id: editingEstudiante.id });
      setEstudiantes(estudiantes.map((a) => (a.id === updatedEstudiante.id ? updatedEstudiante : a)));
    } else {
      // This would be a server action
      const newEstudiante = await addEstudianteToAPI(data);
      setEstudiantes([...estudiantes, newEstudiante]);
    }
    setIsFormOpen(false);
    setEditingEstudiante(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Estudiantes</h1>
          <p className="text-muted-foreground">Administra la información de los estudiantes.</p>
        </div>
        <Button onClick={handleAddEstudiante} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Estudiante
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Estudiantes</CardTitle>
          <CardDescription>Busca, visualiza y gestiona los estudiantes registrados en el sistema.</CardDescription>
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
            <p>Cargando estudiantes...</p> 
          ) : (
            <StudentTable
              estudiantes={filteredEstudiantes}
              carreras={carreras}
              onEdit={handleEditEstudiante}
              onDelete={handleDeleteEstudiante}
            />
          )}
        </CardContent>
      </Card>

      <StudentForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitForm}
        initialData={editingEstudiante}
        carreras={carreras}
        comunas={comunas}
        tutores={tutores}
      />
    </div>
  );
}
