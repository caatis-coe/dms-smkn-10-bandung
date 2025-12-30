import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { GroupOwner } from '@/types';
import { Form } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';

import GroupOwnerController from '@/actions/App/Http/Controllers/GroupOwnerController';
import { Spinner } from '../../../components/ui/spinner';
import InputError from '@/components/input-error';

export type ActionsCellProps = {
    row: GroupOwner;
    groupOwnerName: string;
};

export function ActionsCell({ row, groupOwnerName }: ActionsCellProps) {
    return (
        <div className="flex items-center gap-2">
            {/* ==================== UPDATE BUTTON ==================== */}
            {(() => {
                const [open, setOpen] = useState(false);

                return (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger
                            title="Ubah Dokumen"
                            className="cursor-pointer rounded p-1 transition hover:bg-foreground/5"
                        >
                            <Pencil className="h-4 w-4 text-icon-edit" />
                        </DialogTrigger>

                        <DialogContent className="max-w-sm rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Edit {groupOwnerName}</DialogTitle>
                            </DialogHeader>
                            {/* =================================================== */}
                            {/*                  UPDATE FORM LAYOUT                 */}
                            {/* =================================================== */}
                            <Form
                                {...GroupOwnerController.update.form({
                                    groupOwner: row.id,
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
                                            <div className="space-y-4 rounded-lg border p-4">
                                                {/* ID */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-sm font-medium">
                                                        Nama {groupOwnerName}
                                                    </label>
                                                    <input
                                                        name="code"
                                                        defaultValue={row.name}
                                                        className="w-full rounded border p-2"
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                    />
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
                                <DialogTitle>Hapus </DialogTitle>
                            </DialogHeader>

                            <Form
                                {...GroupOwnerController.destroy.form({
                                    groupOwner: row.id,
                                })}
                                onSuccess={() => setOpen(false)}
                                options={{ preserveScroll: true }}
                                className="space-y-6"
                            >
                                {({ processing }) => (
                                    <>
                                        <p className="text-sm">
                                            Apakah anda yakin ingin menghapus{' '}
                                            <strong>{row.name}</strong>? Aksi
                                            ini akan menghapus{' '}
                                            <strong>
                                                proses bisnis terkait dengan {groupOwnerName.toLowerCase()}  ini
                                            </strong>{' '}
                                            dan tidak dapat dibatalkan.
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
