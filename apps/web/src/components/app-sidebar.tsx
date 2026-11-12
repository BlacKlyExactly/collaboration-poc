import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronsUpDown,
  FileText,
  Home,
  LogOut,
  NotebookPen,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Spinner,
  useSidebar,
} from '@notes-app/ui';
import { useAuth } from '../queries/use-auth';
import { useMemo } from 'react';
import { useUserDocuments } from '../queries/use-user-documents';

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function UserInfo() {
  const { data, isLoading } = useAuth();
  if (!data) return null;

  if (isLoading) return <Spinner />;

  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className="rounded-lg">
          {initials(data.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{data.name}</span>
        <span className="truncate text-xs">{data.email}</span>
      </div>
    </>
  );
}

export function AppSidebar({ onLogout = () => {} }: { onLogout?: () => void }) {
  const { pathname } = useLocation();
  const { isMobile } = useSidebar();
  const userQuery = useAuth();
  const userDocumentsQuery = useUserDocuments();

  const sidebarNotes = useMemo(() => {
    const documents = userDocumentsQuery.data?.items;
    const isLoading = userDocumentsQuery.isLoading;

    if (isLoading)
      return (
        <SidebarMenuItem>
          <Spinner />
        </SidebarMenuItem>
      );

    if (!documents?.length) return <SidebarMenuItem>No notes</SidebarMenuItem>;

    return documents.map((document) => (
      <SidebarMenuItem key={document.id}>
        <SidebarMenuButton
          isActive={pathname === `/${document.id}`}
          render={<NavLink to={`/${document.id}`} />}
        >
          <FileText />
          <span>{document.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  }, [userDocumentsQuery.data?.items, userDocumentsQuery.isLoading]);

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<NavLink to="/" />}>
              <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <NotebookPen className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Notes</span>
                <span className="truncate text-xs">Personal workspace</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === '/'}
                  render={<NavLink to="/" />}
                >
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{sidebarNotes}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {userQuery.isLoading ? (
              <Spinner />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <UserInfo />
                  <ChevronsUpDown className="ml-auto size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--anchor-width) min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <UserInfo />
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
