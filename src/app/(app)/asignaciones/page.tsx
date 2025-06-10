"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardPlus } from "lucide-react";
import Image from "next/image";

export default function AsignacionesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Asignación de Prácticas</h1>
          <p className="text-muted-foreground">Asigna alumnos a colegios para sus prácticas pedagógicas.</p>
        </div>
        <Button disabled className="w-full sm:w-auto">
          <ClipboardPlus className="mr-2 h-4 w-4" />
          Nueva Asignación (Próximamente)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prácticas Asignadas</CardTitle>
          <CardDescription>
            Visualiza y gestiona las asignaciones de prácticas. Actualmente en desarrollo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center min-h-[300px]">
           <Image 
            src="https://placehold.co/600x300.png"
            alt="Coming soon illustration for assignments"
            width={600}
            height={300}
            className="rounded-md object-contain opacity-50"
            data-ai-hint="planning schedule"
          />
          <p className="mt-4 text-lg font-semibold text-muted-foreground">
            Funcionalidad de Asignación de Prácticas Próximamente
          </p>
          <p className="text-sm text-muted-foreground">
            Pronto podrás asignar alumnos a colegios y gestionar el proceso de prácticas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
