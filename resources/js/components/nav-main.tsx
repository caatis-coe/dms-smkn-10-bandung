import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { SharedData, User, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';


export function NavMain({
    items = [],
    authItems = [],
    adminItems = [],
}: {
    items: NavItem[];
    authItems: NavItem[];
    adminItems: NavItem[];
}) {
    const page = usePage()
    const { auth } = usePage<SharedData>().props;

    const currentPath = page.url.split('?')[0];

    const isActive = (item : NavItem) => {
        return currentPath === resolveUrl(item.href) ||
        currentPath.startsWith(resolveUrl(item.href) + '/');
    }

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem   key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive(item)}
                            
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                {authItems.map((item) => (
                    <SidebarMenuItem title='Login Required' className={`${!auth.user.email_verified_by_admin_at ? "pointer-events-none opacity-40" : ""}`} key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive(item)}
                            
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            {auth.user?.role === 'admin' && auth.user.email_verified_by_admin_at && (
                <>
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                    <SidebarMenu>
                        {adminItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(item)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </>
            )}
        </SidebarGroup>
    );
}
