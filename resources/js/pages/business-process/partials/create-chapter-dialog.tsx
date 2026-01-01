import BusinessProcessController from '@/actions/App/Http/Controllers/BusinessProcessController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Form } from '@inertiajs/react';
import { DiamondPlus } from 'lucide-react';
import { useState } from 'react';

type Props = {
    node?: {
        id: number;
        code: string;
    };
    groupOwnerId?: number;

    isTriggerButton?: boolean;
};

export default function CreateChapterDialog({
    node,
    groupOwnerId,
    isTriggerButton,
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {isTriggerButton ? (
                <DialogTrigger asChild>
                    <Button  className="mb-4 bg-chart-3 hover:bg-chart-3/90 ">
                        <DiamondPlus className="h-4 w-4 text-white" />
                        <span className='text-white'>Tambah Bab</span>
                    </Button>
                </DialogTrigger>
            ) : (
                <DialogTrigger
                    title="Tambah Sub Bab"
                    className={
                        'cursor-pointer rounded p-1 transition hover:bg-foreground/5'
                    }
                >
                    <DiamondPlus className="h-4 w-4 text-white" />
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Sub Bab</DialogTitle>
                </DialogHeader>

                <Form
                    {...BusinessProcessController.storeNode.form()}
                    className="space-y-6"
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="parent_id"
                                defaultValue={node?.id}
                            />
                            <input
                                type="hidden"
                                name="level"
                                defaultValue={2}
                            />
                            <input
                                type="hidden"
                                name="group_owner"
                                defaultValue={groupOwnerId}
                            />

                            <div className="space-y-4 rounded-lg border p-4">
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
                                        Bab
                                    </label>
                                    <input
                                        name="code"
                                        defaultValue={
                                            node ? (node?.code.split('.')[0] + '.') : ''
                                        }
                                        className="w-full rounded border p-2"
                                    />
                                    <InputError message={errors.code} />
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

                                <Button type="submit">
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
