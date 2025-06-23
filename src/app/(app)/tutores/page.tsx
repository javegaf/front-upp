
"use client";

import { useState, useEffect } from "react";
import type { Tutor } from "@/lib/definitions";
import { mockTutores } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TutorForm } from "@/components/tutores/tutor-form";
import { TutorTable } from "@/components/tutores/tutor-table";

// Mock API functions
const getTutoresFromAPI = async (): Promise<Tutor[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTutores;
};

const addTutorToAPI = async (data: Omit<Tutor, "id">): Promise<Tutor> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...data, id: String(Date.now()) };
};

const updateTutorInAPI = async (tutor: Tutor): Promise<Tutor> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return tutor;
};

const deleteTutorFromAPI = async (tutorId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export default function TutoresPage() {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [filteredTutores, setFilteredTutores] = useState<Tutor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const data = await getTutoresFromAPI();
      setTutores(data);
      setFilteredTutores(data);
      setIsLoading(false);
    };
    fetchInitialData();
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

  const handleDelete = async (tutorId: string) => {
    await deleteTutorFromAPI(tutorId);
    setTutores(prev => prev.filter((t) => t.id !== tutorId));
  };

  const handleSubmit = async (data: Omit<Tutor, "id">) => {
    if (editingTutor) {
      const updated = await updateTutorInAPI({ ...data, id: editingTutor.id });
      setTutores(prev => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const newTutor = await addTutorToAPI(data);
      setTutores(prev => [...prev, newTutor]);
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
