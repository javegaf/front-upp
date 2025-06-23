
"use client";

import type { Tutor } from "@/lib/definitions";
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

interface TutorTableProps {
  tutores: Tutor[];
  onEdit: (tutor: Tutor) => void;
  onDelete: (tutorId: number) => Promise<void>;
}

export function TutorTable({ tutores, onEdit, onDelete }: TutorTableProps) {
  
  return (
    <div className="rounded-md border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tutores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center h-24">
                No hay tutores registrados.
              </TableCell>
            </TableRow>
          ) : (
            tutores.map((tutor) => (
              <TableRow key={tutor.id}>
                <TableCell className="font-medium">{tutor.nombre}</TableCell>
                <TableCell>{tutor.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(tutor)}>
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
                          Esta acción no se puede deshacer. Esto eliminará permanentemente al tutor
                          <span className="font-semibold"> {tutor.nombre}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(tutor.id)}>
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
