import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import GroupOwnerController from '@/actions/App/Http/Controllers/GroupOwnerController';
import { Input } from '@/components/ui/input';

export default function EditableGroupOwnerName({
    groupOwnerName,
}: {
    groupOwnerName: string;
}) {
    const [value, setValue] = useState(groupOwnerName);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!editing) {
            setValue(groupOwnerName);
        }
    }, [groupOwnerName, editing]);

    const submit = () => {
        const trimmed = value.trim();

        if (!trimmed || trimmed === groupOwnerName) {
            setEditing(false);
            setValue(groupOwnerName);
            return;
        }

        router.put(
            GroupOwnerController.changeName(),
            { name: trimmed },
            {
                preserveScroll: true,
                onFinish: () => setEditing(false),
                onSuccess: () => window.location.reload()
            }
        );
    };

    if (!editing) {
        return (
            <div
                className="cursor-pointer select-none text-md  text-foreground hover:underline"
                title="Click to rename"
                onClick={() => setEditing(true)}
            >
                {groupOwnerName}
            </div>
        );
    }

    return (
        <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={submit}
            onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') {
                    setValue(groupOwnerName);
                    setEditing(false);
                }
            }}
            className="w-64 rounded border px-2 text-md "
        />
    );
}
