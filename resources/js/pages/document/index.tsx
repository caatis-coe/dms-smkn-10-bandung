import CreateDocumentDialog from '@/pages/document/partials/create-document-dialog';
import { StatsCarousel } from '@/components/stats-carousel';
import { ActionsCell } from '@/pages/document/partials/action-cell';
import { FileActionsCell } from '@/pages/document/partials/file-action-cell';
import { Container } from '@/components/ui/container';
import type { Column } from '@/components/ui/table';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { convertTime } from '@/lib/utils';
import { dashboard } from '@/routes';
import documentsRoute from '@/routes/document';
import { GroupOwner, Paginated, Query, type BreadcrumbItem, type Document, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document',
        href: dashboard().url,
    },
];




export default function Document({
    documents,
    query = {},
    documentsCount,
    groupOwnerCount,
    groupOwnerDocumentCount,
}: {
    documents: Paginated<Document>;
    query: Query<Document>;
    documentsCount: number;
    groupOwnerCount: number;
    groupOwnerDocumentCount: {
        name: string,
        documents_count: number
    }[] | null;
}) {

    const columns: Column<Document>[] = [
        {
            header: 'Nomor Dokumen',
            key: 'code',
            enableFilter: true,
        },
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
            filterType: 'dropdown',
            filterOptions: [
                { label: 'Prosedur', value: 'prosedur' },
                { label: 'Instruksi', value: 'instruksi' },
                { label: 'Dokumen Lain', value: 'dokumen_lain' },
            ],
            width: 120,
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
            filterType: 'dropdown',
            filterOptions: (usePage().props.group_owners as GroupOwner[]).map((owner) => ({
                label: owner.name,
                value: owner.name,
            })),
            render: (row) => row?.owner?.name ?? <div className="text-foreground/20">-</div>,
        },
        {
            header: 'File Dokumen',
            key: 'file_url',
            sortable: false,
            render: (row) => (
                <FileActionsCell row={row} fileType="main" user={user} />
            ),
            width: 80,
        },
        {
            header: 'Data Pendukung',
            key: 'supporting_file_url',
            sortable: false,
            render: (row) =>
                row.supporting_file_path ? (
                    <FileActionsCell
                        row={row}
                        fileType="supporting"
                        user={user}
                    />
                ) : (
                    <div className="text-foreground/20">-</div>
                ),
            width: 80,
        },
        {
            header: 'Link Aplikasi',
            key: 'application_link',
            sortable: false,
            render: (row) =>
                row.application_link ? (
                    <div className="w-fit cursor-pointer rounded p-1 transition hover:bg-foreground/5">
                        <a
                            href={row.application_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title='Tautan Dokumen'
                        >
                            <ExternalLink className="h-4 w-4 text-icon-external-link" />
                        </a>
                    </div>
                ) : (
                    <div className="text-foreground/20">-</div>
                ),
            width: 80,
        },
        {
            header: 'Revisi',
            key: 'revision',
            render: (row) =>
                row.revision ?? <div className="text-foreground/20">-</div>,
            width: 64,
        },
        {
            header: 'Tanggal Efektif',
            key: 'effective_date',
            render: (row) =>
                row.effective_date ? (
                    convertTime(row.effective_date, 'Asia/Jakarta', {
                        hour: undefined,
                        minute: undefined,
                    })
                ) : (
                    <div className="text-foreground/20">-</div>
                ),
            width: 120,
            enableFilter: true,
        },
    ];

    const {
        auth: { user },
    } = usePage<SharedData>().props;

    if (user?.role === 'admin') {
        columns.push({
            header: 'Aksi',
            key: 'id',
            sortable: false,
            render: (row) => <ActionsCell row={row} user={user} />,
            width: 80,
        });
    }
    const groupOwnerName = usePage().props.group_owner_title_name as string;
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
                <Container className='max-h-42 min-h-56 flex items-center group !py-7'>
                    <StatsCarousel documentsCount={documentsCount} groupOwnerName={groupOwnerName} groupOwnerCount={groupOwnerCount} groupOwnerDocumentCount={groupOwnerDocumentCount} />
                </Container>
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
