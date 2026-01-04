import UserController from '@/actions/App/Http/Controllers/UserController';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import type { Column } from '@/components/ui/table';
import { Table } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import userRoute from '@/routes/user';
import type { BreadcrumbItem, Paginated, Query, User } from '@/types';
import { Form, Head, router } from '@inertiajs/react';
import { BadgeCheck, BadgeX, User as UserIcon, UserStar } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Akun',
        href: dashboard().url,
    },
];

export default function UserIndex({
    users,
    query = {},
}: {
    users: Paginated<User>;
    query: Query<User>;
}) {
    const columns: Column<User>[] = [
        {
            header: 'Nama',
            key: 'name',
            enableFilter: true,
            width: 160,
        },
        {
            header: 'Email',
            key: 'email',
            enableFilter: true,
            width: 160,
        },
        {
            header: 'Role',
            key: 'role',
            enableFilter: true,
            filterType: 'dropdown',
            filterOptions: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
            ],
            render: (row) => (
                <div className="flex items-center justify-between">
                    {row.role === 'admin' ? 'Admin' : 'User'}
                    <div>
                        <Form
                            {...UserController.updateRole.form({
                                user: row.id,
                            })}
                            method="put"
                            title={
                                row.role !== 'admin'
                                    ? 'Promote to Admin'
                                    : 'Demote to User'
                            }
                        >
                            <button className="cursor-pointer rounded p-1 transition hover:bg-foreground/5" type="submit" >
                                {row.role !== 'admin' ? (
                                    <>
                                        <input
                                            type="hidden"
                                            defaultValue={'admin'}
                                            name="role"
                                        />

                                        <UserStar
                                            type="submit"
                                            className="h-4 w-4 text-icon-edit"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="hidden"
                                            defaultValue={'user'}
                                            name="role"
                                        />
                                        <UserIcon
                                            type="submit"
                                            className="h-4 w-4 text-icon-delete"
                                        />
                                    </>
                                )}
                            </button>
                        </Form>
                    </div>
                </div>
            ),
            width: 60,
        },
        {
            header: 'Email Verified',
            key: 'email_verified_by_admin_at',
            render: (row) => (
                <div className="flex items-center justify-between">
                    {
                        row.email_verified_by_admin_at ? (
                            <span className="text-icon-download">Verified</span>
                        ) : (
                            <span className="text-icon-delete">Unverified</span>
                        )
                    }
                    <div>
                        <Form
                            {...UserController.verify.form({
                                user: row.id,
                            })}
                            method="put"
                            title={
                                row.email_verified_by_admin_at
                                    ? 'Verify'
                                    : 'Deverify'
                            }
                        >
                            <button className="cursor-pointer rounded p-1 transition hover:bg-foreground/5" type="submit" >
                                {!row.email_verified_by_admin_at ? (
                                    <>
                                        <input
                                            type="hidden"
                                            defaultValue={1}
                                            name="verify"
                                        />
                                        <BadgeCheck
                                            type="submit"
                                            className="h-4 w-4 text-icon-download"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="hidden"
                                            defaultValue={0}
                                            name="verify"
                                        />
                                        <BadgeX
                                            type="submit"
                                            className="h-4 w-4 text-icon-delete"
                                        />
                                    </>
                                )}
                            </button>
                        </Form>
                    </div>
                </div>
            ),  
            width: 140,
        },
    ];

    const [queryState, setQueryState] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(userRoute.index().url, queryState, {
                replace: true,
                preserveScroll: true,
                preserveState: true,
            });
        }, 150);

        return () => clearTimeout(timeout);
    }, [queryState]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Container>
                    <Table
                        columns={columns}
                        data={users.data}
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
                        totalPages={users.last_page}
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
