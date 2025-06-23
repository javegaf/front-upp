
"use client";

import { useState, useEffect } from "react";
import type { Carrera } from "@/lib/definitions";
import { mockCarreras } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CarreraForm } from "@/components/carreras/carrera-form";
import { CarreraTable } from "@/components/carreras/carrera-table";

// Mock API functions
const getCarrerasFromAPI = async (): Promise<Carrera[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCarreras;
};

const addCarreraToAPI = async (data: Omit<Carrera, "id">): Promise<Carrera> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...data, id: String(Date.now()) };
};

const updateCarreraInAPI = async (carrera: Carrera): Promise<Carrera> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return carrera;
};

const deleteCarreraFromAPI = async (carreraId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export default function CarrerasPage() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [filteredCarreras, setFilteredCarreras] = useState<Carrera[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCarrera, setEditingCarrera] = useState<Carrera | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const data = await getCarrerasFromAPI();
      setCarreras(data);
      setFilteredCarreras(data);
      setIsLoading(false);
    };
    fetchInitialData();
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

  const handleDelete = async (carreraId: string) => {
    await deleteCarreraFromAPI(carreraId);
    setCarreras(prev => prev.filter((c) => c.id !== carreraId));
  };

  const handleSubmit = async (data: Omit<Carrera, "id">) => {
    if (editingCarrera) {
      const updated = await updateCarreraInAPI({ ...data, id: editingCarrera.id });
      setCarreras(prev => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const newCarrera = await addCarreraToAPI(data);
      setCarreras(prev => [...prev, newCarrera]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Carreras</h1>
          <p className="text-muted-foreground">Administra las carreras ofrecidas.</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Carrera
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Carreras</CardTitle>
          <CardDescription>Busca, visualiza y gestiona las carreras registradas.</CardDescription>
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
              onEdit={handleEdit}
              onDelete={handleDelete}
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
    </div>
  );
}
