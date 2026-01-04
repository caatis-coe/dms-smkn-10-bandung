import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Document, User } from '@/types';
import { Download, Eye } from 'lucide-react';

export type FileActionsCellProps = {
    row: Document;
    user: User | null;
    fileType: 'main' | 'supporting';
};

export function FileActionsCell({ row, fileType, user }: FileActionsCellProps) {
    const canDownload = user && (user.role === 'user' || user.role === 'admin') && user.email_verified_by_admin_at;
    const fileUrl =
        fileType === 'supporting' ? row.supporting_file_url : row.file_url;

    const label =
        fileType === 'supporting' ? `${row.name} — Supporting File` : row.name;

    const downloadName =
        (fileType === 'supporting' ? `${row.name} - File Pendukung` : row.name)

    if (!fileUrl) {
        return (
            <span className="text-sm text-muted-foreground italic">
                No file
            </span>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {/* VIEW */}
            <Dialog>
                <DialogTrigger
                    title="Lihat Documen"
                    className="cursor-pointer rounded p-1 transition hover:bg-foreground/5"
                >
                    <Eye className="h-4 w-4 text-icon-view" />
                </DialogTrigger>

                <DialogContent className="flex h-[90vh] max-w-[95vw] flex-col sm:max-w-[90vw]">
                    <DialogHeader>
                        <DialogTitle>{label}</DialogTitle>
                    </DialogHeader>

                    <iframe
                        src={`${fileUrl}#toolbar=0`}
                        className="w-full flex-1 rounded border"
                    />
                </DialogContent>
            </Dialog>

            {/* DOWNLOAD */}
            {canDownload && <a
                href={fileUrl}
                download={downloadName}
                title="Unduh Dokumen"
                className="cursor-pointer rounded p-1 transition hover:bg-foreground/5"
            >
                <Download className="h-4 w-4 text-icon-download" />
            </a>}
        </div>
    );
}
