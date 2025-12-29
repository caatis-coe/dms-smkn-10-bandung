import { ProcessNode } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useRef, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { Form } from "@inertiajs/react";
import BusinessProcessController from "@/actions/App/Http/Controllers/BusinessProcessController";
import InputError from "@/components/input-error";
import FileDropzone from "@/components/ui/file-dropzone";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ProcessGrid({
    node,
    canAdmin,
    setPreviewImage,
    setImageName,
}: {
    node: ProcessNode;
    canAdmin: boolean;
    setPreviewImage: (image: string) => void;
    setImageName: (name: string) => void;
    previewImage: string | null;
    imageName: string | null;
}) {
    return (
        <>
            {node.processes.length !== 0 && (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                    {node.processes.map((process) => (
                        <div key={process.id} className="group relative">
                            <div className="flex w-full cursor-pointer flex-col gap-2 rounded-lg border bg-card p-3 text-left shadow-sm transition">
                                {canAdmin && (
                                    <div className="flex justify-end">
                                        <div className="z-10 flex gap-4 rounded-tl-lg px-3.5 pb-1">
                                            <ProcessEditDialog
                                                process={process}
                                            />
                                            <ProcessDeleteDialog
                                                process={process}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="relative aspect-[4/3] overflow-hidden rounded bg-muted">
                                    <img
                                        src={process.file_path}
                                        alt={process.name}
                                        className="h-full w-full object-cover transition hover:scale-[105%]"
                                        onClick={() => {
                                            setPreviewImage(process.file_path);
                                            setImageName(process.name);
                                        }}
                                    />
                                </div>

                                <div className="w-full truncate text-sm">
                                    {process.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

/* ===================================================== */
/* ================= PROCESS ACTIONS =================== */
/* ===================================================== */

function ProcessEditDialog({ process }: { process: any }) {
    const [open, setOpen] = useState(false);
    const imageFileRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="">
                <Pencil className="h-4 w-4 cursor-pointer text-icon-edit drop-shadow-xs" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Process</DialogTitle>
                </DialogHeader>

                <Form
                    {...BusinessProcessController.update.form({
                        businessProcess: process.id,
                    })}
                    onSuccess={() => setOpen(false)}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="PUT" />
                            <div className="space-y-4 rounded-lg border p-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">
                                        Nama
                                    </label>
                                    <input
                                        name="name"
                                        defaultValue={process.name}
                                        className="w-full rounded border p-2"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">
                                        Gambar
                                    </label>
                                    <FileDropzone
                                        value={imageFile}
                                        onChange={(file) => {
                                            setImageFile(file);
                                            if (imageFileRef.current && file) {
                                                const dt = new DataTransfer();
                                                dt.items.add(file);
                                                imageFileRef.current.files =
                                                    dt.files;
                                            }
                                        }}
                                        accept="image/*"
                                    />
                                    <InputError message={errors.file} />
                                    <input
                                        ref={imageFileRef}
                                        type="file"
                                        name="file"
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>

                                <Button type="submit" variant="default">
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
}

function ProcessDeleteDialog({ process }: { process: any }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Trash className="h-4 w-4 cursor-pointer text-icon-delete drop-shadow-xs" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Gambar</DialogTitle>
                </DialogHeader>
                <Form
                    {...BusinessProcessController.destroy.form({
                        businessProcess: process.id,
                    })}
                    method="delete"
                >
                    {({ processing }) => (
                        <>
                            <p className="text-sm">
                                Apakah anda yakin ingin menghapus gambar{' '}
                                <strong>{process.name}</strong>? Aksi ini tidak
                                dapat dibatalkan.
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
}