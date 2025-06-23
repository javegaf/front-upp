
"use client";

import type { Carrera, NivelPractica } from "@/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Settings2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";

interface CarreraTableProps {
  carreras: Carrera[];
  nivelesPractica: NivelPractica[];
  onEdit: (carrera: Carrera) => void;
  onDelete: (carreraId: string) => Promise<void>;
  onManageNiveles: (carrera: Carrera) => void;
}

export function CarreraTable({ carreras, nivelesPractica, onEdit, onDelete, onManageNiveles }: CarreraTableProps) {
  const { toast } = useToast();
  
  const getNivelesCount = (carreraId: string) => {
    return nivelesPractica.filter(n => n.carrera_id === carreraId).length;
  };
  
  const handleDeleteConfirmation = async (carreraId: string) => {
    try {
      await onDelete(carreraId);
      toast({
        title: "Carrera Eliminada",
        description: "La carrera ha sido eliminada exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la carrera.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Niveles de Práctica</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carreras.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center h-24">
                No hay carreras registradas.
              </TableCell>
            </TableRow>
          ) : (
            carreras.map((carrera) => (
              <TableRow key={carrera.id}>
                <TableCell className="font-medium">{carrera.nombre}</TableCell>
                <TableCell>{getNivelesCount(carrera.id)}</TableCell>
                <TableCell className="text-right space-x-2">
                   <Button variant="outline" size="icon" onClick={() => onManageNiveles(carrera)} title="Gestionar Niveles de Práctica">
                    <Settings2 className="h-4 w-4" />
                    <span className="sr-only">Gestionar Niveles</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onEdit(carrera)} title="Editar Carrera">
                    <FilePenLine className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" title="Eliminar Carrera">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente la carrera
                          <span className="font-semibold"> {carrera.nombre}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteConfirmation(carrera.id)}>
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
