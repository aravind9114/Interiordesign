"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Cpu } from "lucide-react";
import type { Provider } from "@/types";

interface ProviderInfoProps {
  provider: Provider;
  timeTaken: number;
}

export function ProviderInfo({ provider, timeTaken }: ProviderInfoProps) {
  const providerLabels: Record<Provider, string> = {
    offline: "Offline (Local GPU)",
    replicate: "Replicate",
    hf: "HuggingFace",
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Cpu className="h-4 w-4" />
            Provider:
          </span>
          <Badge variant="outline">{providerLabels[provider]}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Generation Time:
          </span>
          <span className="text-sm font-semibold">{timeTaken.toFixed(1)}s</span>
        </div>
      </div>
    </Card>
  );
}
