
"use client";

import type { Estudiante, Carrera } from "@/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Eye } from "lucide-react";
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

interface StudentTableProps {
  estudiantes: Estudiante[];
  carreras: Carrera[];
  onEdit: (estudiante: Estudiante) => void;
  onDelete: (estudianteId: number) => Promise<void>;
  onViewDetails: (estudiante: Estudiante) => void;
}

export function StudentTable({ estudiantes, carreras, onEdit, onDelete, onViewDetails }: StudentTableProps) {

  const getCarreraName = (carreraId: number) => {
    return carreras.find(c => c.id === carreraId)?.nombre || "Desconocida";
  };

  return (
    <div className="rounded-md border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RUT</TableHead>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Carrera</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estudiantes.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No hay estudiantes registrados o que coincidan con la búsqueda.
              </TableCell>
            </TableRow>
          )}
          {estudiantes.map((estudiante) => (
            <TableRow key={estudiante.id}>
              <TableCell className="font-medium">{estudiante.rut}</TableCell>
              <TableCell>{`${estudiante.nombre} ${estudiante.ap_paterno} ${estudiante.ap_materno}`}</TableCell>
              <TableCell>{estudiante.email}</TableCell>
              <TableCell>{getCarreraName(estudiante.carrera_id)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" onClick={() => onViewDetails(estudiante)} title="Ver Detalles">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Ver detalles</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => onEdit(estudiante)} title="Editar">
                  <FilePenLine className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" title="Eliminar">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente al estudiante
                        <span className="font-semibold"> {estudiante.nombre} {estudiante.ap_paterno}</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(estudiante.id)}>
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
