import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { RecentTransactions } from "@/components/RecentTransactions";
import { Wallet, TrendingUp, Lock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Corporate Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your carbon credits, staking, and compliance reports
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total CVT Holdings"
              value="0"
              subtitle="≈ $0.00 USD"
              icon={Wallet}
            />
            <StatCard
              title="Staked CVT"
              value="0"
              subtitle="0% of holdings"
              icon={Lock}
            />
            <StatCard
              title="Current Yield"
              value="0%"
              subtitle="Annual Percentage Yield"
              icon={TrendingUp}
            />
            <StatCard
              title="Pending Rewards"
              value="0 CVT"
              subtitle="≈ $0.00 USD"
              icon={Award}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Staking Card */}
            <Card className="shadow-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Staking Overview</CardTitle>
                <CardDescription>Manage your staked CVT tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Staked Progress</span>
                    <span className="font-medium text-foreground">0 / 0 CVT</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Staked</p>
                    <p className="text-2xl font-bold text-foreground">0 CVT</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Available to Stake</p>
                    <p className="text-2xl font-bold text-foreground">0 CVT</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 gradient-primary">
                    Stake More
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Unstake
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Card */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Compliance</CardTitle>
                <CardDescription>ESG & ZK proof reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm font-medium text-foreground">ESG Status</span>
                    <span className="text-sm font-semibold text-muted-foreground">Not verified</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm font-medium text-foreground">ZK Proof</span>
                    <span className="text-sm font-semibold text-muted-foreground">Inactive</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm font-medium text-foreground">Last Report</span>
                    <span className="text-sm text-muted-foreground">Never</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <RecentTransactions />
        </div>
      </main>
      </div>
    </div>
  );
};

export default Index;
