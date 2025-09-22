import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface SimplePaymentTrackerProps {
  totalAmount: number;
  paidAmount: number;
  status: string;
}

const SimplePaymentTracker = ({ totalAmount, paidAmount, status }: SimplePaymentTrackerProps) => {
  const progressPercentage = (paidAmount / totalAmount) * 100;
  const remainingAmount = totalAmount - paidAmount;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Simple Progress */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment Progress</span>
            <span className="font-medium">₹{paidAmount.toLocaleString()} / ₹{totalAmount.toLocaleString()}</span>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {progressPercentage >= 100 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-orange-600" />
              )}
              <span className="text-sm">
                {progressPercentage >= 100 ? "Payment Complete" : "Payment Pending"}
              </span>
            </div>
            
            {remainingAmount > 0 && (
              <Badge variant="outline" className="text-xs">
                ₹{remainingAmount.toLocaleString()} pending
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplePaymentTracker;