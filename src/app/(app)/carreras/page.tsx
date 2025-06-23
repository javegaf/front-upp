
"use client";

import { useState, useEffect } from "react";
import type { Carrera, NivelPractica } from "@/lib/definitions";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CarreraForm } from "@/components/carreras/carrera-form";
import { CarreraTable } from "@/components/carreras/carrera-table";
import { NivelPracticaManager } from "@/components/carreras/nivel-practica-manager";
import { useToast } from "@/hooks/use-toast";

export default function CarrerasPage() {
  const { toast } = useToast();
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [filteredCarreras, setFilteredCarreras] = useState<Carrera[]>([]);
  const [nivelesPractica, setNivelesPractica] = useState<NivelPractica[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCarrera, setEditingCarrera] = useState<Carrera | null>(null);

  const [isNivelManagerOpen, setIsNivelManagerOpen] = useState(false);
  const [managingNivelesFor, setManagingNivelesFor] = useState<Carrera | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [carrerasData, nivelesData] = await Promise.all([
        api.getCarreras(),
        api.getNivelesPractica(),
      ]);
      setCarreras(carrerasData);
      setFilteredCarreras(carrerasData);
      setNivelesPractica(nivelesData);
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron obtener carreras y niveles de práctica.",
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
    const results = carreras.filter(carrera =>
      carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCarreras(results);
  }, [searchTerm, carreras]);

  const handleAdd = () => {
    setEditingCarrera(null);
    setIsFormOpen(true);
  };

  const handleEdit = (carrera: Carrera) => {
    setEditingCarrera(carrera);
    setIsFormOpen(true);
  };

  const handleDelete = async (carreraId: number) => {
    try {
        await api.deleteCarrera(carreraId);
        toast({ title: "Carrera Eliminada", description: "La carrera ha sido eliminada." });
        await fetchAllData();
    } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar la carrera.", variant: "destructive" });
    }
  };

  const handleSubmit = async (data: { nombre: string }) => {
    try {
        if (editingCarrera) {
            await api.updateCarrera(editingCarrera.id, data);
            toast({ title: "Carrera Actualizada", description: `La carrera "${data.nombre}" ha sido actualizada.` });
        } else {
            await api.createCarrera(data);
            toast({ title: "Carrera Creada", description: `La carrera "${data.nombre}" ha sido registrada.` });
        }
        setIsFormOpen(false);
        await fetchAllData();
    } catch (error) {
        toast({ title: "Error", description: "No se pudo guardar la carrera.", variant: "destructive" });
    }
  };

  const handleManageNiveles = (carrera: Carrera) => {
    setManagingNivelesFor(carrera);
    setIsNivelManagerOpen(true);
  };
  
  const handleAddNivel = async (data: { nombre: string }) => {
    if (!managingNivelesFor) return;
    try {
        await api.createNivelPractica({ ...data, carrera_id: managingNivelesFor.id });
        toast({ title: "Nivel de Práctica Agregado", description: `Se ha añadido "${data.nombre}".` });
        await fetchAllData();
    } catch (error) {
        toast({ title: "Error", description: "No se pudo agregar el nivel.", variant: "destructive" });
    }
  };

  const handleDeleteNivel = async (nivelId: number) => {
    try {
        await api.deleteNivelPractica(nivelId);
        toast({ title: "Nivel de Práctica Eliminado" });
        await fetchAllData();
    } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar el nivel.", variant: "destructive" });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Carreras</h1>
          <p className="text-muted-foreground">Administra las carreras y sus niveles de práctica.</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Carrera
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Carreras</CardTitle>
          <CardDescription>Busca, visualiza y gestiona las carreras y sus niveles de práctica.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando carreras...</p>
          ) : (
            <CarreraTable
              carreras={filteredCarreras}
              nivelesPractica={nivelesPractica}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onManageNiveles={handleManageNiveles}
            />
          )}
        </CardContent>
      </Card>

      <CarreraForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={editingCarrera}
      />
      
      {managingNivelesFor && (
        <NivelPracticaManager
          isOpen={isNivelManagerOpen}
          onOpenChange={setIsNivelManagerOpen}
          carrera={managingNivelesFor}
          niveles={nivelesPractica.filter(n => n.carrera_id === managingNivelesFor.id)}
          onAddNivel={handleAddNivel}
          onDeleteNivel={handleDeleteNivel}
        />
      )}

    </div>
  );
}
