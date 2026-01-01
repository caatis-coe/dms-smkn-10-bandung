import { ProcessNode } from "@/types";
import { useEffect, useState } from "react";
import { Form } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useRef } from "react";
import BusinessProcessController from "@/actions/App/Http/Controllers/BusinessProcessController";
import { DiamondPlus, ImagePlus, Pencil, Trash } from 'lucide-react';
import InputError from '@/components/input-error';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FileDropzone from '@/components/ui/file-dropzone';
import { Spinner } from '@/components/ui/spinner';
import { Button } from "@/components/ui/button";
import CreateChapterDialog from "./create-chapter-dialog";

export default function NodeActions({
    node,
    canAddChapter,
    parentNodeInit,
    topNodes,
    groupOwnerId
}: {
    node: any;
    canAddChapter?: boolean;
    parentNodeInit?: ProcessNode;
    topNodes?: ProcessNode[];
    groupOwnerId?: number;
}) {
    const [openCreateProcess, setOpenCreateProcess] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [parentNode, setParentNode] = useState<ProcessNode | null>(null);

    useEffect(() => {
        setParentNode(parentNodeInit ?? null);
    }, [openEdit]);

    return (
        <div className="flex items-center gap-2">
            {/* CREATE CHAPTER */}
            {canAddChapter && (
                <CreateChapterDialog
                    node={node}
                    groupOwnerId={groupOwnerId}
                />
            )}

            {/* CREATE PROCESS */}
            <Dialog
                open={openCreateProcess}
                onOpenChange={setOpenCreateProcess}
            >
                <DialogTrigger
                    title="Tambah Gambar"
                    className="hover:bg-icon-delete-hover cursor-pointer rounded p-1 transition hover:bg-foreground/5"
                >
                    <ImagePlus className="h-4 w-4 text-white" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Proses Bisnis</DialogTitle>
                    </DialogHeader>

                    <Form
                        {...BusinessProcessController.store.form()}
                        onSuccess={() => setOpenCreateProcess(false)}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => {
                            const imageFileRef = useRef<HTMLInputElement>(null);
                            const [imageFile, setImageFile] =
                                useState<File | null>(null);
                            return (
                                <>
                                    <div className="space-y-4 rounded-lg border p-4">
                                        <input
                                            type="hidden"
                                            name="node_id"
                                            className="w-full rounded border p-2"
                                            defaultValue={node.id}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium">
                                                Nama
                                            </label>
                                            <input
                                                name="name"
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
                                                    if (
                                                        imageFileRef.current &&
                                                        file
                                                    ) {
                                                        const dt =
                                                            new DataTransfer();
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
                                            onClick={() =>
                                                setOpenCreateProcess(false)
                                            }
                                        >
                                            Cancel
                                        </Button>

                                        <Button type="submit" variant="default">
                                            {processing && <Spinner />}
                                            Create
                                        </Button>
                                    </div>
                                </>
                            );
                        }}
                    </Form>
                </DialogContent>
            </Dialog>

            {/* EDIT NODE */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogTrigger
                    title="Ubah Bab"
                    className="hover:bg-icon-delete-hover cursor-pointer rounded p-1 transition hover:bg-foreground/5"
                >
                    <Pencil className="h-4 w-4 text-white" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {canAddChapter ? 'Ubah Bab' : 'Ubah Sub Bab'}
                        </DialogTitle>
                    </DialogHeader>

                    <Form
                        {...BusinessProcessController.updateNode.form({
                            node: node.id,
                        })}
                        method="put"
                        onSuccess={() => setOpenEdit(false)}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <input
                                    type="hidden"
                                    name="_method"
                                    value="PUT"
                                />
                                <div className="space-y-4 rounded-lg border p-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Nama
                                        </label>
                                        <input
                                            name="name"
                                            defaultValue={node.name}
                                            className="w-full rounded border p-2"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">
                                            Bab
                                        </label>
                                        <input
                                            name="code"
                                            defaultValue={node.code}
                                            className="w-full rounded border p-2"
                                        />
                                        <InputError message={errors.code} />
                                    </div>
                                    {!canAddChapter && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium">
                                                Bagian Dari Bab
                                            </label>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex w-full items-center justify-between rounded border bg-background p-2">
                                                    {parentNode ? (
                                                        <>
                                                            {parentNode?.code}
                                                            {'. '}
                                                            {parentNode?.name}
                                                        </>
                                                    ) : (
                                                        '*Jadi Parent Bab'
                                                    )}
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent className="max-h-64 w-full min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
                                                    {topNodes?.map((node) => (
                                                        <DropdownMenuItem
                                                            key={
                                                                node?.id ??
                                                                'null'
                                                            }
                                                            onClick={() =>
                                                                setParentNode(
                                                                    node,
                                                                )
                                                            }
                                                        >
                                                            {node ? (
                                                                <>
                                                                    {node.code}
                                                                    {'. '}
                                                                    {node.name}
                                                                </>
                                                            ) : (
                                                                '*Jadi Parent Bab'
                                                            )}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <InputError
                                                message={errors.parent_id}
                                            />
                                            <input
                                                type="hidden"
                                                name="parent_id"
                                                value={parentNode?.id}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => setOpenEdit(false)}
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

            {/* DELETE NODE */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogTrigger
                    title="Hapus Bab"
                    className="hover:bg-icon-delete-hover cursor-pointer rounded p-1 transition hover:bg-foreground/5"
                >
                    <Trash className="h-4 w-4 text-white" />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Bab {node.code}.</DialogTitle>
                    </DialogHeader>

                    <Form
                        {...BusinessProcessController.destroyNode.form({
                            node: node.id,
                        })}
                        method="delete"
                        onSuccess={() => setOpenDelete(false)}
                        className="space-y-6"
                    >
                        {({ processing }) => (
                            <>
                                <p className="text-sm">
                                    Apakah anda yakin ingin menghapus{' '}
                                    <strong>
                                        {node.code} {}
                                        {node.name}
                                    </strong>
                                    ? Aksi ini akan menghapus{' '}
                                    <strong>
                                        data-data terkait dengan bab ini
                                    </strong>{' '}
                                    dan tidak dapat dibatalkan.
                                </p>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpenDelete(false)}
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
        </div>
    );
}

