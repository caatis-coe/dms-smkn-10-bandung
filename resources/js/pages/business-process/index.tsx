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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Business Process', href: '#' },
];

type Query = {
    group_owner?: number;
    search?: string;
};

function SkeletonBlock({ lines = 3 }: { lines?: number }) {
    return (
        <div className="flex flex-col gap-2">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 w-full animate-pulse rounded bg-muted"
                />
            ))}
        </div>
    );
}

export default function index({
    query,
    nodes,
}: {
    query: Query;
    nodes: ProcessNode[];
}) {
    const {
        auth: { user },
    } = usePage<SharedData>().props;

    const [queryState, setQueryState] = useState(query);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const groupOwners = usePage().props.group_owners as GroupOwner[];

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
                {/* ================= KAMPUS TABS ================= */}
                <Container className="flex flex-wrap gap-4">
                    {groupOwners.map((owner) => (
                        <button
                            key={owner.id}
                            type="button"
                            onClick={() => {
                                if (owner.id == query?.group_owner) return;
                                setQueryState((prev) => ({
                                    ...prev,
                                    group_owner: owner.id,
                                }));
                            }}
                            className={cn(
                                'rounded-md px-4 py-2 text-sm font-medium transition',
                                owner.id == queryState?.group_owner
                                    ? 'pointer-events-none bg-primary text-primary-foreground'
                                    : 'bg-muted-foreground/10 hover:bg-muted-foreground/20',
                            )}
                        >
                            {owner.name}
                        </button>
                    ))}
                </Container>

                {/* ================= SEARCH ================= */}
                <input
                    type="text"
                    placeholder="Cari Bisnis Proses..."
                    value={queryState.search ?? ''}
                    onChange={(e) =>
                        setQueryState((prev) => ({
                            ...prev,
                            search: e.target.value,
                        }))
                    }
                    className="h-9 w-64 rounded-md border px-3 text-sm"
                />

                {/* ================= CONTENT ================= */}
                {isLoading ? (
                    <div className="flex flex-col gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-4">
                                <div className="h-10 animate-pulse rounded bg-muted" />
                                <div className="flex flex-col gap-3">
                                    <div className="h-8 animate-pulse rounded bg-muted" />
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {Array.from({ length: 3 }).map(
                                            (_, j) => (
                                                <div
                                                    key={j}
                                                    className="h-20 animate-pulse rounded-lg bg-muted"
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {nodes.map((level1) => (
                            <div
                                key={level1.id}
                                className="flex flex-col gap-4"
                            >
                                {/* ===== BLUE HEADER (LEVEL 1) ===== */}
                                <div className="rounded-md bg-[color:var(--color-chart-3)] px-4 py-3 font-semibold text-white">
                                    {level1.code}. {level1.name}
                                </div>

                                {Array.isArray(level1.children) &&
                                    level1.children.map((level2) => (
                                        <div
                                            key={level2.id}
                                            className="flex flex-col gap-3"
                                        >
                                            <div className="rounded-md bg-[color:var(--color-chart-2)] px-4 py-2 font-medium text-white">
                                                {level2.code}. {level2.name}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
                                                {Array.isArray(
                                                    level2.processes,
                                                ) &&
                                                    level2.processes.map(
                                                        (process) => (
                                                            <button
                                                                key={process.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    setPreviewImage(
                                                                        process.file_path,
                                                                    )
                                                                }
                                                                className="group flex flex-col gap-2 rounded-lg border bg-card p-3 text-left shadow-sm transition hover:shadow focus:outline-none"
                                                            >
                                                                {/* IMAGE PREVIEW */}
                                                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
                                                                    <img
                                                                        src={
                                                                            process.file_path
                                                                        }
                                                                        alt={
                                                                            process.name
                                                                        }
                                                                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                        loading="lazy"
                                                                    />
                                                                </div>

                                                                {/* NAME */}
                                                                <div className="text-sm font-semibold text-foreground">
                                                                    {
                                                                        process.name
                                                                    }
                                                                </div>
                                                            </button>
                                                        ),
                                                    )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-full max-w-full rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </AppLayout>
    );
}
