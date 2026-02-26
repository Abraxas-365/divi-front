import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Pencil, X, AlertTriangle } from "lucide-react";
import type {
  FindingDTO,
  FindingSeverity,
  UpdateFindingRequest,
} from "@/domains/vehicles/types";

const severityVariant: Record<FindingSeverity, "warning" | "destructive" | "info"> = {
  minor: "info",
  moderate: "warning",
  major: "destructive",
};

const severityLabels: Record<FindingSeverity, string> = {
  minor: "Leve",
  moderate: "Moderado",
  major: "Grave",
};

interface FindingsListProps {
  findings: FindingDTO[];
  onUpdate: (findingId: string, data: UpdateFindingRequest) => void;
  isUpdating?: boolean;
}

export function FindingsList({
  findings,
  onUpdate,
  isUpdating,
}: FindingsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<UpdateFindingRequest>({});

  if (findings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <AlertTriangle className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-muted-foreground">
            Sin hallazgos detectados
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Ejecuta una inspecci&oacute;n para analizar las fotos.
          </p>
        </div>
      </div>
    );
  }

  function startEdit(finding: FindingDTO) {
    setEditingId(finding.id);
    setEditData({
      severity: finding.severity,
      description: finding.description,
      confirmed_by_human: finding.confirmed_by_human,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  function saveEdit(findingId: string) {
    onUpdate(findingId, editData);
    setEditingId(null);
    setEditData({});
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Zona</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Severidad</TableHead>
            <TableHead className="min-w-[200px]">Descripci&oacute;n</TableHead>
            <TableHead>Confianza IA</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {findings.map((finding) => {
            const isEditing = editingId === finding.id;

            return (
              <TableRow key={finding.id}>
                <TableCell className="capitalize">
                  {finding.zone.replace(/_/g, " ")}
                </TableCell>
                <TableCell className="capitalize">
                  {finding.finding_type.replace(/_/g, " ")}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editData.severity}
                      onValueChange={(v) =>
                        setEditData({ ...editData, severity: v as FindingSeverity })
                      }
                    >
                      <SelectTrigger className="h-8 w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Leve</SelectItem>
                        <SelectItem value="moderate">Moderado</SelectItem>
                        <SelectItem value="major">Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={severityVariant[finding.severity]}>
                      {severityLabels[finding.severity]}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editData.description ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                      className="h-8"
                    />
                  ) : (
                    <span className="text-sm">{finding.description}</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {Math.round(finding.ai_confidence * 100)}%
                  </span>
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Button
                      variant={editData.confirmed_by_human ? "default" : "outline"}
                      size="xs"
                      onClick={() =>
                        setEditData({
                          ...editData,
                          confirmed_by_human: !editData.confirmed_by_human,
                        })
                      }
                    >
                      {editData.confirmed_by_human ? "S\u00ed" : "No"}
                    </Button>
                  ) : finding.confirmed_by_human ? (
                    <Badge variant="success">Confirmado</Badge>
                  ) : (
                    <Badge variant="secondary">Pendiente</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => saveEdit(finding.id)}
                        disabled={isUpdating}
                      >
                        <Check className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={cancelEdit}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => startEdit(finding)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
