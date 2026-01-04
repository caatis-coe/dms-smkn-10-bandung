import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Document, DocumentType, GroupOwner, User } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import InputError from '../../../components/input-error';
import { Button } from '../../../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import FileDropzone from '../../../components/ui/file-dropzone';
import { Spinner } from '../../../components/ui/spinner';

export type ActionsCellProps = {
    row: Document;
    user: User | null;
};

export function ActionsCell({ row, user }: ActionsCellProps) {
    const canAdmin = user?.role === 'admin' && user.email_verified_by_admin_at;
    if (!canAdmin) return null;
    const owners = usePage().props.group_owners as GroupOwner[];

    const documentTypes = usePage().props.document_types as DocumentType[];
    const [documentType, setDocumentType] = useState<DocumentType>(row.document_type);
    const [documentOwner, setDocumentOwner] = useState<GroupOwner | null>(
        row.owner ?? null,
    );

    const mainFileRef = useRef<HTMLInputElement>(null);
    const supportingFileRef = useRef<HTMLInputElement>(null);

    const [status, setStatus] = useState<
        'aktif' | 'dicabut' | 'digantikan_oleh_dokumen_lain'
    >(row.status);
    const [mainFile, setMainFile] = useState<File | null>(null);
    const [supportingFile, setSupportingFile] = useState<File | null>(null);

    return (
        <div className="flex items-center gap-2">
            {/* ==================== UPDATE BUTTON ==================== */}
            {(() => {
                const [open, setOpen] = useState(false);
                const [removeSupporting, setRemoveSupporting] = useState(false);
                useEffect(() => {
                    if (!open) return;
                    setSupportingFile(null);
                    setMainFile(null);
                }, [open]);

                return (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger
                            title="Ubah Dokumen"
                            className="cursor-pointer rounded p-1 transition hover:bg-foreground/5"
                        >
                            <Pencil className="h-4 w-4 text-icon-edit" />
                        </DialogTrigger>

                        <DialogContent className="flex max-h-[95vh] max-w-[95vw] flex-col overflow-y-auto sm:max-w-[80vw]">
                            <DialogHeader>
                                <DialogTitle>Edit Document</DialogTitle>
                            </DialogHeader>
                            {/* =================================================== */}
                            {/*                  UPDATE FORM LAYOUT                 */}
                            {/* =================================================== */}
                            <Form
                                {...DocumentController.update.form({
                                    document: row.id,
                                })}
                                onSuccess={() => setOpen(false)}
                                options={{ preserveScroll: true }}
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name="_method"
                                            value="PUT"
                                        />

                                        <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2 md:gap-9">
                                            {/* ================= LEFT COLUMN ================= */}
                                            <div className="space-y-4">
                                                {/* ID */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Nomor Dokumen
                                                    </label>
                                                    <input
                                                        name="code"
                                                        defaultValue={row.code}
                                                        className="rounded border p-2"
                                                    />
                                                    <InputError
                                                        message={errors.code}
                                                    />
                                                </div>

                                                {/* NAME */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Nama Dokumen
                                                    </label>
                                                    <input
                                                        name="name"
                                                        defaultValue={row.name}
                                                        className="rounded border p-2"
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                    />
                                                </div>

                                                {/* STANDARD */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Standar
                                                    </label>
                                                    <input
                                                        name="standard"
                                                        defaultValue={
                                                            row.standard ?? ''
                                                        }
                                                        className="rounded border p-2"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.standard
                                                        }
                                                    />
                                                </div>

                                                {/* CLAUSE */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Klausul
                                                    </label>
                                                    <input
                                                        name="clause"
                                                        defaultValue={
                                                            row.clause ?? ''
                                                        }
                                                        className="rounded border p-2"
                                                    />
                                                    <InputError
                                                        message={errors.clause}
                                                    />
                                                </div>

                                                {/* DOCUMENT TYPE */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Jenis Dokumen
                                                    </label>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            className={`${!documentType ? 'pointer-events-none text-foreground/20' : ''} flex w-full items-center justify-between rounded border bg-background p-2`}
                                                        >
                                                            {documentType?.name ??
                                                                'Tidak ada jenis dokumen tersedia'}
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                                                            {documentTypes.map(
                                                                (type) => (
                                                                    <DropdownMenuItem
                                                                        key={
                                                                            type?.id
                                                                        }
                                                                        onClick={() => {
                                                                            setDocumentType(
                                                                                type,
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            type?.name
                                                                        }
                                                                    </DropdownMenuItem>
                                                                ),
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <InputError
                                                        message={
                                                            errors.document_type
                                                        }
                                                    />
                                                    {!documentType && (
                                                        <InputError message="Buat terlebih dahulu jenis dokumen sebelum melanjutkan unggahan dokumen" />
                                                    )}
                                                    <input
                                                        type="hidden"
                                                        name="document_type"
                                                        value={documentType.id}
                                                    />
                                                </div>

                                                {/* DOCUMENT OWNER */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Pemilik Dokumen
                                                    </label>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="flex w-full items-center justify-between rounded border bg-background p-2 text-left">
                                                            <span>
                                                                {documentOwner?.name ??
                                                                    '<Tidak ada pemilik dokumen>'}
                                                            </span>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent className="max-h-64 w-full min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
                                                            {[
                                                                ...owners,
                                                                null,
                                                            ].map((owner) => (
                                                                <DropdownMenuItem
                                                                    key={
                                                                        owner?.id
                                                                    }
                                                                    onClick={() => {
                                                                        setDocumentOwner(
                                                                            owner,
                                                                        );
                                                                    }}
                                                                >
                                                                    {owner?.name ??
                                                                        '<Tidak ada pemilik dokumen>'}
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <InputError
                                                        message={
                                                            errors.document_owner
                                                        }
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="document_owner"
                                                        value={
                                                            documentOwner?.id ??
                                                            ''
                                                        }
                                                    />
                                                </div>

                                                {/* REVISION */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Revisi
                                                    </label>
                                                    <input
                                                        name="revision"
                                                        defaultValue={
                                                            row.revision ?? ''
                                                        }
                                                        className="rounded border p-2"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.revision
                                                        }
                                                    />
                                                </div>

                                                {/* EFFECTIVE DATE */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Tanggal Efektif
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="effective_date"
                                                        defaultValue={
                                                            row.effective_date
                                                                ? new Date(
                                                                      row.effective_date,
                                                                  )
                                                                      .toISOString()
                                                                      .split(
                                                                          'T',
                                                                      )[0]
                                                                : ''
                                                        }
                                                        className="rounded border p-2"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.effective_date
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* ================= RIGHT COLUMN ================= */}
                                            <div className="space-y-4">
                                                {/* APPLICATION LINK */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Link Aplikasi
                                                    </label>
                                                    <input
                                                        name="application_link"
                                                        defaultValue={
                                                            row.application_link ??
                                                            ''
                                                        }
                                                        className="rounded border p-2"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.application_link
                                                        }
                                                    />
                                                </div>
                                                {/* STATUS */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Jenis Dokumen
                                                    </label>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="flex w-full items-center justify-between rounded border bg-background p-2">
                                                            {status ===
                                                            'dicabut'
                                                                ? 'Dicabut'
                                                                : status ===
                                                                    'aktif'
                                                                  ? 'Aktif'
                                                                  : 'Digantikan Oleh Dokumen Lain'}
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setStatus(
                                                                        'aktif',
                                                                    )
                                                                }
                                                            >
                                                                Aktif
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setStatus(
                                                                        'dicabut',
                                                                    )
                                                                }
                                                            >
                                                                Dicabut
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setStatus(
                                                                        'digantikan_oleh_dokumen_lain',
                                                                    )
                                                                }
                                                            >
                                                                Digantikan Oleh
                                                                Dokumen Lain
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <InputError
                                                        message={errors.status}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="status"
                                                        value={status}
                                                    />
                                                </div>
                                                {/* ================= MAIN FILE ================= */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">
                                                        Ubah File Utama
                                                        (optional)
                                                    </label>

                                                    <FileDropzone
                                                        value={mainFile}
                                                        onChange={(file) => {
                                                            setMainFile(file);
                                                            if (
                                                                mainFileRef.current &&
                                                                file
                                                            ) {
                                                                const dt =
                                                                    new DataTransfer();
                                                                dt.items.add(
                                                                    file,
                                                                );
                                                                mainFileRef.current.files =
                                                                    dt.files;
                                                            }
                                                        }}
                                                    />
                                                    <InputError
                                                        message={errors.file}
                                                    />

                                                    <input
                                                        ref={mainFileRef}
                                                        type="file"
                                                        name="file"
                                                        className="hidden"
                                                    />
                                                </div>

                                                {/* ================= SUPPORTING FILE ================= */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">
                                                        Ubah File Pendukung
                                                        (optional)
                                                    </label>

                                                    <FileDropzone
                                                        value={supportingFile}
                                                        onChange={(file) => {
                                                            setSupportingFile(
                                                                file,
                                                            );

                                                            if (file) {
                                                                setRemoveSupporting(
                                                                    false,
                                                                );
                                                            }

                                                            if (
                                                                supportingFileRef.current &&
                                                                file
                                                            ) {
                                                                const dt =
                                                                    new DataTransfer();
                                                                dt.items.add(
                                                                    file,
                                                                );
                                                                supportingFileRef.current.files =
                                                                    dt.files;
                                                            }

                                                            if (
                                                                !file &&
                                                                supportingFileRef.current
                                                            ) {
                                                                supportingFileRef.current.value =
                                                                    '';
                                                            }
                                                        }}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.supporting_file
                                                        }
                                                    />
                                                    <input
                                                        ref={supportingFileRef}
                                                        type="file"
                                                        name="supporting_file"
                                                        className="hidden"
                                                    />
                                                </div>

                                                {/* ================= REMOVE SUPPORTING FILE ================= */}
                                                {row.supporting_file_path && (
                                                    <label
                                                        className={`flex items-center gap-2 text-sm ${supportingFile ? 'text-muted-foreground' : ''} `}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name="remove_supporting_file"
                                                            value="1"
                                                            checked={
                                                                removeSupporting
                                                            }
                                                            disabled={
                                                                !!supportingFile
                                                            }
                                                            onChange={(e) => {
                                                                const checked =
                                                                    e.target
                                                                        .checked;
                                                                setRemoveSupporting(
                                                                    checked,
                                                                );

                                                                // 🔑 if user checks "remove", clear file
                                                                if (checked) {
                                                                    setSupportingFile(
                                                                        null,
                                                                    );
                                                                    if (
                                                                        supportingFileRef.current
                                                                    ) {
                                                                        supportingFileRef.current.value =
                                                                            '';
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        Hapus File Pendukung
                                                    </label>
                                                )}
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

                                            <Button
                                                type="submit"
                                                variant="default"
                                            >
                                                {processing && <Spinner />}
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

            {/* ==================== DELETE BUTTON ==================== */}
            {(() => {
                const [open, setOpen] = useState(false);

                return (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger
                            title="Hapus Dokumen"
                            className="hover:bg-icon-delete-hover cursor-pointer rounded p-1 transition hover:bg-foreground/5"
                        >
                            <Trash className="h-4 w-4 text-icon-delete" />
                        </DialogTrigger>

                        <DialogContent className="max-w-sm rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Delete Document</DialogTitle>
                            </DialogHeader>

                            <Form
                                {...DocumentController.destroy.form({
                                    document: row.id,
                                })}
                                onSuccess={() => setOpen(false)}
                                options={{ preserveScroll: true }}
                                className="space-y-6"
                            >
                                {({ processing }) => (
                                    <>
                                        <p className="text-sm">
                                            Are you sure you want to delete{' '}
                                            <strong>{row.name}</strong>? This
                                            action cannot be undone.
                                        </p>

                                        <div className="mt-6 flex justify-end gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Delete
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                );
            })()}
        </div>
    );
}
