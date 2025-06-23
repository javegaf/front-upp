
"use client";

import { useState, useEffect } from "react";
import type { Directivo, Establecimiento } from "@/lib/definitions";
import { mockDirectivos, mockEstablecimientos } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DirectivoForm } from "@/components/directivos/directivo-form";
import { DirectivoTable } from "@/components/directivos/directivo-table";

// Mock API functions
const getDirectivosFromAPI = async (): Promise<Directivo[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDirectivos;
};
const getEstablecimientosFromAPI = async (): Promise<Establecimiento[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEstablecimientos;
};

const addDirectivoToAPI = async (data: Omit<Directivo, "id">): Promise<Directivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...data, id: String(Date.now()) };
};

const updateDirectivoInAPI = async (directivo: Directivo): Promise<Directivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return directivo;
};

const deleteDirectivoFromAPI = async (directivoId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export default function DirectivosPage() {
  const [directivos, setDirectivos] = useState<Directivo[]>([]);
  const [filteredDirectivos, setFilteredDirectivos] = useState<Directivo[]>([]);
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDirectivo, setEditingDirectivo] = useState<Directivo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const [directivosData, establecimientosData] = await Promise.all([
        getDirectivosFromAPI(),
        getEstablecimientosFromAPI()
      ]);
      setDirectivos(directivosData);
      setFilteredDirectivos(directivosData);
      setEstablecimientos(establecimientosData);
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const results = directivos.filter(d =>
      d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (establecimientos.find(e => e.id === d.establecimiento_id)?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDirectivos(results);
  }, [searchTerm, directivos, establecimientos]);

  const handleAdd = () => {
    setEditingDirectivo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (directivo: Directivo) => {
    setEditingDirectivo(directivo);
    setIsFormOpen(true);
  };

  const handleDelete = async (directivoId: string) => {
    await deleteDirectivoFromAPI(directivoId);
    setDirectivos(prev => prev.filter((d) => d.id !== directivoId));
  };

  const handleSubmit = async (data: Omit<Directivo, "id">) => {
    if (editingDirectivo) {
      const updated = await updateDirectivoInAPI({ ...data, id: editingDirectivo.id });
      setDirectivos(prev => prev.map((d) => (d.id === updated.id ? updated : d)));
    } else {
      const newDirectivo = await addDirectivoToAPI(data);
      setDirectivos(prev => [...prev, newDirectivo]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Directivos</h1>
          <p className="text-muted-foreground">Administra los contactos de los establecimientos.</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Directivo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Directivos</CardTitle>
          <CardDescription>Busca, visualiza y gestiona los directivos y contactos.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, email, cargo o colegio..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando directivos...</p>
          ) : (
            <DirectivoTable
              directivos={filteredDirectivos}
              establecimientos={establecimientos}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <DirectivoForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={editingDirectivo}
        establecimientos={establecimientos}
      />
    </div>
  );
}
