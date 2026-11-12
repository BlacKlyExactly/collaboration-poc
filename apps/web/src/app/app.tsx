import { Route, Routes } from 'react-router-dom';
import { Home } from '../pages/home';
import { Document } from '../pages/document';
import { SidebarProvider, SidebarInset, Spinner } from '@notes-app/ui';
import { AppSidebar } from '../components/app-sidebar';
import { useLogout } from '../mutations/use-logout';
import { useAuth } from '../queries/use-auth';

export default function App() {
  const { isLoading } = useAuth();
  const { mutate } = useLogout();

  if (isLoading)
    return (
      <SidebarProvider>
        <AppSidebar onLogout={() => mutate()} />
        <SidebarInset>
          <Spinner className="m-4 w-8 h-8" />
        </SidebarInset>
      </SidebarProvider>
    );

  return (
    <div className="bg-background w-full h-screen typeset typeset-app">
      <SidebarProvider>
        <AppSidebar onLogout={() => mutate()} />
        <SidebarInset className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<Document />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
