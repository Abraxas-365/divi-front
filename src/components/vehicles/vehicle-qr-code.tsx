import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface VehicleQRCodeProps {
  vehicleId: string;
  baseUrl: string;
  size?: number;
  className?: string;
}

export function VehicleQRCode({
  vehicleId,
  baseUrl,
  size = 160,
  className,
}: VehicleQRCodeProps) {
  const url = `${baseUrl}/api/v1/vehicles/${vehicleId}/preview`;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="rounded-xl border bg-white p-3 shadow-sm">
        <QRCodeSVG value={url} size={size} level="M" />
      </div>
      <span className="text-xs text-muted-foreground">Escanear para verificar</span>
    </div>
  );
}
