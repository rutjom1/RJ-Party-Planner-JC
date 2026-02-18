'use client';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { useUser } from "@/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AuthCheck>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
            <FirebaseErrorListener />
          </SidebarInset>
        </SidebarProvider>
      </AuthCheck>
    </FirebaseClientProvider>
  );
}

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
          <p className="text-destructive">Error loading user: {error.message}</p>
      </div>
    )
  }

  return <>{children}</>;
}
