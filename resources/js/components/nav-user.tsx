import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown, LogIn, UserPlus } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const collapsed = state === 'collapsed';
    const user = auth.user;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {!user ? (
                    <div
                        className={cn(
                            'flex gap-2 p-2',
                            collapsed ? 'flex-col items-center' : 'flex-col',
                        )}
                    >
                        <Link href="/login">
                            <Button
                                variant="outline"
                                title="Log In"
                                className={cn(
                                    collapsed
                                        ? 'h-9 w-9 p-0'
                                        : 'w-full justify-center',
                                )}
                            >
                                <LogIn className="h-4 w-4" />
                                {!collapsed && (
                                    <span className="ml-2">Log In</span>
                                )}
                            </Button>
                        </Link>

                        <Link href="/register">
                            <Button
                                variant="default"
                                title="Register"
                                className={cn(
                                    collapsed
                                        ? 'h-9 w-9 p-0'
                                        : 'w-full justify-center',
                                )}
                            >
                                <UserPlus className="h-4 w-4" />
                                {!collapsed && (
                                    <span className="ml-2">Register</span>
                                )}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* 🟩 LOGGED IN → Show user dropdown */
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                                data-test="sidebar-menu-button"
                            >
                                <UserInfo user={user} />
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            align="end"
                            side={
                                isMobile
                                    ? 'bottom'
                                    : state === 'collapsed'
                                      ? 'left'
                                      : 'bottom'
                            }
                        >
                            <UserMenuContent user={user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
