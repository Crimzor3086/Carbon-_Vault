import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account and application preferences
              </p>
            </div>

            <Tabs defaultValue="wallet" className="space-y-6">
              <TabsList>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Wallet Configuration</CardTitle>
                    <CardDescription>
                      Manage your connected wallet and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Connected Wallet</Label>
                      <Input
                        id="walletAddress"
                        value="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="network">Network</Label>
                      <Input
                        id="network"
                        value="Ethereum Mainnet"
                        disabled
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <Label>Auto-approve transactions</Label>
                        <p className="text-sm text-muted-foreground">
                          Skip confirmation for transactions under $100
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <Button onClick={handleSave} className="gradient-primary">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose what notifications you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about completed transactions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Staking Rewards</Label>
                        <p className="text-sm text-muted-foreground">
                          Alerts when you earn staking rewards
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketplace Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          New listings matching your preferences
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compliance Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Reports and verification deadlines
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Button onClick={handleSave} className="gradient-primary">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Biometric Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Use fingerprint or face recognition
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="pt-4 space-y-2">
                      <Label>Session Timeout</Label>
                      <Input
                        type="number"
                        defaultValue="30"
                        placeholder="Minutes"
                      />
                      <p className="text-xs text-muted-foreground">
                        Automatically log out after inactivity
                      </p>
                    </div>

                    <Button onClick={handleSave} className="gradient-primary">
                      Update Security
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>API Configuration</CardTitle>
                    <CardDescription>
                      Manage your API keys and integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id="apiKey"
                          value="cv_sk_••••••••••••••••••••••••"
                          disabled
                        />
                        <Button variant="outline">Regenerate</Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        placeholder="https://your-domain.com/webhook"
                      />
                      <p className="text-xs text-muted-foreground">
                        Receive real-time updates about your account
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <Label>API Access</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable programmatic access to your account
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Button onClick={handleSave} className="gradient-primary">
                      Save API Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
