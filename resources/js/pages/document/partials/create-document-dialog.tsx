import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FileDropzone from '@/components/ui/file-dropzone';
import { DocumentType, GroupOwner } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import InputError from '../../../components/input-error';
import { Spinner } from '../../../components/ui/spinner';

export default function CreateDocumentDialog() {
    const [open, setOpen] = useState(false);

    const documentTypes = usePage().props.document_types as DocumentType[];
    const firstDocumentType = documentTypes[0] ?? null;
    const owners = usePage().props.group_owners as GroupOwner[];

    const [status, setStatus] = useState<
        'aktif' | 'dicabut' | 'digantikan_oleh_dokumen_lain'
    >('aktif');
    const [documentOwner, setDocumentOwner] = useState<GroupOwner | null>(null);
    const [documentType, setDocumentType] = useState<DocumentType | null>(
        firstDocumentType,
    );

    const [mainFile, setMainFile] = useState<File | null>(null);
    const [supportingFile, setSupportingFile] = useState<File | null>(null);

    useEffect(() => {
        setDocumentOwner(null);
        setDocumentType(firstDocumentType);
        setMainFile(null);
        setSupportingFile(null);
        setStatus('aktif');
    }, [open]);

    const mainFileRef = useRef<HTMLInputElement>(null);
    const supportingFileRef = useRef<HTMLInputElement>(null);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mb-4">Unggah Dokumen</Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[95vh] max-w-[95vw] flex-col overflow-y-auto sm:max-w-[80vw]">
                <DialogHeader>
                    <DialogTitle>Unggah Dokumen Baru</DialogTitle>
                </DialogHeader>

                <Form
                    {...DocumentController.store.form()}
                    onSuccess={() => {
                        setOpen(false);
                        setMainFile(null);
                        setSupportingFile(null);
                        setDocumentOwner(null);
                        setDocumentType(firstDocumentType);
                        setStatus('aktif');
                    }}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2 md:gap-9">
                                {/* ================= LEFT COLUMN ================= */}
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Nomor Dokumen
                                        </label>
                                        <input
                                            name="code"
                                            className="rounded border p-2"
                                        />
                                        <InputError message={errors.code} />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Nama Dokumen
                                        </label>
                                        <input
                                            name="name"
                                            className="rounded border p-2"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Standar
                                        </label>
                                        <input
                                            name="standard"
                                            className="rounded border p-2"
                                        />
                                        <InputError message={errors.standard} />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Klausul
                                        </label>
                                        <input
                                            name="clause"
                                            className="rounded border p-2"
                                        />
                                        <InputError message={errors.clause} />
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
                                                {documentTypes.map((type) => (
                                                    <DropdownMenuItem
                                                        key={type?.id}
                                                        onClick={() => {
                                                            setDocumentType(
                                                                type,
                                                            );
                                                        }}
                                                    >
                                                        {type?.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <InputError
                                            message={errors.document_type}
                                        />
                                        {!documentType && (
                                            <InputError message="Buat terlebih dahulu jenis dokumen sebelum melanjutkan unggahan dokumen" />
                                        )}
                                        <input
                                            type="hidden"
                                            name="document_type"
                                            value={documentType?.id}
                                        />
                                    </div>

                                    {/* OWNER */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Pemilik Dokumen
                                        </label>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="flex w-full items-center justify-between rounded border bg-background p-2">
                                                {documentOwner?.name ??
                                                    '<Tidak ada pemilik dokumen>'}
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="max-h-64 w-full min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
                                                {[...owners, null].map(
                                                    (owner) => (
                                                        <DropdownMenuItem
                                                            key={owner?.id}
                                                            onClick={() => {
                                                                setDocumentOwner(
                                                                    owner,
                                                                );
                                                            }}
                                                        >
                                                            {owner?.name ??
                                                                '<Tidak ada pemilik dokumen>'}
                                                        </DropdownMenuItem>
                                                    ),
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <InputError
                                            message={errors.document_owner}
                                        />
                                        <input
                                            type="hidden"
                                            name="document_owner"
                                            value={documentOwner?.id ?? ''}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Revisi
                                        </label>
                                        <input
                                            name="revision"
                                            className="rounded border p-2"
                                        />
                                        <InputError message={errors.revision} />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Tanggal Efektif
                                        </label>
                                        <input
                                            type="date"
                                            name="effective_date"
                                            className="rounded border p-2"
                                        />
                                        <InputError
                                            message={errors.effective_date}
                                        />
                                    </div>
                                </div>

                                {/* ================= RIGHT COLUMN ================= */}
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Link Aplikasi
                                        </label>
                                        <input
                                            name="application_link"
                                            className="rounded border p-2"
                                        />
                                        <InputError
                                            message={errors.application_link}
                                        />
                                    </div>

                                    {/* STATUS */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Jenis Dokumen
                                        </label>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="flex w-full items-center justify-between rounded border bg-background p-2">
                                                {status === 'dicabut'
                                                    ? 'Dicabut'
                                                    : status === 'aktif'
                                                      ? 'Aktif'
                                                      : 'Digantikan Oleh Dokumen Lain'}
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setStatus('aktif')
                                                    }
                                                >
                                                    Aktif
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setStatus('dicabut')
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
                                                    Digantikan Oleh Dokumen Lain
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <InputError message={errors.status} />
                                        <input
                                            type="hidden"
                                            name="status"
                                            value={status}
                                        />
                                    </div>

                                    {/* MAIN FILE (REQUIRED) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            File Utama (PDF)
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
                                                    dt.items.add(file);
                                                    mainFileRef.current.files =
                                                        dt.files;
                                                }
                                            }}
                                        />
                                        <InputError message={errors.file} />
                                        <input
                                            ref={mainFileRef}
                                            type="file"
                                            name="file"
                                            className="hidden"
                                        />
                                    </div>

                                    {/* SUPPORTING FILE */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            File Pendukung (optional)
                                        </label>

                                        <FileDropzone
                                            value={supportingFile}
                                            onChange={(file) => {
                                                setSupportingFile(file);
                                                if (
                                                    supportingFileRef.current &&
                                                    file
                                                ) {
                                                    const dt =
                                                        new DataTransfer();
                                                    dt.items.add(file);
                                                    supportingFileRef.current.files =
                                                        dt.files;
                                                }
                                            }}
                                        />
                                        <InputError
                                            message={errors.supporting_file}
                                        />
                                        <input
                                            ref={supportingFileRef}
                                            type="file"
                                            name="supporting_file"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ================= ACTIONS ================= */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    disabled={!documentType}
                                    type="submit"
                                    variant="default"
                                >
                                    {processing && <Spinner />}
                                    Create
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
