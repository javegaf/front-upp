
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <p className="text-muted-foreground">
        Bienvenido a {process.env.NEXT_PUBLIC_APP_NAME || "Gestión de prácticas"}. Accede a las herramientas de configuración.
      </p>
      
      <Card className="max-w-lg">
          <CardHeader>
              <CardTitle className="font-headline">Configuración y Herramientas</CardTitle>
              <CardDescription>Gestiona plantillas, realiza cargas masivas y otros ajustes del sistema.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
              <Link href="/plantillas" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                          <h3 className="font-semibold">Editor de Plantillas de Correo</h3>
                          <p className="text-sm text-muted-foreground mt-1">Modifica los correos que se envían a establecimientos y estudiantes.</p>
                      </div>
                  </div>
              </Link>
               <Link href="/carga-masiva" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                      <Upload className="h-6 w-6 text-primary" />
                      <div>
                          <h3 className="font-semibold">Carga Masiva de Datos</h3>
                          <p className="text-sm text-muted-foreground mt-1">Sube archivos Excel para añadir estudiantes, colegios y más.</p>
                      </div>
                  </div>
              </Link>
          </CardContent>
      </Card>
    </div>
  );
}
