"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface BudgetStatusProps {
  estimatedCost: number;
  budget: number;
  status: "within_budget" | "over_budget";
}

export function BudgetStatus({
  estimatedCost,
  budget,
  status,
}: BudgetStatusProps) {
  const isWithinBudget = status === "within_budget";

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Estimated Cost:</span>
          <span className="text-lg font-semibold">
            ₹{estimatedCost.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Your Budget:</span>
          <span className="text-lg font-semibold">
            ₹{budget.toLocaleString()}
          </span>
        </div>

        <div className="pt-2">
          <Badge
            variant={isWithinBudget ? "default" : "destructive"}
            className="w-full justify-center py-1.5 text-sm"
          >
            {isWithinBudget ? "✓ Within Budget" : "⚠ Over Budget"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
