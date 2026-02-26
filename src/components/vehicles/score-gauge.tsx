import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-500";
  if (score >= 40) return "text-amber-500";
  return "text-red-500";
}

function getStrokeColor(score: number): string {
  if (score >= 70) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function getTrackColor(score: number): string {
  if (score >= 70) return "rgba(16,185,129,0.12)";
  if (score >= 40) return "rgba(245,158,11,0.12)";
  return "rgba(239,68,68,0.12)";
}

const sizes = {
  sm: { size: 64, stroke: 5, text: "text-sm", label: "text-[10px]" },
  md: { size: 96, stroke: 6, text: "text-2xl", label: "text-xs" },
  lg: { size: 140, stroke: 8, text: "text-4xl", label: "text-sm" },
};

export function ScoreGauge({
  score,
  size = "md",
  label,
  className,
}: ScoreGaugeProps) {
  const config = sizes[size];
  const radius = (config.size - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className="relative" style={{ width: config.size, height: config.size }}>
        <svg
          width={config.size}
          height={config.size}
          viewBox={`0 0 ${config.size} ${config.size}`}
          className="-rotate-90"
        >
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke={getTrackColor(score)}
            strokeWidth={config.stroke}
          />
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor(score)}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold tabular-nums", config.text, getScoreColor(score))}>
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className={cn("font-medium text-muted-foreground", config.label)}>
          {label}
        </span>
      )}
    </div>
  );
}

interface ScoreBreakdownProps {
  overall: number;
  exterior: number;
  interior: number;
  mechanical: number;
  tires: number;
}

export function ScoreBreakdown({
  overall,
  exterior,
  interior,
  mechanical,
  tires,
}: ScoreBreakdownProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-start sm:gap-8">
      <ScoreGauge score={overall} size="lg" label="General" />
      <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-5">
        <ScoreGauge score={exterior} size="sm" label="Exterior" />
        <ScoreGauge score={interior} size="sm" label="Interior" />
        <ScoreGauge score={mechanical} size="sm" label="Mec\u00e1nica" />
        <ScoreGauge score={tires} size="sm" label="Neum\u00e1ticos" />
      </div>
    </div>
  );
}
