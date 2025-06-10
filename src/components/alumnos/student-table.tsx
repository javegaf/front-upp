"use client";

import type { Alumno } from "@/lib/definitions";
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

interface StudentTableProps {
  alumnos: Alumno[];
  onEdit: (alumno: Alumno) => void;
  onDelete: (alumnoId: string) => Promise<void>;
}

export function StudentTable({ alumnos, onEdit, onDelete }: StudentTableProps) {
  const { toast } = useToast();

  const handleDeleteConfirmation = async (alumnoId: string) => {
    try {
      await onDelete(alumnoId);
      toast({
        title: "Alumno Eliminado",
        description: "El alumno ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el alumno.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombres</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Carrera</TableHead>
            <TableHead className="text-center">Semestre</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alumnos.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No hay alumnos registrados.
              </TableCell>
            </TableRow>
          )}
          {alumnos.map((alumno) => (
            <TableRow key={alumno.id}>
              <TableCell className="font-medium">{alumno.nombres}</TableCell>
              <TableCell>{alumno.apellidos}</TableCell>
              <TableCell>{alumno.email}</TableCell>
              <TableCell>{alumno.carrera}</TableCell>
              <TableCell className="text-center">{alumno.semestre}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(alumno)}>
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
                        Esta acción no se puede deshacer. Esto eliminará permanentemente al alumno
                        <span className="font-semibold"> {alumno.nombres} {alumno.apellidos}</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteConfirmation(alumno.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
