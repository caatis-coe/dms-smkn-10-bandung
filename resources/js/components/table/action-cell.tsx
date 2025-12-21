import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form, router } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import type { Document, User } from '@/types';
import { Button } from '../ui/button';
import FileDropzone from '../ui/file-dropzone';

export type ActionsCellProps = {
    row: Document;
    user: User | null;
};

export function ActionsCell({ row, user }: ActionsCellProps) {
    const canAdmin = user?.role === 'admin';
    if (!canAdmin) return null;

    return (
        <div className="flex items-center gap-2">
            {/* ==================== UPDATE BUTTON ==================== */}
            {(() => {
                const [open, setOpen] = useState(false);
                const [removeSupporting, setRemoveSupporting] = useState(false);

                return (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger
                            title="Update Document"
                            className="cursor-pointer rounded p-1 transition hover:bg-foreground/5"
                        >
                            <Pencil className="h-4 w-4 text-icon-edit" />
                        </DialogTrigger>

                        <DialogContent className="flex  max-w-[95vw] flex-col sm:max-w-[80vw]">
                            <DialogHeader>
                                <DialogTitle>Edit Document</DialogTitle>
                            </DialogHeader>

                            <Form
                                method="post"
                                action={`/documents/${row.id}`}
                                onSuccess={() => setOpen(false)}
                                className="space-y-6"
                            >
                                <input type="hidden" name="_method" value="PUT" />

                                {/* =================================================== */}
                                {/*                TWO COLUMN FORM LAYOUT              */}
                                {/* =================================================== */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* ================= LEFT COLUMN ================= */}
                                    <div className="space-y-4 border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2 text-lg">
                                            Informasi Dokumen
                                        </h3>

                                        {/* ID */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-sm">
                                                Nomor Dokumen
                                            </label>
                                            <input
                                                name="id"
                                                defaultValue={row.id}
                                                className="rounded border p-2"
                                            />
                                        </div>

                                        {/* NAME */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-sm">
                                                Nama Dokumen
                                            </label>
                                            <input
                                                name="name"
                                                defaultValue={row.name}
                                                className="rounded border p-2"
                                            />
                                        </div>

                                        {/* STANDARD */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-sm">Standar</label>
                                            <input
                                                name="standard"
                                                defaultValue={row.standard ?? ""}
                                                className="rounded border p-2"
                                            />
                                        </div>

                                        {/* CLAUSE */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-sm">Klausul</label>
                                            <input
                                                name="clause"
                                                defaultValue={row.clause ?? ""}
                                                className="rounded border p-2"
                                            />
                                        </div>

                                        {/* DOCUMENT TYPE */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-sm">
                                                Jenis Dokumen
                                            </label>
                                            <select
                                                name="document_type"
                                                defaultValue={row.document_type}
                                                className="rounded border p-2"
                                            >
                                                <option value="prosedur">Prosedur</option>
                                                <option value="instruksi">Instruksi</option>
                                                <option value="dokumen_lain">Dokumen Lain</option>
                                            </select>
                                        </div>

                                        {/* DOCUMENT OWNER */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-sm">
                                                Pemilik Dokumen
                                            </label>
                                            <input
                                                name="document_owner"
                                                placeholder="Group Owner ID"
                                                defaultValue={row.document_owner ?? ""}
                                                className="rounded border p-2"
                                            />
                                        </div>

                                        {/* REVISION */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-sm">Revisi</label>
                                            <input
                                                name="revision"
                                                defaultValue={row.revision ?? ""}
                                                className="rounded border p-2"
                                            />
                                        </div>

                                        {/* EFFECTIVE DATE */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-sm">
                                                Tanggal Efektif
                                            </label>
                                            <input
                                                type="date"
                                                name="effective_date"
                                                defaultValue={row.effective_date ?? ""}
                                                className="rounded border p-2"
                                            />
                                        </div>

                                        {/* APPLICATION LINK */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-sm">Link Aplikasi</label>
                                            <input
                                                name="application_link"
                                                defaultValue={row.application_link ?? ""}
                                                className="rounded border p-2"
                                            />
                                        </div>
                                    </div>

                                    {/* ================= RIGHT COLUMN ================= */}
                                    <div className="space-y-6 border rounded-lg p-4">
                                        <h3 className="font-semibold mb-2 text-lg">
                                            File Dokumen
                                        </h3>

                                        {/* MAIN FILE */}
                                        <div className="space-y-2">
                                            <label className="font-medium text-sm">
                                                Ubah File Utama (optional)
                                            </label>

                                            <FileDropzone
                                                onFileSelect={(file) => {
                                                    const input = document.querySelector<HTMLInputElement>(
                                                        'input[name="file"]',
                                                    );
                                                    if (input) {
                                                        const dt = new DataTransfer();
                                                        if (file) dt.items.add(file);
                                                        input.files = dt.files;
                                                    }
                                                }}
                                            />

                                            <input type="file" name="file" className="hidden" />
                                        </div>

                                        {/* SUPPORTING FILE */}
                                        <div className="space-y-2">
                                            <label className="font-medium text-sm">
                                                Ubah File Pendukung (optional)
                                            </label>

                                            <FileDropzone
                                                onFileSelect={(file) => {
                                                    const input = document.querySelector<HTMLInputElement>(
                                                        'input[name="supporting_file"]',
                                                    );
                                                    if (input) {
                                                        const dt = new DataTransfer();
                                                        if (file) dt.items.add(file);
                                                        input.files = dt.files;
                                                    }
                                                }}
                                            />

                                            <input type="file" name="supporting_file" className="hidden" />
                                        </div>

                                        {/* REMOVE SUPPORTING FILE */}
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                name="remove_supporting_file"
                                                value="1"
                                                checked={removeSupporting}
                                                onChange={(e) => setRemoveSupporting(e.target.checked)}
                                            />
                                            Hapus File Pendukung
                                        </label>
                                    </div>
                                </div>

                                {/* ================= SAVE BUTTONS ================= */}
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button type="submit" variant="default">
                                        Save Changes
                                    </Button>
                                </div>
                            </Form>
                        </DialogContent>
                    </Dialog>
                );
            })()}

            {/* ==================== DELETE BUTTON ==================== */}
            {(() => {
                const [open, setOpen] = useState(false);
                return (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger className="cursor-pointer rounded p-1 transition hover:bg-icon-delete-hover">
                            <Trash className="h-4 w-4 text-icon-delete" />
                        </DialogTrigger>

                        <DialogContent className="max-w-sm rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Delete Document</DialogTitle>
                            </DialogHeader>

                            <p className="text-sm">
                                Are you sure you want to delete{" "}
                                <strong>{row.name}</strong>? This action cannot be undone.
                            </p>

                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={() =>
                                        router.delete(`/documents/${row.id}`, {
                                            onFinish: () => setOpen(false),
                                        })
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
