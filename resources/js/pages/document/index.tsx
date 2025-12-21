import CreateDocumentDialog from '@/components/create-document-dialog';
import { ActionsCell } from '@/components/table/action-cell';
import { FileActionsCell } from '@/components/table/file-action-cell';
import { Container } from '@/components/ui/container';
import type { Column } from '@/components/ui/table';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { convertTime } from '@/lib/utils';
import { dashboard } from '@/routes';
import documentsRoute from '@/routes/document';
import { type BreadcrumbItem, type Document, type SharedData } from '@/types';
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

type Query = {
    sort?: keyof Document;
    direction?: 'asc' | 'desc';
    filters?: Record<string, string>;
    page?: number;
    per_page?: number;
};


export default function Document({
    documents,
    query = {},
}: {
    documents: Paginated<Document>;
    query: Query;
}) {
    const columns: Column<Document>[] = [
        {
            header: 'Standar',
            key: 'standard',
            enableFilter: true,
            render: (row) => row.standard ?? '-',
        },
        {
            header: 'Klausul',
            key: 'clause',
            enableFilter: true,
            render: (row) => row.clause ?? '-',
        },
        {
            header: 'Jenis Dokumen',
            key: 'document_type',
            enableFilter: true,
            render: (row) => {
                const type = row.document_type ?? null;
                if (!type) return '-';
            
                return type === 'dokumen_lain'
                    ? 'Dokumen Lain'
                    : type.replace(/^\w/, (c) => c.toUpperCase());
            },
        },
        {
            header: 'Nama Dokumen',
            key: 'name',
            enableFilter: true,
        },
        {
            header: 'Pemilik Dokumen',
            key: 'document_owner',
            enableFilter: true,
            render: (row) => row.document_owner,
        },
        {
            header: 'File Dokumen',
            key: 'file_url',
            sortable: false,
            render: (row) => <FileActionsCell row={row} fileType='main' user={user}/>,
        },
        {
            header: 'Data Pendukung',
            key: 'supporting_file_url',
            sortable: false,
            render: (row) => row.supporting_file_path ? <FileActionsCell row={row} fileType='supporting' user={user}/> : "-",
        },
        {
            header: 'Link Aplikasi',
            key: 'application_link',
            sortable: false,
            render: (row) =>
                row.application_link ? (
                    <a
                        href={row.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Buka
                    </a>
                ) : (
                    'not found'
                ),
        },
        {
            header: 'Revisi',
            key: 'revision',
            render: (row) => row.revision ?? '-',
            width: 80,
        },
        {
            header: 'Tanggal Efektif',
            key: 'effective_date',
            render: (row) =>
                row.effective_date
                    ? convertTime(row.effective_date)
                    : 'Undefined',
            width: 120,
        },
    ];


    
    const {
        auth: { user },
    } = usePage<SharedData>().props;


    if (user?.role === "admin") {
        columns.push({
            header: "Aksi",
            key: "id",
            sortable: false,
            render: (row) => <ActionsCell row={row} user={user} />,
            width: 120,
        });
    }
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
                    {user?.role === 'admin' && <CreateDocumentDialog />}
                    <div className="h-2" />
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
