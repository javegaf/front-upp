"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function AsignacionesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Página Eliminada</h1>
        <p className="text-muted-foreground">Esta sección ha sido eliminada.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contenido no disponible</CardTitle>
          <CardDescription>
            La funcionalidad de asignaciones ha sido removida de la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center min-h-[300px]">
           <Construction className="h-16 w-16 text-muted-foreground opacity-50" />
          <p className="mt-4 text-lg font-semibold text-muted-foreground">
            Sección en reconstrucción o eliminada.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
