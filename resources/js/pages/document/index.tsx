import CreateDocumentDialog from '@/components/create-document-dialog';
import { ActionsCell } from '@/components/table/action-cell';
import { Container } from '@/components/ui/container';
import type { Column } from '@/components/ui/table';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { convertTime } from '@/lib/utils';
import { dashboard } from '@/routes';
import documentsRoute from '@/routes/documents';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document',
        href: dashboard().url,
    },
];

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export interface DocumentItem {
    id: string;
    name: string;
    file_path: string;
    file_url: string;
    published_by?: User;
    last_updated_by?: User;
    created_at: string;
    updated_at: string;
}

type Query = {
    sort?: keyof DocumentItem;
    direction?: 'asc' | 'desc';
    filters?: Record<string, string>;
    page?: number;
    per_page?: number;
};

export default function Document({
    documents,
    query = {},
}: {
    documents: Paginated<DocumentItem>;
    query: Query;
}) {
    const columns: Column<DocumentItem>[] = [
        {
            header: 'Nomor Dokumen',
            key: 'id',
            enableFilter: true,
        },
        {
            header: 'Nama Dokumen',
            key: 'name',
            enableFilter: true,
        },
        {
            header: 'Dibuat Oleh',
            key: 'published_by',
            render: (row) => row.published_by?.name ?? '-',
            enableFilter: true,
        },
        {
            header: 'Dibuat',
            key: 'created_at',
            render: (row) => convertTime(row.created_at),
            width: 100,
        },
        {
            header: 'Terakhir Diperbaharui Oleh',
            key: 'last_updated_by',
            render: (row) => row.last_updated_by?.name ?? '-',
            enableFilter: true,
            width: 160,
        },
        {
            header: 'Terakhir Diperbaharui',
            key: 'updated_at',
            render: (row) => convertTime(row.updated_at),
            width: 100,
        },
        {
            header: 'Aksi',
            key: 'id',
            sortable: false,
            render: (row) => <ActionsCell row={row} user={user} />,
        },
    ];
    const {
        auth: { user },
    } = usePage<SharedData>().props;
    const [queryState, setQueryState] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(documentsRoute.index().url, queryState, {
                replace: true,
                preserveScroll: true,
                preserveState: true,
            });
        }, 150);

        return () => clearTimeout(timeout);
    }, [queryState]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Container>
                    {user?.role === 'admin' && <CreateDocumentDialog/>}
                    <div className='h-2'/>
                    <Table
                        columns={columns}
                        data={documents.data}
                        /* SORTING */
                        sortKey={queryState.sort}
                        sortDirection={queryState.direction}
                        onSort={(key, direction) => {
                            setQueryState((prev) => ({
                                ...prev,
                                sort: key,
                                direction,
                                page: 1,
                            }));
                        }}
                        /* FILTERING */
                        filters={queryState.filters}
                        onFilterChange={(key, value) => {
                            setQueryState((prev) => ({
                                ...prev,
                                filters: {
                                    ...prev.filters,
                                    [key]: value,
                                },
                                page: 1,
                            }));
                        }}
                        /* PAGINATION */
                        page={queryState.page}
                        totalPages={documents.last_page}
                        perPage={queryState.per_page}
                        onPageChange={(p) => {
                            setQueryState((prev) => ({
                                ...prev,
                                page: p,
                            }));
                        }}
                        /* PAGE SIZE SELECTOR */
                        onPageSizeChange={(size) => {
                            setQueryState((prev) => ({
                                ...prev,
                                per_page: size,
                                page: 1,
                            }));
                        }}
                    />
                </Container>
            </div>
        </AppLayout>
    );
}
