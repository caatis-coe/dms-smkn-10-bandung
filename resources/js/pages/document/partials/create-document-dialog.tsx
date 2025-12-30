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
import { Form, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import InputError from '../../../components/input-error';
import { Spinner } from '../../../components/ui/spinner';
import { GroupOwner } from '@/types';

export default function CreateDocumentDialog() {
    const [open, setOpen] = useState(false);

    /* ================= STATE ================= */
    const [documentType, setDocumentType] = useState<
        'prosedur' | 'instruksi' | 'dokumen_lain'
    >('prosedur');

    const [documentOwner, setDocumentOwner] = useState<GroupOwner | null>(null);

    const [mainFile, setMainFile] = useState<File | null>(null);
    const [supportingFile, setSupportingFile] = useState<File | null>(null);

    const mainFileRef = useRef<HTMLInputElement>(null);
    const supportingFileRef = useRef<HTMLInputElement>(null);

    const owners = usePage().props.group_owners as GroupOwner[];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mb-4">Unggah Dokumen</Button>
            </DialogTrigger>

            <DialogContent className="flex max-w-[95vw] flex-col sm:max-w-[80vw] max-h-[95vh] overflow-y-auto">
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
                        setDocumentType('prosedur');
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
                                            required
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
                                            required
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
                                            <DropdownMenuTrigger className="flex w-full items-center justify-between rounded border bg-background p-2">
                                                {documentType === 'prosedur'
                                                    ? 'Prosedur'
                                                    : documentType ===
                                                        'instruksi'
                                                      ? 'Instruksi'
                                                      : 'Dokumen Lain'}
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDocumentType(
                                                            'prosedur',
                                                        )
                                                    }
                                                >
                                                    Prosedur
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDocumentType(
                                                            'instruksi',
                                                        )
                                                    }
                                                >
                                                    Instruksi
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDocumentType(
                                                            'dokumen_lain',
                                                        )
                                                    }
                                                >
                                                    Dokumen Lain
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <InputError
                                            message={errors.document_type}
                                        />
                                        <input
                                            type="hidden"
                                            name="document_type"
                                            value={documentType}
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
                                                    'Pilih Pemilik Dokumen'}
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="max-h-64 w-full min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
                                                {owners.map((owner) => (
                                                    <DropdownMenuItem
                                                        key={owner.id}
                                                        onClick={() =>
                                                            setDocumentOwner(
                                                                owner,
                                                            )
                                                        }
                                                    >
                                                        {owner.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <InputError
                                            message={errors.document_owner}
                                        />
                                        <input
                                            type="hidden"
                                            name="document_owner"
                                            value={documentOwner?.id  ?? ''}
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

                                <Button type="submit" variant="default">
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
