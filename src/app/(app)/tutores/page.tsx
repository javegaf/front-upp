
"use client";

import { useState, useEffect } from "react";
import type { Tutor } from "@/lib/definitions";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TutorForm } from "@/components/tutores/tutor-form";
import { TutorTable } from "@/components/tutores/tutor-table";
import { useToast } from "@/hooks/use-toast";

export default function TutoresPage() {
  const { toast } = useToast();
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [filteredTutores, setFilteredTutores] = useState<Tutor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTutores = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTutores();
      setTutores(data);
      setFilteredTutores(data);
    } catch (error) {
      toast({
        title: "Error al cargar tutores",
        description: "No se pudieron obtener los datos de los tutores del servidor.",
        variant: "destructive",
      });
      setTutores([]);
      setFilteredTutores([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutores();
  }, []);

  useEffect(() => {
    const results = tutores.filter(tutor =>
      tutor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTutores(results);
  }, [searchTerm, tutores]);

  const handleAdd = () => {
    setEditingTutor(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tutor: Tutor) => {
    setEditingTutor(tutor);
    setIsFormOpen(true);
  };

  const handleDelete = async (tutorId: number) => {
    try {
        await api.deleteTutor(tutorId);
        toast({ title: "Tutor Eliminado", description: "El tutor ha sido eliminado exitosamente." });
        await fetchTutores();
    } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar el tutor.", variant: "destructive" });
    }
  };

  const handleSubmit = async (data: Omit<Tutor, "id">) => {
    try {
        if (editingTutor) {
            await api.updateTutor(editingTutor.id, data);
            toast({ title: "Tutor Actualizado", description: `El tutor "${data.nombre}" ha sido actualizado.` });
        } else {
            await api.createTutor(data);
            toast({ title: "Tutor Creado", description: `El tutor "${data.nombre}" ha sido registrado.` });
        }
        setIsFormOpen(false);
        await fetchTutores();
    } catch (error) {
        toast({ title: "Error", description: "Ocurrió un error al guardar el tutor.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Tutores</h1>
          <p className="text-muted-foreground">Administra los tutores académicos de la universidad.</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Tutor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Tutores</CardTitle>
          <CardDescription>Busca, visualiza y gestiona los tutores registrados.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o email..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando tutores...</p>
          ) : (
            <TutorTable
              tutores={filteredTutores}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <TutorForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={editingTutor}
      />
    </div>
  );
}
