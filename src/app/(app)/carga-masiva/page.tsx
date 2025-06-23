
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileSpreadsheet, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
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

export default function CargaMasivaPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Basic validation for Excel files
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel" || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Archivo no válido",
          description: "Por favor, selecciona un archivo de Excel (.xlsx o .xls).",
          variant: "destructive",
        });
        setSelectedFile(null);
        event.target.value = ""; // Clear the input
      }
    } else {
        setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
       toast({
        title: "No se ha seleccionado un archivo",
        description: "Por favor, selecciona un archivo para subir.",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);

    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsUploading(false);
    toast({
      title: "Carga Exitosa (Simulación)",
      description: `El archivo "${selectedFile.name}" ha sido subido. El procesamiento de archivos reales está en desarrollo.`,
    });
    setSelectedFile(null);
    const input = document.getElementById('excel-upload') as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleClearDatabase = () => {
    // In a real app, this would be a server action that clears the database.
    // For now, we just show a toast.
    toast({
      title: "Base de Datos Vaciada (Simulación)",
      description: "Todos los datos han sido eliminados del sistema.",
    });
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Carga Masiva de Datos</h1>
        <p className="text-muted-foreground">
          Sube archivos de Excel para registrar estudiantes, colegios o asignaciones de forma masiva.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subir Archivo Excel</CardTitle>
          <CardDescription>
            Selecciona el archivo de Excel que deseas procesar. Asegúrate de que siga la plantilla y el formato correctos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Label htmlFor="excel-upload" className="block w-full cursor-pointer">
              <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg border-muted hover:border-primary transition-colors">
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Arrastra y suelta un archivo o haz clic para seleccionarlo</h3>
                <p className="text-sm text-muted-foreground">Soportados: .xlsx, .xls</p>
                <Input 
                  id="excel-upload"
                  type="file" 
                  className="sr-only" 
                  accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                 <Button asChild variant="outline" className="mt-4 pointer-events-none">
                    <span>Seleccionar Archivo</span>
                 </Button>
              </div>
            </Label>
          
          {selectedFile && (
            <div className="p-4 rounded-md bg-muted/50">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-6 h-6 text-primary"/>
                <div>
                  <p className="font-semibold text-card-foreground">Archivo seleccionado:</p>
                  <p className="text-sm text-muted-foreground">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
              {isUploading ? "Subiendo..." : "Iniciar Carga"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle />
            Zona Peligrosa
          </CardTitle>
          <CardDescription>
            Las siguientes acciones son irreversibles. Por favor, procede con precaución.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-md bg-destructive/5 gap-4">
            <div>
              <h4 className="font-semibold">Vaciar Base de Datos</h4>
              <p className="text-sm text-muted-foreground">
                Esta acción eliminará permanentemente todos los datos, incluyendo alumnos, colegios y asignaciones.
              </p>
            </div>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Vaciar Base de Datos
                 </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminarán permanentemente todos los datos de la base de datos.
                    Toda la información de alumnos, colegios, asignaciones y configuraciones se perderá para siempre.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearDatabase}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Sí, vaciar todo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
