import { useState, DragEvent } from "react";
import { UploadCloud } from "lucide-react";

export default function FileDropzone({
    onFileSelect,
}: {
    onFileSelect: (file: File | null) => void;
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");

    const isActive = isDragging 

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file);
        }
    };

    const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) setFileName(file.name);
        onFileSelect(file);
    };

    return (
        <div
            className={`
                border border-border border-dashed rounded-xl p-10 text-center
                cursor-pointer transition-all duration-200 ease-out

                bg-muted/30
                hover:bg-muted/40

                ${isDragging ? "bg-accent/30 border-accent" : ""}
                ${fileName ? "hover:bg-accent/20" : ""}
            `}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("hiddenFileInput")?.click()}
        >
            <UploadCloud
                className={`
                    mx-auto mb-4 h-14 w-14 transition-all duration-200
                    ${isActive ? "text-accent" : "text-muted-foreground"}
                `}
            />

            <p
                className={`
                    text-lg transition-colors duration-200
                    ${isActive ? "text-accent-foreground" : "text-foreground"}
                `}
            >
                Drop files or click here
            </p>

            {/* <div className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md shadow cursor-pointer mt-3">
                <span className="mr-2">📁</span>
                Choose File
            </div> */}

            <input
                id="hiddenFileInput"
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={handleFilePick}
            />

            {fileName && (
                <p className="mt-4 text-sm text-muted-foreground transition-opacity duration-200">
                    {fileName}
                </p>
            )}
        </div>
    );
}
