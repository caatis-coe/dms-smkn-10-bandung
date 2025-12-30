import { ActionsCell } from '@/pages/group-owner/partials/action-cell';
import { Container } from '@/components/ui/container';
import type { Column } from '@/components/ui/table';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import groupOwnerRoute from '@/routes/group-owner';
import type { BreadcrumbItem, Paginated, Query, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CreateGroupOwnerDialog from './partials/create-group-owner-dialog';

interface GroupOwner {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}



export default function GroupOwnerIndex({
    groupOwners,
    query = {},
}: {
    groupOwners: Paginated<GroupOwner>;
    query: Query<GroupOwner>;
}) {

    const groupOwnerName = usePage().props.group_owner_title_name as string;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: groupOwnerName,
            href: dashboard().url,
        },
    ];

    const columns: Column<GroupOwner>[] = [
        {
            header: 'Name',
            key: 'name',
            enableFilter: true,
            
        },
        {
            header: 'Aksi',
            key: 'id',
            render : (row) => (
                <ActionsCell row={row} groupOwnerName={groupOwnerName} />
            ),
            sortable: false,
            width: 20
        },
    ];

    const [queryState, setQueryState] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(groupOwnerRoute.index().url, queryState, {
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
                    <CreateGroupOwnerDialog groupOwnerName={groupOwnerName}/>
                    <div className="h-2" />
                    <Table
                        columns={columns}
                        data={groupOwners.data}
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
                        totalPages={groupOwners.last_page}
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
