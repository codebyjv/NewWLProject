export interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: "blue" | "green" | "purple" | "red" | "amber";
    isLoading?: boolean;
    alert?: boolean;
}

export interface TopProductsProps {
    products: {
        id: string;
        name: string;
        material: "aco_inox_f1" | "aco_inox_m1" | "ferro_fundido_m1";
        weight: string;
        stock_quantity: number;
        min_stock: number;
    }[];
    isLoading?: boolean;
}