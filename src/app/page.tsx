import { Button } from "@/components/ui/button";
import { APP_LOGO_ICON, APP_NAME } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const Logo = APP_LOGO_ICON;
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <Logo className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-semibold font-headline">{APP_NAME}</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Ingresar</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    {APP_NAME}
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Simplifica la gestión de prácticas pedagógicas. Conecta alumnos, colegios y universidad de forma eficiente.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="font-body">
                    <Link href="/dashboard">
                      Acceder al Sistema
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Hero Image"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="education collaboration"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-body">
                  Características Principales
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Todo lo que necesitas en un solo lugar</h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Desde la inscripción de alumnos hasta el seguimiento detallado de cada práctica, {APP_NAME} te ofrece las herramientas para optimizar tu flujo de trabajo.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm">
                <h3 className="text-lg font-bold font-headline text-accent">Gestión de Alumnos</h3>
                <p className="text-sm text-foreground/80">
                  Registra y actualiza fácilmente la información de los estudiantes.
                </p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm">
                <h3 className="text-lg font-bold font-headline text-accent">Gestión de Colegios</h3>
                <p className="text-sm text-foreground/80">
                  Mantén un directorio completo de los centros de práctica disponibles.
                </p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm">
                <h3 className="text-lg font-bold font-headline text-accent">Asignación Inteligente</h3>
                <p className="text-sm text-foreground/80">
                  Asigna alumnos a colegios de manera rápida y sencilla.
                </p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm">
                <h3 className="text-lg font-bold font-headline text-accent">Seguimiento en Tiempo Real</h3>
                <p className="text-sm text-foreground/80">
                  Visualiza el estado de cada práctica pedagógica al instante.
                </p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm">
                <h3 className="text-lg font-bold font-headline text-accent">Comunicación Automatizada</h3>
                <p className="text-sm text-foreground/80">
                  Envía correos electrónicos automáticos a alumnos y colegios.
                </p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm">
                <h3 className="text-lg font-bold font-headline text-accent">Reportes y Analíticas</h3>
                <p className="text-sm text-foreground/80">
                  Genera informes para una mejor toma de decisiones (Próximamente).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-foreground/70">&copy; {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-foreground/70">
            Términos de Servicio
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-foreground/70">
            Política de Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
