
"use client";

import { useState, useEffect } from "react";
import type { Establecimiento, Comuna, Cupo, NivelPractica, Carrera } from "@/lib/definitions";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ColegioTable } from "@/components/colegios/colegio-table";
import { ColegioForm, type ColegioFormValues } from "@/components/colegios/colegio-form";
import { CupoManager } from "@/components/colegios/cupo-manager";
import { useToast } from "@/hooks/use-toast";

export default function ColegiosPage() {
  const { toast } = useToast();
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [filteredEstablecimientos, setFilteredEstablecimientos] = useState<Establecimiento[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [cupos, setCupos] = useState<Cupo[]>([]);
  const [nivelesPractica, setNivelesPractica] = useState<NivelPractica[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingColegio, setEditingColegio] = useState<Establecimiento | null>(null);

  const [isCupoManagerOpen, setIsCupoManagerOpen] = useState(false);
  const [managingCuposFor, setManagingCuposFor] = useState<Establecimiento | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [estabData, comunasData, cuposData, nivelesData, carrerasData] = await Promise.all([
        api.getEstablecimientos(),
        api.getComunas(),
        api.getCupos(),
        api.getNivelesPractica(),
        api.getCarreras(),
      ]);
      setEstablecimientos(estabData);
      setFilteredEstablecimientos(estabData);
      setComunas(comunasData);
      setCupos(cuposData);
      setNivelesPractica(nivelesData);
      setCarreras(carrerasData);
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron obtener los datos de colegios.",
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
    const results = establecimientos.filter(colegio =>
      colegio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colegio.rbd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comunas.find(c => c.id === colegio.comuna_id)?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEstablecimientos(results);
  }, [searchTerm, establecimientos, comunas]);

  const handleAddColegio = () => {
    setEditingColegio(null);
    setIsFormOpen(true);
  };

  const handleEditColegio = (colegio: Establecimiento) => {
    setEditingColegio(colegio);
    setIsFormOpen(true);
  };

  const handleDeleteColegio = async (colegioId: string) => {
    try {
      await api.deleteEstablecimiento(colegioId);
      toast({ title: "Colegio Eliminado" });
      await fetchAllData();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el colegio.", variant: "destructive" });
    }
  };

  const handleSubmitForm = async (data: ColegioFormValues) => {
     const payload = {
        ...data,
        comuna_id: Number(data.comuna_id),
    };
    try {
      if (editingColegio) {
        await api.updateEstablecimiento(editingColegio.id, payload);
        toast({ title: "Colegio Actualizado" });
      } else {
        await api.createEstablecimiento(payload);
        toast({ title: "Colegio Creado" });
      }
      setIsFormOpen(false);
      await fetchAllData();
    } catch (error) {
       toast({ title: "Error", description: "No se pudo guardar el colegio.", variant: "destructive" });
    }
  };

  const handleManageCupos = (establecimiento: Establecimiento) => {
    setManagingCuposFor(establecimiento);
    setIsCupoManagerOpen(true);
  };

  const handleAddCupo = async (data: { nivel_practica_id: string }) => {
    if (!managingCuposFor) return;
    const payload = {
        establecimiento_id: managingCuposFor.id,
        nivel_practica_id: Number(data.nivel_practica_id),
    };
    try {
        await api.createCupo(payload);
        toast({ title: "Cupo Agregado" });
        await fetchAllData(); // Re-fetch cupos
    } catch (error) {
        toast({ title: "Error", description: "No se pudo agregar el cupo.", variant: "destructive" });
    }
  };

  const handleDeleteCupo = async (cupoId: number) => {
    try {
        await api.deleteCupo(cupoId);
        toast({ title: "Cupo Eliminado" });
        await fetchAllData(); // Re-fetch cupos
    } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar el cupo.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Colegios</h1>
          <p className="text-muted-foreground">Administra los colegios, centros de práctica y sus cupos disponibles.</p>
        </div>
        <Button onClick={handleAddColegio} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Colegio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Colegios</CardTitle>
          <CardDescription>Busca, visualiza y gestiona los colegios y sus cupos.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, RBD o comuna..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando colegios...</p> 
          ) : (
            <ColegioTable
              establecimientos={filteredEstablecimientos}
              comunas={comunas}
              cupos={cupos}
              onEdit={handleEditColegio}
              onDelete={handleDeleteColegio}
              onManageCupos={handleManageCupos}
            />
          )}
        </CardContent>
      </Card>

      <ColegioForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitForm}
        initialData={editingColegio}
        comunas={comunas}
      />

      {managingCuposFor && (
        <CupoManager
          isOpen={isCupoManagerOpen}
          onOpenChange={setIsCupoManagerOpen}
          establecimiento={managingCuposFor}
          cupos={cupos.filter(c => c.establecimiento_id === managingCuposFor.id)}
          nivelesPractica={nivelesPractica}
          carreras={carreras}
          onAddCupo={handleAddCupo}
          onDeleteCupo={handleDeleteCupo}
        />
      )}
    </div>
  );
}
