export interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: "blue" | "green" | "purple" | "red" | "amber";
    isLoading?: boolean;
    alert?: boolean;
}