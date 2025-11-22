import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DocumentItem } from '@/pages/document';
import { User } from '@/types';

import { Form, router } from '@inertiajs/react';
import { Download, Eye, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

export type ActionsCellProps = {
    row: DocumentItem;
    user: User | null;
};

export function ActionsCell({ row, user }: ActionsCellProps) {
    const canDownload = user && (user.role === 'user' || user.role === 'admin');
    const canAdmin = user?.role === 'admin';

    const IconButton = ({
        children,
        onClick,
        title,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
        title: string;
    }) => (
        <button
            onClick={onClick}
            title={title}
            className="cursor-pointer rounded p-1 transition hover:bg-white/10"
        >
            {children}
        </button>
    );
    return (
        <div className="flex items-center gap-2">
            {/* VIEW — always available */}
            <Dialog>
                <DialogTrigger
                    title="View Document"
                    className="cursor-pointer rounded p-1 transition hover:bg-white/10"
                >
                    <Eye className="h-4 w-4 text-icon-view" />
                </DialogTrigger>

                <DialogContent className="flex h-[90vh] max-w-[95vw] flex-col sm:max-w-[90vw]">
                    <DialogHeader>
                        <DialogTitle>{row.name}</DialogTitle>
                    </DialogHeader>

                    <iframe
                        src={`${row.file_url}#toolbar=0`}
                        className="w-full flex-1 rounded border"
                    />
                </DialogContent>
            </Dialog>

            {/* DOWNLOAD — only for logged-in (user/admin) */}
            {canDownload && (
                <a
                    href={row.file_url}
                    download={`${row.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
                    title="Download PDF"
                    className="cursor-pointer rounded p-1 transition hover:bg-white/10"
                >
                    <Download className="h-4 w-4 text-icon-download" />
                </a>
            )}

            {/* UPDATE — admin only */}
            {canAdmin &&
                (() => {
                    const [open, setOpen] = useState(false);
                    const [docId, setDocId] = useState(row.id);
                    const [docName, setDocName] = useState(row.name);
                    const [docFile, setDocFile] = useState<File | null>(null);

                    const idChanged = docId !== row.id;
                    const nameChanged = docName !== row.name;
                    const somethingChanged =
                        idChanged || nameChanged || !!docFile;

                    const isSubmitDisabled =
                        !docId.trim() ||
                        !docName.trim() ||
                        (!idChanged && !nameChanged && !docFile);
                    
                    return (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger
                                title="Update Document"
                                className="cursor-pointer rounded p-1 transition hover:bg-white/10"
                                onClick={() => setOpen(true)}
                            >
                                <Pencil className="h-4 w-4 text-icon-edit" />
                            </DialogTrigger>

                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>Edit Document</DialogTitle>
                                </DialogHeader>

                                <Form
                                    {...DocumentController.update.form({
                                        document: row.id,
                                    })}
                                    resetOnSuccess
                                    onSuccess={() => setOpen(false)}
                                    options={{ preserveScroll: true }}
                                    className="flex flex-col gap-4"
                                >
                                    {({ errors, processing }) => (
                                        <>
                                            {/* DOCUMENT ID */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm font-medium">
                                                    Nomor Dokumen
                                                </label>

                                                <input
                                                    name="id"
                                                    type="text"
                                                    defaultValue={row.id}
                                                    className="rounded border bg-background p-2"
                                                    onChange={(e) => setDocId(e.target.value)}
                                                />

                                                {errors.id && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.id}
                                                    </p>
                                                )}
                                            </div>

                                            {/* DOCUMENT NAME */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm font-medium">
                                                    Nama Dokumen
                                                </label>

                                                <input
                                                    name="name"
                                                    type="text"
                                                    defaultValue={row.name}
                                                    className="rounded border bg-background p-2"
                                                    onChange={(e) => setDocName(e.target.value)}
                                                />

                                                {errors.name && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            {/* FILE */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm font-medium">
                                                    Ubah Dokumen
                                                </label>

                                                <input
                                                    name="file"
                                                    type="file"
                                                    accept="application/pdf"
                                                    className="rounded border bg-background p-2"
                                                    onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                                                />

                                                {errors.file && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.file}
                                                    </p>
                                                )}
                                            </div>

                                            {/* BUTTONS */}
                                            <div className="mt-4 flex justify-end gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                >
                                                    Cancel
                                                </Button>

                                                <Button
                                                    type="submit"
                                                    disabled={processing || isSubmitDisabled}
                                                >
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    );
                })()}

            {/* DELETE — admin only */}
            {canAdmin &&
                (() => {
                    const [open, setOpen] = useState(false);

                    return (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger
                                title="Delete Document"
                                className="hover:bg-icon-delete-hover cursor-pointer rounded p-1 transition"
                            >
                                <Trash className="h-4 w-4 text-icon-delete" />
                            </DialogTrigger>

                            <DialogContent className="max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>Delete Document</DialogTitle>
                                </DialogHeader>

                                <p className="text-sm text-muted-foreground">
                                    Are you sure you want to delete{' '}
                                    <strong>{row.name}</strong>? This action
                                    cannot be undone.
                                </p>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            router.delete(
                                                `/documents/${row.id}`,
                                                {
                                                    onFinish: () =>
                                                        setOpen(false),
                                                },
                                            )
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    );
                })()}
        </div>
    );
}
