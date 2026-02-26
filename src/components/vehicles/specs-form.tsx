import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { VehicleSpecsDTO } from "@/domains/vehicles/types";

const specsSchema = z.object({
  engine_type: z.string().optional(),
  engine_cc: z.number().optional(),
  engine_cylinders: z.number().optional(),
  power_hp: z.number().optional(),
  power_kw: z.number().optional(),
  torque_nm: z.number().optional(),
  fuel_type: z.string().optional(),
  transmission_type: z.string().optional(),
  transmission_gears: z.number().optional(),
  drivetrain: z.string().optional(),
  accel_0_100: z.number().optional(),
  top_speed_kmh: z.number().optional(),
  fuel_city_kml: z.number().optional(),
  fuel_highway_kml: z.number().optional(),
  fuel_combined_kml: z.number().optional(),
  fuel_tank_liters: z.number().optional(),
  length_mm: z.number().optional(),
  width_mm: z.number().optional(),
  height_mm: z.number().optional(),
  wheelbase_mm: z.number().optional(),
  cargo_liters: z.number().optional(),
  curb_weight_kg: z.number().optional(),
  tire_size: z.string().optional(),
});

type SpecsFormValues = z.infer<typeof specsSchema>;

interface SpecsFormProps {
  specs: Partial<VehicleSpecsDTO> | null;
  onSubmit: (data: SpecsFormValues) => void;
  isPending?: boolean;
}

const SPEC_GROUPS: {
  title: string;
  fields: { name: keyof SpecsFormValues; label: string; type: "text" | "number" }[];
}[] = [
  {
    title: "Motor",
    fields: [
      { name: "engine_type", label: "Tipo de Motor", type: "text" },
      { name: "engine_cc", label: "Cilindrada (cc)", type: "number" },
      { name: "engine_cylinders", label: "Cilindros", type: "number" },
      { name: "power_hp", label: "Potencia (hp)", type: "number" },
      { name: "power_kw", label: "Potencia (kW)", type: "number" },
      { name: "torque_nm", label: "Torque (Nm)", type: "number" },
      { name: "fuel_type", label: "Combustible", type: "text" },
    ],
  },
  {
    title: "Transmisi\u00f3n",
    fields: [
      { name: "transmission_type", label: "Tipo", type: "text" },
      { name: "transmission_gears", label: "Marchas", type: "number" },
      { name: "drivetrain", label: "Tracci\u00f3n", type: "text" },
    ],
  },
  {
    title: "Rendimiento",
    fields: [
      { name: "accel_0_100", label: "0-100 km/h (s)", type: "number" },
      { name: "top_speed_kmh", label: "Vel. M\u00e1x. (km/h)", type: "number" },
    ],
  },
  {
    title: "Consumo",
    fields: [
      { name: "fuel_city_kml", label: "Ciudad (km/L)", type: "number" },
      { name: "fuel_highway_kml", label: "Carretera (km/L)", type: "number" },
      { name: "fuel_combined_kml", label: "Combinado (km/L)", type: "number" },
      { name: "fuel_tank_liters", label: "Tanque (L)", type: "number" },
    ],
  },
  {
    title: "Dimensiones",
    fields: [
      { name: "length_mm", label: "Largo (mm)", type: "number" },
      { name: "width_mm", label: "Ancho (mm)", type: "number" },
      { name: "height_mm", label: "Alto (mm)", type: "number" },
      { name: "wheelbase_mm", label: "Distancia Ejes (mm)", type: "number" },
      { name: "cargo_liters", label: "Carga (L)", type: "number" },
      { name: "curb_weight_kg", label: "Peso (kg)", type: "number" },
      { name: "tire_size", label: "Neum\u00e1ticos", type: "text" },
    ],
  },
];

export function SpecsForm({ specs, onSubmit, isPending }: SpecsFormProps) {
  const form = useForm<SpecsFormValues>({
    resolver: zodResolver(specsSchema),
    defaultValues: {
      engine_type: specs?.engine_type ?? "",
      engine_cc: specs?.engine_cc ?? undefined,
      engine_cylinders: specs?.engine_cylinders ?? undefined,
      power_hp: specs?.power_hp ?? undefined,
      power_kw: specs?.power_kw ?? undefined,
      torque_nm: specs?.torque_nm ?? undefined,
      fuel_type: specs?.fuel_type ?? "",
      transmission_type: specs?.transmission_type ?? "",
      transmission_gears: specs?.transmission_gears ?? undefined,
      drivetrain: specs?.drivetrain ?? "",
      accel_0_100: specs?.accel_0_100 ?? undefined,
      top_speed_kmh: specs?.top_speed_kmh ?? undefined,
      fuel_city_kml: specs?.fuel_city_kml ?? undefined,
      fuel_highway_kml: specs?.fuel_highway_kml ?? undefined,
      fuel_combined_kml: specs?.fuel_combined_kml ?? undefined,
      fuel_tank_liters: specs?.fuel_tank_liters ?? undefined,
      length_mm: specs?.length_mm ?? undefined,
      width_mm: specs?.width_mm ?? undefined,
      height_mm: specs?.height_mm ?? undefined,
      wheelbase_mm: specs?.wheelbase_mm ?? undefined,
      cargo_liters: specs?.cargo_liters ?? undefined,
      curb_weight_kg: specs?.curb_weight_kg ?? undefined,
      tire_size: specs?.tire_size ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {SPEC_GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {group.title}
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {group.fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: rhfField }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{field.label}</FormLabel>
                      <FormControl>
                        {field.type === "number" ? (
                          <Input
                            type="number"
                            className="h-8 text-sm"
                            value={
                              rhfField.value != null ? String(rhfField.value) : ""
                            }
                            onChange={(e) => {
                              const v = e.target.valueAsNumber;
                              rhfField.onChange(Number.isNaN(v) ? undefined : v);
                            }}
                            onBlur={rhfField.onBlur}
                            name={rhfField.name}
                            ref={rhfField.ref}
                          />
                        ) : (
                          <Input
                            className="h-8 text-sm"
                            {...rhfField}
                            value={(rhfField.value as string) ?? ""}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        ))}
        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Specs"
          )}
        </Button>
      </form>
    </Form>
  );
}
