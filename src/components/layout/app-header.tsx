"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { APP_LOGO_ICON, APP_NAME } from "@/lib/constants";
import { UserCircle } from "lucide-react";
import Link from 'next/link';

export function AppHeader() {
  const Logo = APP_LOGO_ICON;
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              {APP_NAME}
            </span>
          </Link>
        </div>

        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden">
           <SidebarTrigger />
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Can add ThemeToggle or other actions here */}
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">User Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
