import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { EquipmentDTO } from "@/domains/vehicles/types";

interface EquipmentListProps {
  equipment: Pick<EquipmentDTO, "category" | "feature_name" | "is_standard" | "source">[];
}

export function EquipmentList({ equipment }: EquipmentListProps) {
  if (equipment.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Package className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-muted-foreground">
            Sin datos de equipamiento
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Haz clic en &quot;Enriquecer&quot; para obtener especificaciones y equipamiento con IA.
          </p>
        </div>
      </div>
    );
  }

  const grouped = equipment.reduce<
    Record<string, typeof equipment>
  >((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="grid gap-5">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h4 className="mb-2.5 text-sm font-semibold capitalize">
            {category.replace(/_/g, " ")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Badge
                key={item.feature_name}
                variant={item.is_standard ? "secondary" : "outline"}
              >
                {item.feature_name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
