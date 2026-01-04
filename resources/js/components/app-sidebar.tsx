import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FileText, BriefcaseBusiness, Group, UserRoundCog, FileType } from 'lucide-react';
import AppLogo from './app-logo';
import document from '@/routes/document';
import AppearanceTabs from '@/components/appearance-tabs';
import businessProcess from '@/routes/business-process';
import user from '@/routes/user';
import groupOwner from '@/routes/group-owner';
import documentType from '@/routes/document-type';

const mainNavItems: NavItem[] = [
    {
        title: 'Dokumen',
        href: document.index().url,
        icon: FileText
    },
];

const mainNavAuthItems: NavItem[] = [
    {
        title: 'Proses Bisnis',
        href: businessProcess.index().url,
        icon: BriefcaseBusiness,
    }
];


// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {

    const groupOwnerName =  usePage().props.group_owner_title_name as string;

    const adminNavItems: NavItem[] = [
        {
            title: groupOwnerName,
            href: groupOwner.index().url,
            icon: Group,
        },
        {
            title: 'Akun',
            href: user.index().url,
            icon: UserRoundCog,
        },
        {
            title: 'Jenis Dokumen',
            href: documentType.index().url,
            icon: FileType,
        }
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} authItems={mainNavAuthItems} adminItems={adminNavItems}/>
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <AppearanceTabs />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
