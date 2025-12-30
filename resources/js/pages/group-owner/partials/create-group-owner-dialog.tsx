import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Form } from "@inertiajs/react";
import GroupOwnerController from "@/actions/App/Http/Controllers/GroupOwnerController";
import InputError from "@/components/input-error";
import { Spinner } from "@/components/ui/spinner";

export default function CreateGroupOwnerDialog({groupOwnerName} : {groupOwnerName : string}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mb-4">Unggah Dokumen</Button>
            </DialogTrigger>

            <DialogContent className="max-w-sm rounded-xl">
                <DialogHeader>
                    <DialogTitle>Edit {groupOwnerName}</DialogTitle>
                </DialogHeader>
                <Form
                    {...GroupOwnerController.store.form()}
                    onSuccess={() => setOpen(false)}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4 rounded-lg border p-4">
                                {/* Name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">
                                        Nama {groupOwnerName}
                                    </label>
                                    <input
                                        name="name"
                                        defaultValue={""}
                                        className="w-full rounded border p-2"
                                    />
                                    <InputError message={errors.name} />
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
