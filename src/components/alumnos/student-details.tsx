
"use client";

import type { Estudiante, Carrera, Comuna, Tutor } from "@/lib/definitions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, BookUser, University, MapPin, NotebookPen, Sparkles } from "lucide-react";

interface StudentDetailsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  student: Estudiante | null;
  carreras: Carrera[];
  comunas: Comuna[];
  tutores: Tutor[];
}

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4 py-2">
            <div className="flex-shrink-0 w-8 text-center">
                <Icon className="h-5 w-5 text-muted-foreground inline-block" />
            </div>
            <div>
                <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                <p className="text-base text-foreground">{value}</p>
            </div>
        </div>
    );
};


export function StudentDetails({ isOpen, onOpenChange, student, carreras, comunas, tutores }: StudentDetailsProps) {
  if (!student) return null;

  const getCarreraName = (id: number) => carreras.find(c => c.id === id)?.nombre || "N/A";
  const getComunaName = (id: number) => comunas.find(c => c.id === id)?.nombre || "N/A";
  const getTutorName = (id: number | null) => tutores.find(t => t.id === id)?.nombre || "No asignado";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">Detalles del Estudiante</DialogTitle>
          <DialogDescription>
            Información completa de {student.nombre} {student.ap_paterno}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 py-4">
            <DetailRow
                icon={User}
                label="Nombre Completo"
                value={`${student.nombre} ${student.ap_paterno} ${student.ap_materno}`}
            />
             <DetailRow
                icon={NotebookPen}
                label="RUT"
                value={student.rut}
            />
             <DetailRow
                icon={User}
                label="Email"
                value={student.email}
            />
            <DetailRow
                icon={University}
                label="Carrera"
                value={getCarreraName(student.carrera_id)}
            />
            <DetailRow
                icon={MapPin}
                label="Comuna"
                value={getComunaName(student.comuna_id)}
            />
            <DetailRow
                icon={BookUser}
                label="Tutor Académico"
                value={getTutorName(student.tutor_id)}
            />
            {student.cond_especial && (
                 <DetailRow
                    icon={Sparkles}
                    label="Condición Especial"
                    value={student.cond_especial}
                />
            )}
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
