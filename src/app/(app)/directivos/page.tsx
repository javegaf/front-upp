
"use client";

import { useState, useEffect } from "react";
import type { Directivo, Establecimiento } from "@/lib/definitions";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DirectivoForm, type DirectivoFormValues } from "@/components/directivos/directivo-form";
import { DirectivoTable } from "@/components/directivos/directivo-table";
import { useToast } from "@/hooks/use-toast";

export default function DirectivosPage() {
  const { toast } = useToast();
  const [directivos, setDirectivos] = useState<Directivo[]>([]);
  const [filteredDirectivos, setFilteredDirectivos] = useState<Directivo[]>([]);
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDirectivo, setEditingDirectivo] = useState<Directivo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [directivosData, establecimientosData] = await Promise.all([
        api.getDirectivos(),
        api.getEstablecimientos()
      ]);
      setDirectivos(directivosData);
      setFilteredDirectivos(directivosData);
      setEstablecimientos(establecimientosData);
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron obtener los directivos y establecimientos.",
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

  const handleDelete = async (directivoId: number) => {
    try {
      await api.deleteDirectivo(directivoId);
      toast({ title: "Directivo Eliminado" });
      await fetchAllData();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el directivo.", variant: "destructive" });
    }
  };

  const handleSubmit = async (data: DirectivoFormValues) => {
    try {
      if (editingDirectivo) {
        await api.updateDirectivo(editingDirectivo.id, data);
        toast({ title: "Directivo Actualizado" });
      } else {
        await api.createDirectivo(data);
        toast({ title: "Directivo Creado" });
      }
      setIsFormOpen(false);
      await fetchAllData();
    } catch(error) {
      toast({ title: "Error", description: "No se pudo guardar el directivo.", variant: "destructive" });
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
