
"use client";

import { useState, useEffect } from "react";
import type { Establecimiento, Comuna, Cupo, NivelPractica, Carrera } from "@/lib/definitions";
import { mockEstablecimientos, mockComunas, mockCupos, mockNivelesPractica, mockCarreras } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, FilePenLine, Trash2, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CupoManager } from "@/components/colegios/cupo-manager";


// Mock API functions
const getEstablecimientosFromAPI = async (): Promise<Establecimiento[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEstablecimientos;
};

const addEstablecimientoToAPI = async (data: Omit<Establecimiento, "id">): Promise<Establecimiento> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newEstablecimiento = { ...data, id: String(Date.now()) };
  mockEstablecimientos.push(newEstablecimiento);
  return newEstablecimiento;
};

const updateEstablecimientoInAPI = async (establecimiento: Establecimiento): Promise<Establecimiento> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockEstablecimientos.findIndex(e => e.id === establecimiento.id);
  if (index !== -1) mockEstablecimientos[index] = establecimiento;
  return establecimiento;
};

const deleteEstablecimientoFromAPI = async (establecimientoId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockEstablecimientos.findIndex(e => e.id === establecimientoId);
  if (index !== -1) mockEstablecimientos.splice(index, 1);
};

const addCupoToAPI = async (data: Omit<Cupo, "id">): Promise<Cupo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newCupo = { ...data, id: String(Date.now()) };
  mockCupos.push(newCupo);
  return newCupo;
};

const deleteCupoFromAPI = async (cupoId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockCupos.findIndex(c => c.id === cupoId);
  if (index !== -1) mockCupos.splice(index, 1);
};

// Form Schema
const colegioSchema = z.object({
  rbd: z.string().min(1, "RBD es requerido"),
  nombre: z.string().min(3, "Nombre es requerido"),
  dependencia: z.string().min(1, "Dependencia es requerida"),
  comuna_id: z.string().min(1, "Comuna es requerida"),
});

type ColegioFormValues = z.infer<typeof colegioSchema>;

interface ColegioFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ColegioFormValues) => Promise<void>;
  initialData?: Establecimiento | null;
  comunas: Comuna[];
}

// ColegioForm Component
function ColegioForm({ isOpen, onOpenChange, onSubmit, initialData, comunas }: ColegioFormProps) {
  const { toast } = useToast();
  
  const defaultValues = { rbd: "", nombre: "", dependencia: "", comuna_id: "" };

  const form = useForm<ColegioFormValues>({
    resolver: zodResolver(colegioSchema),
    defaultValues: initialData || defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(initialData || defaultValues);
    }
  }, [initialData, form, isOpen]);

  const handleFormSubmit = async (data: ColegioFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: `Colegio ${initialData ? 'actualizado' : 'creado'}`,
        description: `El colegio "${data.nombre}" ha sido ${initialData ? 'actualizado' : 'registrado'} exitosamente.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Ocurrió un error al ${initialData ? 'actualizar' : 'crear'} el colegio.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {initialData ? "Editar Colegio" : "Agregar Nuevo Colegio"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="rbd" render={({ field }) => (
                <FormItem>
                  <FormLabel>RBD</FormLabel>
                  <FormControl><Input placeholder="Ej: 12345-6" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Establecimiento</FormLabel>
                  <FormControl><Input placeholder="Ej: Liceo Bicentenario" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="dependencia" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dependencia</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una dependencia" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Municipal">Municipal</SelectItem>
                      <SelectItem value="Particular Subvencionado">Particular Subvencionado</SelectItem>
                      <SelectItem value="Particular Pagado">Particular Pagado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            )}/>
             <FormField control={form.control} name="comuna_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Comuna</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una comuna" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {comunas.map((comuna) => (
                        <SelectItem key={comuna.id} value={comuna.id}>{comuna.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            )}/>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando..." : (initialData ? "Actualizar Colegio" : "Agregar Colegio")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


// ColegioTable Component
interface ColegioTableProps {
  establecimientos: Establecimiento[];
  comunas: Comuna[];
  cupos: Cupo[];
  onEdit: (establecimiento: Establecimiento) => void;
  onDelete: (establecimientoId: string) => Promise<void>;
  onManageCupos: (establecimiento: Establecimiento) => void;
}

function ColegioTable({ establecimientos, comunas, cupos, onEdit, onDelete, onManageCupos }: ColegioTableProps) {
  const { toast } = useToast();

  const getComunaName = (comunaId: string) => comunas.find(c => c.id === comunaId)?.nombre || "N/A";
  const getCuposCount = (establecimientoId: string) => cupos.filter(c => c.establecimiento_id === establecimientoId).length;

  const handleDeleteConfirmation = async (establecimientoId: string) => {
    try {
      await onDelete(establecimientoId);
      toast({
        title: "Colegio Eliminado",
        description: "El colegio ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el colegio.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RBD</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Dependencia</TableHead>
            <TableHead>Comuna</TableHead>
            <TableHead>Cupos</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {establecimientos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No hay colegios registrados.
              </TableCell>
            </TableRow>
          ) : (
            establecimientos.map((colegio) => (
              <TableRow key={colegio.id}>
                <TableCell className="font-medium">{colegio.rbd}</TableCell>
                <TableCell>{colegio.nombre}</TableCell>
                <TableCell>{colegio.dependencia}</TableCell>
                <TableCell>{getComunaName(colegio.comuna_id)}</TableCell>
                <TableCell>{getCuposCount(colegio.id)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onManageCupos(colegio)}>
                    <Settings2 className="h-4 w-4" />
                    <span className="sr-only">Gestionar Cupos</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onEdit(colegio)}>
                    <FilePenLine className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el colegio
                          <span className="font-semibold"> {colegio.nombre}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteConfirmation(colegio.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}


// Main Page Component
export default function ColegiosPage() {
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

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      // Simulate fetching all related data
      setEstablecimientos(mockEstablecimientos);
      setFilteredEstablecimientos(mockEstablecimientos);
      setComunas(mockComunas);
      setCupos(mockCupos);
      setNivelesPractica(mockNivelesPractica);
      setCarreras(mockCarreras);
      setIsLoading(false);
    };
    fetchInitialData();
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
    await deleteEstablecimientoFromAPI(colegioId);
    setEstablecimientos(prev => prev.filter((c) => c.id !== colegioId));
  };

  const handleSubmitForm = async (data: ColegioFormValues) => {
    if (editingColegio) {
      const updated = await updateEstablecimientoInAPI({ ...data, id: editingColegio.id });
      setEstablecimientos(prev => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const newColegio = await addEstablecimientoToAPI(data);
      setEstablecimientos(prev => [...prev, newColegio]);
    }
  };

  const handleManageCupos = (establecimiento: Establecimiento) => {
    setManagingCuposFor(establecimiento);
    setIsCupoManagerOpen(true);
  };

  const handleAddCupo = async (data: { nivel_practica_id: string }) => {
    if (!managingCuposFor) return;
    const newCupo = await addCupoToAPI({ ...data, establecimiento_id: managingCuposFor.id });
    setCupos(prev => [...prev, newCupo]);
  };

  const handleDeleteCupo = async (cupoId: string) => {
    await deleteCupoFromAPI(cupoId);
    setCupos(prev => prev.filter(c => c.id !== cupoId));
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
