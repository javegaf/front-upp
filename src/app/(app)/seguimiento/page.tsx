"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function SeguimientoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Seguimiento de Prácticas</h1>
        <p className="text-muted-foreground">Monitorea el estado y progreso de las prácticas pedagógicas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de las Prácticas</CardTitle>
          <CardDescription>
            Visualiza el progreso de cada práctica asignada. Actualmente en desarrollo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center min-h-[300px]">
          <Image 
            src="https://placehold.co/600x300.png"
            alt="Coming soon illustration for tracking"
            width={600}
            height={300}
            className="rounded-md object-contain opacity-50"
            data-ai-hint="progress chart"
          />
          <p className="mt-4 text-lg font-semibold text-muted-foreground">
            Funcionalidad de Seguimiento de Prácticas Próximamente
          </p>
          <p className="text-sm text-muted-foreground">
            En breve podrás hacer un seguimiento detallado del estado de las prácticas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
