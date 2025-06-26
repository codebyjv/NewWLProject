import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Bell,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Estoque",
    url: createPageUrl("Estoque"),
    icon: Package,
  },
  {
    title: "Pedidos",
    url: createPageUrl("Pedidos"),
    icon: ShoppingCart,
  },
  {
    title: "Cadastros",
    url: createPageUrl("Cadastros"),
    icon: Users,
  },
];

export default function Layout({ children, currentPageName }: LayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          :root {
            --primary: #DC2626;
            --primary-foreground: #FFFFFF;
            --secondary: #6B7280;
            --secondary-foreground: #111827;
            --accent: #F3F4F6;
            --accent-foreground: #111827;
            --destructive: #EF4444;
            --destructive-foreground: #FFFFFF;
            --border: #E5E7EB;
            --input: #E5E7EB;
            --ring: #DC2626;
            --background: #FFFFFF;
            --foreground: #111827;
            --card: #FFFFFF;
            --card-foreground: #111827;
            --popover: #FFFFFF;
            --popover-foreground: #111827;
            --muted: #F9FAFB;
            --muted-foreground: #6B7280;
            --radius: 0.75rem;
          }
        `}
      </style>
      
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar className="border-r border-gray-200 bg-white">
            <SidebarHeader className="border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">WL Pesos Padrão</h2>
                  <p className="text-xs text-gray-500">Sistema de Gestão</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  Menu Principal
                </SidebarGroupLabel>
                <SidebarContent>
                  <SidebarMenu className="space-y-1">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`rounded-lg transition-all duration-200 ${
                            location.pathname === item.url 
                              ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm' 
                              : 'hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarContent>
              </SidebarGroup>

              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  Alertas
                </SidebarGroupLabel>
                <SidebarContent>
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <Bell className="w-4 h-4 text-amber-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-800">Estoque Baixo</p>
                        <p className="text-xs text-amber-600">Verificar itens</p>
                      </div>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        !
                      </Badge>
                    </div>
                  </div>
                </SidebarContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium text-sm">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">Usuário</p>
                  <p className="text-xs text-gray-500 truncate">Sistema de Gestão</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col min-h-screen">
            {/* Header mobile */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
                  <h1 className="text-xl font-bold text-gray-900">StockMaster</h1>
                </div>
              </div>
            </header>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}