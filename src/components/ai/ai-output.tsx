import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type AIOutputProps = {
    title: string;
    description: string;
    isLoading: boolean;
    output?: React.ReactNode;
    hasRun: boolean;
};

export function AIOutput({ title, description, isLoading, output, hasRun }: AIOutputProps) {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="sr-only">Generating...</span>
                    </div>
                ) : hasRun && output ? (
                    output
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Your results will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
