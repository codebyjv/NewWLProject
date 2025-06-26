import React from "react";

import { StatsCardProps } from "@/types/dashboardProps";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AlertTriangle } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, color, isLoading, alert }: StatsCardProps) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    red: "text-red-600 bg-red-100",
    amber: "text-amber-600 bg-amber-100"
  };

  colorClasses[color as keyof typeof colorClasses] ?? "bg-gray-100 text-gray-600";

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${alert ? 'ring-2 ring-red-200 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <p className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-gray-900'}`}>
              {value}
            </p>
          </div>
          {alert && (
            <AlertTriangle className="w-5 h-5 text-red-500 ml-auto" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}