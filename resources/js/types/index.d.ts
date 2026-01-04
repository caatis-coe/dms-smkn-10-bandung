import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}
type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Query<T> = {
    sort?: keyof T;
    direction?: 'asc' | 'desc';
    filters?: Record<string, string>;
    page?: number;
    per_page?: number;
};
export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

type GroupOwner = {
    id: number;
    name: string;
};

type DocumentType = {
    id: number;
    name: string;
    documents_count? : number;
}

type BusinessProcess = {
    id: number;
    name: string;
    file_path: string;
};

type ProcessNode = {
    id: number;
    code: string;
    name: string;
    level: number;
    parent_id: number | null;
    children?: ProcessNode[];
    processes: BusinessProcess[];
};

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    email_verified_by_admin_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Document {
    id: number;
    code: string;
    // ISO / metadata
    standard?: string | null;
    clause?: string | null;
    document_type: DocumentType;
    status: 'aktif' | 'dicabut' | 'digantikan_oleh_dokumen_lain'

    // Core
    name: string;
    revision?: string | null;
    effective_date?: string | null;

    // Relations
    document_owner?: string;
    owner?: GroupOwner;
    published_by?: User;
    last_updated_by?: User;

    // Files
    file_path?: string | null;
    file_url: string;
    supporting_file_path?: string | null;
    supporting_file_url?: string | null;
    application_link?: string | null;

    // Timestamps
    created_at: string;
    updated_at: string;
}
