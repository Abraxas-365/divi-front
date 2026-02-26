import { useCallback, useRef, useState } from "react";
import { Upload, Camera, ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PhotoDTO, PhotoZone } from "@/domains/vehicles/types";

const ZONES: { value: PhotoZone; label: string }[] = [
  { value: "front", label: "Frontal" },
  { value: "rear", label: "Trasera" },
  { value: "left", label: "Lateral Izq." },
  { value: "right", label: "Lateral Der." },
  { value: "front_left", label: "Frontal Izq." },
  { value: "rear_right", label: "Trasera Der." },
  { value: "interior_driver", label: "Int. Conductor" },
  { value: "interior_passenger", label: "Int. Pasajero" },
  { value: "interior_rear", label: "Int. Trasero" },
  { value: "dashboard", label: "Tablero" },
  { value: "infotainment", label: "Pantalla" },
  { value: "engine", label: "Motor" },
  { value: "trunk", label: "Maletero" },
  { value: "closeup", label: "Detalle" },
];

interface PhotoUploadProps {
  vehicleId: string;
  photos: PhotoDTO[];
  onUpload: (vehicleId: string, zone: PhotoZone, file: File) => void;
  isUploading?: boolean;
  backendUrl: string;
}

export function PhotoUpload({
  vehicleId,
  photos,
  onUpload,
  isUploading,
  backendUrl,
}: PhotoUploadProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {ZONES.map((zone) => {
        const photo = photos.find((p) => p.zone === zone.value);
        return (
          <PhotoSlot
            key={zone.value}
            zone={zone}
            photo={photo}
            vehicleId={vehicleId}
            onUpload={onUpload}
            isUploading={isUploading}
            backendUrl={backendUrl}
          />
        );
      })}
    </div>
  );
}

interface PhotoSlotProps {
  zone: { value: PhotoZone; label: string };
  photo?: PhotoDTO;
  vehicleId: string;
  onUpload: (vehicleId: string, zone: PhotoZone, file: File) => void;
  isUploading?: boolean;
  backendUrl: string;
}

function PhotoSlot({
  zone,
  photo,
  vehicleId,
  onUpload,
  isUploading,
  backendUrl,
}: PhotoSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(vehicleId, zone.value, file);
        e.target.value = "";
      }
    },
    [vehicleId, zone.value, onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onUpload(vehicleId, zone.value, file);
      }
    },
    [vehicleId, zone.value, onUpload],
  );

  return (
    <div
      className={cn(
        "group relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200",
        photo
          ? "border-transparent shadow-sm"
          : isDragging
            ? "border-primary bg-primary/5 shadow-md"
            : "border-muted-foreground/20 bg-muted/30 hover:border-primary/40 hover:bg-muted/50",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {photo ? (
        <>
          <img
            src={`${backendUrl}/uploads/${photo.photo_url}`}
            alt={zone.label}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2 pt-6">
            <span className="text-xs font-semibold tracking-wide text-white">
              {zone.label}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              className="shadow-lg"
              onClick={() => inputRef.current?.click()}
            >
              <Camera className="mr-1.5 size-3.5" />
              Cambiar
            </Button>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : isDragging ? (
            <ImagePlus className="size-6" />
          ) : (
            <Upload className="size-5" />
          )}
          <span className="text-xs font-medium">{zone.label}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export { ZONES };
