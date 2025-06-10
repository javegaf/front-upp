"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NAV_ITEMS, APP_NAME, APP_LOGO_ICON } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const Logo = APP_LOGO_ICON;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold font-headline group-data-[collapsible=icon]:hidden">
            {APP_NAME}
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                className={cn(
                  "justify-start",
                  pathname.startsWith(item.href) && "bg-primary/10 text-primary hover:text-primary"
                )}
                tooltip={{ children: item.label, side: "right", className: "font-body" }}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5 shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
          <LogOut className="mr-3 h-5 w-5 group-data-[collapsible=icon]:mr-0" />
          <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
