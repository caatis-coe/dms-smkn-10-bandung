import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import DocumentController from "@/actions/App/Http/Controllers/DocumentController";
import { Form } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FileDropzone from "@/components/ui/file-dropzone"; // ← your custom dropzone

export default function CreateDocumentDialog() {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mb-4">Unggah Dokumen</Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Unggah Dokumen Baru</DialogTitle>
                </DialogHeader>

                <Form
                    {...DocumentController.store.form()}
                    transform={(data) => {
                        // Inject the selected file into Inertia form data
                        return {
                            ...data,
                            file: selectedFile ?? null,
                        };
                    }}
                    options={{
                        preserveScroll: true,
                    }}
                    onSuccess={() => {
                        setOpen(false);
                        setSelectedFile(null);
                    }}
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
                                    className="rounded border bg-background p-2"
                                    required
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
                                    className="rounded border bg-background p-2"
                                    required
                                />

                                {errors.name && (
                                    <p className="text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* FILE DROPZONE */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">
                                    Unggah PDF
                                </label>

                                <FileDropzone
                                    onFileSelect={(file) => setSelectedFile(file)}
                                />

                                {errors.file && (
                                    <p className="text-xs text-red-500">
                                        {errors.file}
                                    </p>
                                )}
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex justify-end gap-2">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>

                                <Button type="submit" disabled={processing}>
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
