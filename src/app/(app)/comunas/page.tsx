
"use client";

import { useState, useEffect } from "react";
import type { Comuna } from "@/lib/definitions";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComunaForm } from "@/components/comunas/comuna-form";
import { ComunaTable } from "@/components/comunas/comuna-table";
import { useToast } from "@/hooks/use-toast";

export default function ComunasPage() {
  const { toast } = useToast();
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [filteredComunas, setFilteredComunas] = useState<Comuna[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComuna, setEditingComuna] = useState<Comuna | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchComunas = async () => {
    setIsLoading(true);
    try {
      const data = await api.getComunas();
      setComunas(data);
      setFilteredComunas(data);
    } catch (error) {
      toast({
        title: "Error al cargar comunas",
        description: "No se pudieron obtener los datos de las comunas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComunas();
  }, []);

  useEffect(() => {
    const results = comunas.filter(comuna =>
      comuna.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComunas(results);
  }, [searchTerm, comunas]);

  const handleAdd = () => {
    setEditingComuna(null);
    setIsFormOpen(true);
  };

  const handleEdit = (comuna: Comuna) => {
    setEditingComuna(comuna);
    setIsFormOpen(true);
  };

  const handleDelete = async (comunaId: number) => {
    try {
      await api.deleteComuna(comunaId);
      toast({ title: "Comuna Eliminada" });
      await fetchComunas();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la comuna.", variant: "destructive" });
    }
  };

  const handleSubmit = async (data: { nombre: string }) => {
    try {
      if (editingComuna) {
        await api.updateComuna(editingComuna.id, data);
        toast({ title: "Comuna Actualizada" });
      } else {
        await api.createComuna(data);
        toast({ title: "Comuna Creada" });
      }
      setIsFormOpen(false);
      await fetchComunas();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar la comuna.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Comunas</h1>
          <p className="text-muted-foreground">Administra las comunas disponibles en el sistema.</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Comuna
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Comunas</CardTitle>
          <CardDescription>Busca, visualiza y gestiona las comunas registradas.</CardDescription>
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
            <p>Cargando comunas...</p>
          ) : (
            <ComunaTable
              comunas={filteredComunas}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <ComunaForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={editingComuna}
      />
    </div>
  );
}
