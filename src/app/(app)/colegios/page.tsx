"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

export default function ColegiosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Colegios</h1>
          <p className="text-muted-foreground">Administra la información de los colegios y centros de práctica.</p>
        </div>
        <Button disabled className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Colegio (Próximamente)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Colegios</CardTitle>
          <CardDescription>
            Esta sección permitirá visualizar y gestionar los colegios asociados. Actualmente en desarrollo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center min-h-[300px]">
          <Image 
            src="https://placehold.co/600x300.png"
            alt="Coming soon illustration for school management"
            width={600}
            height={300}
            className="rounded-md object-contain opacity-50"
            data-ai-hint="school building"
          />
          <p className="mt-4 text-lg font-semibold text-muted-foreground">
            Funcionalidad de Gestión de Colegios Próximamente
          </p>
          <p className="text-sm text-muted-foreground">
            Estamos trabajando para traerte una completa herramienta de administración de colegios.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
