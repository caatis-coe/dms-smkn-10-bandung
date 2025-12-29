import { Container } from '@/components/ui/container';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import businessProcessRoute from '@/routes/business-process';
import type {
    BreadcrumbItem,
    GroupOwner,
    ProcessNode,
    SharedData,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import { useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import NodeActions from './partials/node-actions';
import ProcessGrid from './partials/process-grid';
import CreateChapterDialog from './partials/create-chapter-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Business Process', href: '#' },
];

type Query = {
    group_owner?: number;
    search?: string;
};

export default function index({
    query,
    nodes,
    topNodes,
}: {
    query: Query;
    nodes: ProcessNode[];
    topNodes: ProcessNode[];
}) {
    const {
        auth: { user },
    } = usePage<SharedData>().props;

    const canAdmin = user?.role === 'admin';

    const [queryState, setQueryState] = useState(query);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);

    const groupOwners = usePage().props.group_owners as GroupOwner[];

    /* ================= QUERY EFFECT ================= */
    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => {
            router.get(businessProcessRoute.index().url, queryState, {
                replace: true,
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsLoading(false),
            });
        }, 150);

        return () => clearTimeout(timeout);
    }, [queryState]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Business Process" />

            <div className="flex flex-col gap-4 p-4">
                {/* ================= GROUP OWNER TABS ================= */}
                <Container className="flex flex-wrap gap-4">
                    {groupOwners.map((owner) => (
                        <button
                            key={owner.id}
                            type="button"
                            onClick={() =>
                                setQueryState((prev) => ({
                                    ...prev,
                                    group_owner: owner.id,
                                }))
                            }
                            className={cn(
                                'h-fit rounded-md px-4 py-2 text-sm font-medium transition',
                                owner.id == query.group_owner
                                    ? 'pointer-events-none bg-primary text-primary-foreground'
                                    : 'bg-muted-foreground/10 hover:bg-muted-foreground/20 focus:bg-muted-foreground/20',
                            )}
                        >
                            {owner.name}
                        </button>
                    ))}
                </Container>

                <div className='flex justify-between'>
                    {/* ================= SEARCH ================= */}
                    <Input
                        disabled={nodes.length === 0}
                        type="text"
                        placeholder="Cari Bisnis Proses..."
                        value={queryState.search ?? ''}
                        onChange={(e) =>
                            setQueryState((prev) => ({
                                ...prev,
                                search: e.target.value,
                            }))
                        }
                        className="min-h-9 w-64 rounded-md border px-3 !py-2 text-sm"
                    />

                    <CreateChapterDialog
                        groupOwnerId={queryState.group_owner}
                        isTriggerButton
                    />
                </div>

                {/* ================= CONTENT ================= */}
                {isLoading ? (
                    <>
                        {/* ================= SKELETON LOADING  ================= */}
                        <div className="h-12 animate-pulse rounded bg-muted" />
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                            <div className="h-56 animate-pulse rounded bg-muted" />
                            <div className="h-56 animate-pulse rounded bg-muted" />
                            <div className="h-56 animate-pulse rounded bg-muted" />
                            <div className="h-56 animate-pulse rounded bg-muted" />
                            <div className="h-56 animate-pulse rounded bg-muted" />
                            <div className="h-56 animate-pulse rounded bg-muted" />
                        </div>
                        <div className="h-12 animate-pulse rounded bg-muted" />
                        <div className="h-12 animate-pulse rounded bg-muted" />
                    </>
                ) : nodes.length !== 0 ? (
                    <div className="flex flex-col gap-3">
                        {nodes.map((level1) => (
                            <div
                                key={level1.id}
                                className="flex flex-col gap-3"
                            >
                                {/* ================= LEVEL 1  ================= */}
                                <div className="flex items-center justify-between rounded-md bg-[color:var(--color-chart-3)] px-4 py-3 font-semibold text-white">
                                    <span>
                                        {level1.code}. {level1.name}
                                    </span>

                                    {canAdmin && (
                                        <NodeActions
                                            node={level1}
                                            canAddChapter={true}
                                            groupOwnerId={
                                                queryState.group_owner
                                            }
                                        />
                                    )}
                                </div>

                                <ProcessGrid
                                    node={level1}
                                    canAdmin={canAdmin}
                                    setPreviewImage={setPreviewImage}
                                    setImageName={setImageName}
                                    previewImage={previewImage}
                                    imageName={imageName}
                                />

                                {/* ================= LEVEL 2 ================= */}
                                {Array.isArray(level1.children) &&
                                    level1.children.map((level2) => (
                                        <div
                                            key={level2.id}
                                            className="flex flex-col gap-3"
                                        >
                                            {/* ================= LEVEL 2 HEADER ================= */}
                                            <div className="flex items-center justify-between rounded-md bg-[color:var(--color-chart-2)] px-4 py-2 font-medium text-white">
                                                <span>
                                                    {level2.code}. {level2.name}
                                                </span>

                                                {canAdmin && (
                                                    <NodeActions
                                                        node={level2}
                                                        topNodes={topNodes}
                                                        parentNodeInit={level1}
                                                        groupOwnerId={
                                                            queryState.group_owner
                                                        }
                                                    />
                                                )}
                                            </div>

                                            {/* ================= PROCESS GRID ================= */}
                                            <ProcessGrid
                                                node={level2}
                                                canAdmin={canAdmin}
                                                setPreviewImage={
                                                    setPreviewImage
                                                }
                                                setImageName={setImageName}
                                                previewImage={previewImage}
                                                imageName={imageName}
                                            />
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-4 text-lg font-bold text-muted-foreground">
                        No Data
                    </div>
                )}
            </div>
            {/* ================= IMAGE PREVIEW ================= */}
            {previewImage && imageName && (
                <Dialog
                    open={!!previewImage}
                    onOpenChange={(open) => {
                        if (!open) {
                            setPreviewImage(null);
                            setImageName(null);
                        }
                    }}
                >
                    <DialogContent className="w-fit border-0">
                        <DialogHeader className="">
                            <DialogTitle>{imageName}</DialogTitle>
                        </DialogHeader>

                        <div className="flex items-center justify-center">
                            <img
                                src={previewImage ?? ''}
                                alt="Preview"
                                className="max-w-full"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}
