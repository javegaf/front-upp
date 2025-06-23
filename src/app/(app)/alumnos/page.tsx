
"use client";

import { useState, useEffect } from "react";
import type { Estudiante, Carrera, Comuna, Tutor, Ficha, Establecimiento, NivelPractica, Cupo } from "@/lib/definitions";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StudentForm, type StudentFormValues } from "@/components/alumnos/student-form";
import { StudentTable } from "@/components/alumnos/student-table";
import { StudentDetails } from "@/components/alumnos/student-details";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AlumnosPage() {
  const { toast } = useToast();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<Estudiante[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null);
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<Estudiante | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Data for forms and details view
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [nivelesPractica, setNivelesPractica] = useState<NivelPractica[]>([]);
  const [cupos, setCupos] = useState<Cupo[]>([]);


  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [
        estudiantesData, 
        carrerasData, 
        comunasData, 
        tutoresData,
        fichasData,
        establecimientosData,
        nivelesData,
        cuposData
      ] = await Promise.all([
        api.getEstudiantes(),
        api.getCarreras(),
        api.getComunas(),
        api.getTutores(),
        api.getFichas(),
        api.getEstablecimientos(),
        api.getNivelesPractica(),
        api.getCupos()
      ]);
      setEstudiantes(estudiantesData);
      setFilteredEstudiantes(estudiantesData);
      setCarreras(carrerasData);
      setComunas(comunasData);
      setTutores(tutoresData);
      setFichas(fichasData);
      setEstablecimientos(establecimientosData);
      setNivelesPractica(nivelesData);
      setCupos(cuposData);
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron obtener los datos del servidor. Inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
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

  const handleViewDetails = (estudiante: Estudiante) => {
    setSelectedStudentForDetails(estudiante);
    setIsDetailsOpen(true);
  };

  const handleDeleteEstudiante = async (estudianteId: number) => {
    try {
      await api.deleteEstudiante(estudianteId);
      await fetchAllData(); // Re-fetch to update the list
      toast({
        title: "Estudiante Eliminado",
        description: "El estudiante ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el estudiante.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForm = async (data: StudentFormValues) => {
    const payload = {
        ...data,
        carrera_id: Number(data.carrera_id),
        comuna_id: Number(data.comuna_id),
        tutor_id: data.tutor_id ? Number(data.tutor_id) : null,
        cond_especial: data.cond_especial || null,
    };
    
    try {
        if (editingEstudiante) {
            await api.updateEstudiante(editingEstudiante.id, payload);
            toast({
                title: "Estudiante Actualizado",
                description: `El estudiante "${data.nombre}" ha sido actualizado.`,
            });
        } else {
            await api.createEstudiante(payload);
            toast({
                title: "Estudiante Creado",
                description: `El estudiante "${data.nombre}" ha sido registrado.`,
            });
        }
        setIsFormOpen(false);
        setEditingEstudiante(null);
        await fetchAllData(); // Re-fetch to update the list
    } catch (error) {
        toast({
            title: `Error al ${editingEstudiante ? 'actualizar' : 'crear'}`,
            description: `No se pudo guardar el estudiante.`,
            variant: "destructive",
        });
    }
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
              onViewDetails={handleViewDetails}
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

      <StudentDetails
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        student={selectedStudentForDetails}
        carreras={carreras}
        comunas={comunas}
        tutores={tutores}
        fichas={fichas}
        establecimientos={establecimientos}
        cupos={cupos}
        nivelesPractica={nivelesPractica}
      />
    </div>
  );
}
