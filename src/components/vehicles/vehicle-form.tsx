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

const vehicleSchema = z.object({
  brand: z.string().min(1, "La marca es obligatoria"),
  model: z.string().min(1, "El modelo es obligatorio"),
  version: z.string().optional(),
  trim: z.string().optional(),
  year: z.number().min(1900).max(2100),
  mileage_km: z.number().min(0),
  plate: z.string().optional(),
  color_exterior: z.string().optional(),
  color_interior: z.string().optional(),
  price_usd: z.number().min(0).optional(),
  branch: z.string().optional(),
  origin: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormValues>;
  onSubmit: (data: VehicleFormValues) => void;
  isPending?: boolean;
  submitLabel?: string;
}

function NumberInput({
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> & {
  value: number | undefined;
  onChange: (val: number | undefined) => void;
}) {
  return (
    <Input
      type="number"
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.valueAsNumber;
        onChange(Number.isNaN(v) ? undefined : v);
      }}
      {...props}
    />
  );
}

export function VehicleForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Crear Veh\u00edculo",
}: VehicleFormProps) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: "",
      model: "",
      version: "",
      trim: "",
      year: new Date().getFullYear(),
      mileage_km: 0,
      plate: "",
      color_exterior: "",
      color_interior: "",
      price_usd: undefined,
      branch: "",
      origin: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input placeholder="Corolla" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versi&oacute;n</FormLabel>
                <FormControl>
                  <Input placeholder="SE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acabado</FormLabel>
                <FormControl>
                  <Input placeholder="Premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>A&ntilde;o</FormLabel>
                <FormControl>
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mileage_km"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kilometraje</FormLabel>
                <FormControl>
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input placeholder="ABC-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price_usd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (USD)</FormLabel>
                <FormControl>
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    placeholder="22000"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color_exterior"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Exterior</FormLabel>
                <FormControl>
                  <Input placeholder="Blanco" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color_interior"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Interior</FormLabel>
                <FormControl>
                  <Input placeholder="Negro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sucursal</FormLabel>
                <FormControl>
                  <Input placeholder="Principal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origen</FormLabel>
                <FormControl>
                  <Input placeholder="Jap\u00f3n" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Guardando...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </Form>
  );
}
