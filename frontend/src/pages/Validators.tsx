import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, CheckCircle2, XCircle, Clock, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProofSubmission {
  id: string;
  projectId: string;
  emissionData: string;
  status: "pending" | "verified" | "rejected";
  reward: string;
  date: string;
}

const submissions: ProofSubmission[] = [];

const statusConfig = {
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  verified: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Verified" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
};

const Validators = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Proof Submitted",
      description: "Your verification proof has been submitted for review",
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 lg:p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Validator Dashboard
              </h1>
              <p className="text-muted-foreground">
                Submit verification proofs and track your rewards
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Submit Proof Form */}
              <Card className="shadow-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>Submit Verification Proof</CardTitle>
                  <CardDescription>
                    Upload project documentation and emission data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectId">Project ID</Label>
                      <Input
                        id="projectId"
                        placeholder="e.g., PRJ-2024-001"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emissionData">Emission Data (tCO2e)</Label>
                      <Input
                        id="emissionData"
                        type="number"
                        placeholder="e.g., 1250"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentation">Documentation</Label>
                      <Textarea
                        id="documentation"
                        placeholder="Provide project details and verification methodology..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Upload Supporting Files</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-smooth cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, CSV, or JSON files
                        </p>
                      </div>
                    </div>

                    <Button type="submit" className="w-full gradient-primary">
                      Submit Proof
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Reward Tracker */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Reward Tracker</CardTitle>
                  <CardDescription>Your validation earnings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">0 CVT</p>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Verified Proofs</span>
                      <span className="text-sm font-semibold text-foreground">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <span className="text-sm font-semibold text-muted-foreground">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="text-sm font-semibold text-muted-foreground">0%</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" disabled>
                    Claim Rewards
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Submission History */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Track your proof verification status</CardDescription>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No submissions yet</p>
                    <p className="text-sm text-muted-foreground">Submit your first verification proof above</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project ID</TableHead>
                        <TableHead>Emission Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reward</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => {
                        const config = statusConfig[submission.status];
                        const StatusIcon = config.icon;
                        
                        return (
                          <TableRow key={submission.id}>
                            <TableCell className="font-medium">
                              {submission.projectId}
                            </TableCell>
                            <TableCell>{submission.emissionData}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={config.bg}>
                                <StatusIcon className={`mr-1 h-3 w-3 ${config.color}`} />
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {submission.reward}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(submission.date).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Validators;
