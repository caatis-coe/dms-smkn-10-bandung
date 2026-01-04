import { ActionsCell } from './partials/action-cell';
import { Container } from '@/components/ui/container';
import type { Column } from '@/components/ui/table';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import documentTypeRoute from '@/routes/document-type';
import type { BreadcrumbItem, DocumentType, Paginated, Query } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CreateDocumentTypeDialog from './partials/create-document-type-dialog';

export default function DocumentTypeIndex({
    documentTypes,
    query = {},
}: {
    documentTypes: Paginated<DocumentType>;
    query: Query<DocumentType>;
}) {

    

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Jenis Dokumen",
            href: dashboard().url,
        },
    ];

    const columns: Column<DocumentType>[] = [
        {
            header: 'Nama',
            key: 'name',
            enableFilter: true,
            filterClassName: "w-1/2"
        },
        {
            header: 'Aksi',
            key: 'id',
            render : (row) => (
                <ActionsCell row={row}/>
            ),
            sortable: false,
            width: 40
        },
    ];

    const [queryState, setQueryState] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(documentTypeRoute.index().url, queryState, {
                replace: true,
                preserveScroll: true,
                preserveState: true,
            });
        }, 150);

        return () => clearTimeout(timeout);
    }, [queryState]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group Owners" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Container>
                    <div className='flex items-center mb-4'>
                        <CreateDocumentTypeDialog/>
                    </div>
                    <div className="h-2" />
                    <Table
                        columns={columns}
                        data={documentTypes.data}
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
                        totalPages={documentTypes.last_page}
                        perPage={queryState.per_page}
                        onPageChange={(p) => {
                            setQueryState((prev) => ({
                                ...prev,
                                page: p,
                            }));
                        }}
                        /* PAGE SIZE */
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
