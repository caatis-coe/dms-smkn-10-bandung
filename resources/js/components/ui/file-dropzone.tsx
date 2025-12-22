import { useRef, useState, DragEvent } from "react";
import { UploadCloud, X } from "lucide-react";

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
};

export default function FileDropzone({
  value,
  onChange,
  accept = "application/pdf",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | null) => {
    onChange(file);
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    handleFile(file);
  };

  return (
    <div
      className={`
        relative border border-dashed rounded-xl p-10 text-center
        cursor-pointer transition-all
        bg-muted/30 hover:bg-muted/40
        ${isDragging ? "border-accent bg-accent/20" : ""}
      `}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* ❌ Cancel Button */}
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleFile(null);
          }}
          className="absolute right-2 top-2 rounded-full bg-background p-1 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <UploadCloud
        className={`mx-auto mb-4 h-14 w-14 ${
          isDragging ? "text-accent" : "text-muted-foreground"
        }`}
      />

      <p className="text-lg">
        {value ? "File selected" : "Drop files or click here"}
      </p>

      {value && (
        <p className="mt-2 text-sm text-muted-foreground truncate">
          {value.name}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) =>
          handleFile(e.target.files?.[0] ?? null)
        }
      />
    </div>
  );
}
