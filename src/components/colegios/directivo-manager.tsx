
"use client";

import type { Establecimiento, Directivo } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
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
import { FilePenLine, Trash2, PlusCircle } from "lucide-react";

interface DirectivoManagerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  establecimiento: Establecimiento;
  directivos: Directivo[];
  onAdd: () => void;
  onEdit: (directivo: Directivo) => void;
  onDelete: (directivoId: number) => Promise<void>;
}

export function DirectivoManager({
  isOpen,
  onOpenChange,
  establecimiento,
  directivos,
  onAdd,
  onEdit,
  onDelete,
}: DirectivoManagerProps) {
  if (!establecimiento) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card">
        <DialogHeader>
          <DialogTitle>Gestionar Directivos</DialogTitle>
          <DialogDescription>
            Administra los contactos para{" "}
            <span className="font-semibold">{establecimiento.nombre}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={onAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Directivo
            </Button>
          </div>
          <div className="rounded-md border max-h-80 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {directivos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No hay directivos para este establecimiento.
                    </TableCell>
                  </TableRow>
                ) : (
                  directivos.map((directivo) => (
                    <TableRow key={directivo.id}>
                      <TableCell className="font-medium">{directivo.nombre}</TableCell>
                      <TableCell>{directivo.cargo}</TableCell>
                      <TableCell>{directivo.email}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => onEdit(directivo)}>
                          <FilePenLine className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará permanentemente al directivo "{directivo.nombre}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(directivo.id)}>
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
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
