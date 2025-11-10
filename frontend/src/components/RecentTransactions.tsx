import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Lock, Gift } from "lucide-react";

interface Transaction {
  id: string;
  type: "buy" | "sell" | "stake" | "reward";
  amount: string;
  timestamp: string;
  status: "completed" | "pending";
}

const transactions: Transaction[] = [];

const typeConfig = {
  buy: { icon: ArrowDownRight, color: "text-success", bg: "bg-success/10" },
  sell: { icon: ArrowUpRight, color: "text-secondary", bg: "bg-secondary/10" },
  stake: { icon: Lock, color: "text-warning", bg: "bg-warning/10" },
  reward: { icon: Gift, color: "text-primary", bg: "bg-primary/10" },
};

export function RecentTransactions() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest CVT activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Gift className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">No transactions yet</p>
              <p className="text-xs text-muted-foreground">Your transaction history will appear here</p>
            </div>
          ) : (
            transactions.map((transaction) => {
              const config = typeConfig[transaction.type];
              const Icon = config.icon;
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-smooth"
                >
                  <div className={`h-10 w-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground capitalize">
                      {transaction.type}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{transaction.amount}</p>
                    <Badge
                      variant={transaction.status === "completed" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
