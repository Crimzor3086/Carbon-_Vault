import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Shield, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  type: "ESG" | "ZK Proof" | "Transaction History";
  date: string;
  status: "ready" | "generating";
  size: string;
}

const reports: Report[] = [];

const Reports = () => {
  const { toast } = useToast();

  const generateReport = (type: string) => {
    toast({
      title: "Generating Report",
      description: `Your ${type} report is being generated...`,
    });
  };

  const downloadReport = (type: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${type} report...`,
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
                Reports & Compliance
              </h1>
              <p className="text-muted-foreground">
                Generate and download compliance reports
              </p>
            </div>

            {/* Report Types */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="shadow-card hover:shadow-hover transition-smooth">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <CardTitle>ESG Compliance</CardTitle>
                  <CardDescription>
                    Environmental, Social, and Governance reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => generateReport("ESG Compliance")}
                    className="w-full gradient-primary"
                  >
                    Generate ESG Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-hover transition-smooth">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>ZK Proof Report</CardTitle>
                  <CardDescription>
                    Zero-knowledge verification documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => generateReport("ZK Proof")}
                    className="w-full gradient-primary"
                  >
                    Generate ZK Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-hover transition-smooth">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Complete transaction and activity logs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => generateReport("Transaction History")}
                    className="w-full gradient-primary"
                  >
                    Generate History
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Download previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No reports yet</p>
                    <p className="text-sm text-muted-foreground">Generate your first report using the cards above</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{report.type}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(report.date).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {report.size}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={report.status === "ready" ? "default" : "secondary"}
                          >
                            {report.status === "ready" ? "Ready" : "Generating"}
                          </Badge>
                          {report.status === "ready" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadReport(report.type)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>Current verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        ESG Verified
                      </span>
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-muted-foreground">Inactive</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Not verified yet
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        ZK Proof
                      </span>
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-muted-foreground">Inactive</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      No proof submitted
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Audit Score
                      </span>
                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-muted-foreground">0/100</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Not yet rated
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
