
"use client";

import type { Directivo, Establecimiento } from "@/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2 } from "lucide-react";
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

interface DirectivoTableProps {
  directivos: Directivo[];
  establecimientos: Establecimiento[];
  onEdit: (directivo: Directivo) => void;
  onDelete: (directivoId: string) => Promise<void>;
}

export function DirectivoTable({ directivos, establecimientos, onEdit, onDelete }: DirectivoTableProps) {
  const { toast } = useToast();

  const getEstablecimientoName = (establecimientoId: string) => {
    return establecimientos.find(e => e.id === establecimientoId)?.nombre || "N/A";
  };
  
  const handleDeleteConfirmation = async (directivoId: string) => {
    try {
      await onDelete(directivoId);
      toast({
        title: "Directivo Eliminado",
        description: "El directivo ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el directivo.",
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
            <TableHead>Cargo</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Establecimiento</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directivos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No hay directivos registrados.
              </TableCell>
            </TableRow>
          ) : (
            directivos.map((directivo) => (
              <TableRow key={directivo.id}>
                <TableCell className="font-medium">{directivo.nombre}</TableCell>
                <TableCell>{directivo.cargo}</TableCell>
                <TableCell>{directivo.email}</TableCell>
                <TableCell>{getEstablecimientoName(directivo.establecimiento_id)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(directivo)}>
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
                          Esta acción no se puede deshacer. Esto eliminará permanentemente al directivo
                          <span className="font-semibold"> {directivo.nombre}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteConfirmation(directivo.id)}>
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
