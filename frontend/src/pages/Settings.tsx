import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Bell,
  Shield,
  Key,
  Palette,
  Database,
  Wallet,
  Code,
  Download,
  Upload,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useDisconnect } from "wagmi";
import { useSettings, useTheme, useAPIKeys, useSecurityScore } from "@/hooks/useSettings";
import {
  exportSettings,
  importSettings,
  exportAllData,
  clearAllData,
  calculateStorageUsage,
  formatBytes,
  validateEmail,
  validateWebhookURL,
} from "@/services/settingsService";

const Settings = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { settings, updateSettings, updateLocal, save, reset, hasUnsavedChanges } = useSettings();
  const { theme, setTheme } = useTheme();
  const { apiKeys, generateKey, revokeKey, deleteKey } = useAPIKeys();
  const { score: securityScore, scoreColor, scoreLabel } = useSecurityScore();

  // Local state
  const [showAPIKey, setShowAPIKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState("");

  const storageUsage = calculateStorageUsage();

  // Handle profile update
  const handleProfileUpdate = () => {
    updateSettings('profile', settings.profile);
  };

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof settings.notifications) => {
    updateSettings('notifications', {
      ...settings.notifications,
      [key]: !settings.notifications[key],
    });
  };

  // Handle security toggle
  const handleSecurityToggle = (key: keyof typeof settings.security) => {
    if (typeof settings.security[key] === 'boolean') {
      updateSettings('security', {
        ...settings.security,
        [key]: !settings.security[key],
      });
    }
  };

  // Handle wallet settings
  const handleWalletUpdate = () => {
    updateSettings('wallet', settings.wallet);
  };

  // Handle API settings
  const handleAPIUpdate = () => {
    if (settings.api.webhookUrl && !validateWebhookURL(settings.api.webhookUrl)) {
      toast({
        title: "Invalid Webhook URL",
        description: "Please enter a valid HTTP or HTTPS URL.",
        variant: "destructive",
      });
      return;
    }
    updateSettings('api', settings.api);
  };

  // Handle appearance update
  const handleAppearanceUpdate = () => {
    setTheme(settings.appearance.theme);
    updateSettings('appearance', settings.appearance);
  };

  // Handle privacy update
  const handlePrivacyUpdate = () => {
    updateSettings('privacy', settings.privacy);
  };

  // Handle advanced update
  const handleAdvancedUpdate = () => {
    updateSettings('advanced', settings.advanced);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard.",
    });
  };

  // Generate new API key
  const handleGenerateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the API key.",
        variant: "destructive",
      });
      return;
    }

    generateKey(newKeyName, ['read', 'write']);
    setNewKeyName("");
    setCreateKeyDialogOpen(false);
  };

  // Export settings
  const handleExportSettings = () => {
    const data = exportSettings();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbon-vault-settings-${Date.now()}.json`;
    a.click();
    
    toast({
      title: "Settings Exported",
      description: "Your settings have been downloaded.",
    });
  };

  // Import settings
  const handleImportSettings = () => {
    const success = importSettings(importData);
    
    if (success) {
      window.location.reload(); // Reload to apply settings
      toast({
        title: "Settings Imported",
        description: "Your settings have been restored.",
      });
    } else {
      toast({
        title: "Import Failed",
        description: "Invalid settings file.",
        variant: "destructive",
      });
    }
    
    setImportDialogOpen(false);
    setImportData("");
  };

  // Export all data
  const handleExportAllData = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbon-vault-data-${Date.now()}.json`;
    a.click();
    
    toast({
      title: "Data Exported",
      description: "All your data has been downloaded.",
    });
  };

  // Clear all data
  const handleClearAllData = () => {
    clearAllData();
    toast({
      title: "Data Cleared",
      description: "All application data has been removed.",
    });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account and application preferences
              </p>
              </div>
              {hasUnsavedChanges && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Discard
                  </Button>
                  <Button className="gradient-primary" onClick={save}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="gap-2">
                  <Key className="h-4 w-4" />
                  <span className="hidden sm:inline">API</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="gap-2">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-2">
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Advanced</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          placeholder="Your name"
                          value={settings.profile.displayName}
                          onChange={(e) =>
                            updateLocal('profile', { displayName: e.target.value })
                          }
                        />
                      </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                      <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={settings.profile.email}
                          onChange={(e) =>
                            updateLocal('profile', { email: e.target.value })
                          }
                      />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                      <Input
                          id="company"
                          placeholder="Your company"
                          value={settings.profile.company}
                          onChange={(e) =>
                            updateLocal('profile', { company: e.target.value })
                          }
                      />
                    </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={settings.profile.role}
                          onValueChange={(value) =>
                            updateLocal('profile', { role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="validator">Validator</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleProfileUpdate} className="gradient-primary">
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Connected Wallet */}
                {isConnected && (
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Connected Wallet</CardTitle>
                      <CardDescription>Your currently connected wallet address</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-mono text-sm font-medium">{address}</p>
                        </div>
                        <Button variant="outline" onClick={() => disconnect()}>
                          Disconnect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Choose what notifications you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about completed transactions
                        </p>
                      </div>
                        <Switch
                          checked={settings.notifications.transactionAlerts}
                          onCheckedChange={() =>
                            handleNotificationToggle('transactionAlerts')
                          }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Staking Rewards</Label>
                        <p className="text-sm text-muted-foreground">
                          Alerts when you earn staking rewards
                        </p>
                      </div>
                        <Switch
                          checked={settings.notifications.stakingRewards}
                          onCheckedChange={() =>
                            handleNotificationToggle('stakingRewards')
                          }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketplace Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          New listings matching your preferences
                        </p>
                      </div>
                        <Switch
                          checked={settings.notifications.marketplaceUpdates}
                          onCheckedChange={() =>
                            handleNotificationToggle('marketplaceUpdates')
                          }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compliance Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Reports and verification deadlines
                        </p>
                      </div>
                        <Switch
                          checked={settings.notifications.complianceReminders}
                          onCheckedChange={() =>
                            handleNotificationToggle('complianceReminders')
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Validator Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Proof verification and reward notifications
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.validatorUpdates}
                          onCheckedChange={() =>
                            handleNotificationToggle('validatorUpdates')
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Price Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            CVT price changes and market updates
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.priceAlerts}
                          onCheckedChange={() =>
                            handleNotificationToggle('priceAlerts')
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border space-y-4">
                      <h3 className="font-medium">Delivery Methods</h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.emailNotifications}
                          onCheckedChange={() =>
                            handleNotificationToggle('emailNotifications')
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Browser push notifications
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.pushNotifications}
                          onCheckedChange={() =>
                            handleNotificationToggle('pushNotifications')
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Weekly Digest</Label>
                          <p className="text-sm text-muted-foreground">
                            Summary of your activity every week
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.weeklyDigest}
                          onCheckedChange={() =>
                            handleNotificationToggle('weeklyDigest')
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Security Settings
                        </CardTitle>
                    <CardDescription>
                      Manage your account security and authentication
                    </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Security Score</p>
                        <p className={`text-2xl font-bold ${scoreColor}`}>
                          {securityScore}/100
                        </p>
                        <Badge variant="outline">{scoreLabel}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                        <Switch
                          checked={settings.security.twoFactorEnabled}
                          onCheckedChange={() =>
                            handleSecurityToggle('twoFactorEnabled')
                          }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Biometric Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Use fingerprint or face recognition
                        </p>
                      </div>
                        <Switch
                          checked={settings.security.biometricEnabled}
                          onCheckedChange={() =>
                            handleSecurityToggle('biometricEnabled')
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto Logout</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically log out after inactivity
                          </p>
                        </div>
                        <Switch
                          checked={settings.security.autoLogout}
                          onCheckedChange={() => handleSecurityToggle('autoLogout')}
                        />
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Input
                        type="number"
                        min="5"
                        max="1440"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          updateLocal('security', {
                            sessionTimeout: parseInt(e.target.value),
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Session will expire after {settings.security.sessionTimeout} minutes
                        of inactivity
                      </p>
                    </div>

                    <Button
                      onClick={() => updateSettings('security', settings.security)}
                      className="gradient-primary"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Update Security
                    </Button>
                  </CardContent>
                </Card>

                {/* Security Score Progress */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Security Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={securityScore} className="h-3 mb-4" />
                    <div className="space-y-2 text-sm">
                      {!settings.security.twoFactorEnabled && (
                        <p className="text-warning">
                          • Enable two-factor authentication for better security
                        </p>
                      )}
                      {!settings.security.biometricEnabled && (
                        <p className="text-warning">
                          • Enable biometric authentication
                        </p>
                      )}
                      {settings.security.sessionTimeout > 30 && (
                        <p className="text-warning">
                          • Consider reducing session timeout to 30 minutes or less
                        </p>
                      )}
                      {securityScore >= 80 && (
                        <p className="text-success">
                          ✓ Your account has excellent security settings
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wallet Tab */}
              <TabsContent value="wallet" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Wallet Configuration
                    </CardTitle>
                    <CardDescription>
                      Manage your wallet preferences and transaction settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto-approve Transactions</Label>
                          <p className="text-sm text-muted-foreground">
                            Skip confirmation for small transactions
                          </p>
                        </div>
                        <Switch
                          checked={settings.wallet.autoApprove}
                          onCheckedChange={(checked) =>
                            updateLocal('wallet', { autoApprove: checked })
                          }
                        />
                      </div>

                      {settings.wallet.autoApprove && (
                        <div className="space-y-2 pl-4">
                          <Label>Auto-approve Limit (USD)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={settings.wallet.autoApproveLimit}
                            onChange={(e) =>
                              updateLocal('wallet', {
                                autoApproveLimit: parseFloat(e.target.value),
                              })
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Transactions under ${settings.wallet.autoApproveLimit} will be
                            auto-approved
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Balance in USD</Label>
                          <p className="text-sm text-muted-foreground">
                            Display token values in USD
                          </p>
                        </div>
                        <Switch
                          checked={settings.wallet.showBalanceInUSD}
                          onCheckedChange={(checked) =>
                            updateLocal('wallet', { showBalanceInUSD: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Hide Small Balances</Label>
                          <p className="text-sm text-muted-foreground">
                            Hide tokens with value less than $1
                          </p>
                        </div>
                        <Switch
                          checked={settings.wallet.hideSmallBalances}
                          onCheckedChange={(checked) =>
                            updateLocal('wallet', { hideSmallBalances: checked })
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border space-y-4">
                    <div className="space-y-2">
                        <Label>Default Slippage (%)</Label>
                        <Input
                          type="number"
                          min="0.1"
                          max="50"
                          step="0.1"
                          value={settings.wallet.defaultSlippage}
                          onChange={(e) =>
                            updateLocal('wallet', {
                              defaultSlippage: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Gas Preference</Label>
                        <Select
                          value={settings.wallet.gasPreference}
                          onValueChange={(value: any) =>
                            updateLocal('wallet', { gasPreference: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low (Slower)</SelectItem>
                            <SelectItem value="medium">Medium (Balanced)</SelectItem>
                            <SelectItem value="high">High (Faster)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleWalletUpdate} className="gradient-primary">
                      <Save className="mr-2 h-4 w-4" />
                      Save Wallet Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Tab */}
              <TabsContent value="api" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Key className="h-5 w-5" />
                          API Keys
                        </CardTitle>
                        <CardDescription>
                          Manage your API keys for programmatic access
                        </CardDescription>
                      </div>
                      <Dialog
                        open={createKeyDialogOpen}
                        onOpenChange={setCreateKeyDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button>
                            <Key className="mr-2 h-4 w-4" />
                            Create Key
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New API Key</DialogTitle>
                            <DialogDescription>
                              Generate a new API key for your application
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Key Name</Label>
                              <Input
                                placeholder="My Application"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setCreateKeyDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleGenerateKey}>Generate Key</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {apiKeys.length === 0 ? (
                      <div className="text-center py-12">
                        <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">No API Keys</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create your first API key to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {apiKeys.map((key) => (
                          <Card key={key.id} className="border">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{key.name}</h4>
                                    <Badge variant={key.active ? "default" : "secondary"}>
                                      {key.active ? "Active" : "Revoked"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                                      {showAPIKey === key.id
                                        ? key.key
                                        : key.key.replace(/./g, '•')}
                                    </code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setShowAPIKey(
                                          showAPIKey === key.id ? null : key.id
                                        )
                                      }
                                    >
                                      {showAPIKey === key.id ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(key.key, key.id)}
                                    >
                                      {copiedKey === key.id ? (
                                        <Check className="h-4 w-4 text-success" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Created {new Date(key.createdAt).toLocaleDateString()}
                                    {key.lastUsed &&
                                      ` • Last used ${new Date(
                                        key.lastUsed
                                      ).toLocaleDateString()}`}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {key.active && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => revokeKey(key.id)}
                                    >
                                      Revoke
                                    </Button>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. Applications using
                                          this key will stop working.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteKey(key.id)}
                                          className="bg-destructive text-destructive-foreground"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Webhook Settings */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Webhook Configuration</CardTitle>
                    <CardDescription>
                      Receive real-time updates about your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        placeholder="https://your-domain.com/webhook"
                        value={settings.api.webhookUrl}
                        onChange={(e) =>
                          updateLocal('api', { webhookUrl: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        POST requests will be sent to this URL for events
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>API Access Enabled</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow programmatic access to your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.api.enabled}
                        onCheckedChange={(checked) =>
                          updateLocal('api', { enabled: checked })
                        }
                      />
                    </div>

                    <Button onClick={handleAPIUpdate} className="gradient-primary">
                      <Save className="mr-2 h-4 w-4" />
                      Save API Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Appearance Settings
                    </CardTitle>
                    <CardDescription>
                      Customize the look and feel of the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select
                        value={settings.appearance.theme}
                        onValueChange={(value: any) =>
                          updateLocal('appearance', { theme: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select
                        value={settings.appearance.fontSize}
                        onValueChange={(value: any) =>
                          updateLocal('appearance', { fontSize: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Reduce spacing and padding
                          </p>
                        </div>
                        <Switch
                          checked={settings.appearance.compactMode}
                          onCheckedChange={(checked) =>
                            updateLocal('appearance', { compactMode: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Animations</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable smooth transitions and animations
                          </p>
                        </div>
                        <Switch
                          checked={settings.appearance.showAnimations}
                          onCheckedChange={(checked) =>
                            updateLocal('appearance', { showAnimations: checked })
                          }
                        />
                      </div>
                    </div>

                    <Button onClick={handleAppearanceUpdate} className="gradient-primary">
                      <Save className="mr-2 h-4 w-4" />
                      Apply Appearance
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Privacy & Data
                    </CardTitle>
                    <CardDescription>
                      Manage your privacy settings and data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Share Analytics</Label>
                          <p className="text-sm text-muted-foreground">
                            Help us improve by sharing usage data
                          </p>
                        </div>
                        <Switch
                          checked={settings.privacy.shareAnalytics}
                          onCheckedChange={(checked) =>
                            updateLocal('privacy', { shareAnalytics: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Activity</Label>
                          <p className="text-sm text-muted-foreground">
                            Display your activity to other users
                          </p>
                        </div>
                        <Switch
                          checked={settings.privacy.showActivity}
                          onCheckedChange={(checked) =>
                            updateLocal('privacy', { showActivity: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Public Profile</Label>
                          <p className="text-sm text-muted-foreground">
                            Make your profile visible to everyone
                          </p>
                        </div>
                        <Switch
                          checked={settings.privacy.publicProfile}
                          onCheckedChange={(checked) =>
                            updateLocal('privacy', { publicProfile: checked })
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border space-y-4">
                      <h3 className="font-medium">Data Management</h3>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                        <div>
                          <p className="font-medium">Storage Usage</p>
                          <p className="text-sm text-muted-foreground">
                            {formatBytes(storageUsage.used)} of{' '}
                            {formatBytes(storageUsage.total)} used
                          </p>
                        </div>
                        <Progress value={storageUsage.percentage} className="w-32" />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExportSettings}>
                          <Download className="mr-2 h-4 w-4" />
                          Export Settings
                        </Button>
                        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Upload className="mr-2 h-4 w-4" />
                              Import Settings
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Import Settings</DialogTitle>
                              <DialogDescription>
                                Paste your exported settings JSON
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              rows={10}
                              placeholder="Paste settings JSON here..."
                              value={importData}
                              onChange={(e) => setImportData(e.target.value)}
                            />
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setImportDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleImportSettings}>Import</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" onClick={handleExportAllData}>
                          <Download className="mr-2 h-4 w-4" />
                          Export All Data
                        </Button>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear All Data
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                              Clear All Data?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all your local data including
                              settings, watchlists, reports, and submissions. This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleClearAllData}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Clear All Data
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <Button onClick={handlePrivacyUpdate} className="gradient-primary">
                      <Save className="mr-2 h-4 w-4" />
                      Save Privacy Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6">
                <Card className="shadow-card border-warning/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Advanced Settings
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-warning">
                      <AlertTriangle className="h-4 w-4" />
                      For advanced users only. Incorrect settings may cause issues.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Developer Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable developer tools and debugging
                          </p>
                        </div>
                        <Switch
                          checked={settings.advanced.developerMode}
                          onCheckedChange={(checked) =>
                            updateLocal('advanced', { developerMode: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Testnet</Label>
                          <p className="text-sm text-muted-foreground">
                            Display testnet networks in wallet
                          </p>
                        </div>
                        <Switch
                          checked={settings.advanced.showTestnet}
                          onCheckedChange={(checked) =>
                            updateLocal('advanced', { showTestnet: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Debug Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Show detailed error messages and logs
                          </p>
                        </div>
                        <Switch
                          checked={settings.advanced.debugMode}
                          onCheckedChange={(checked) =>
                            updateLocal('advanced', { debugMode: checked })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Custom RPC URL</Label>
                      <Input
                        placeholder="https://your-rpc-endpoint.com"
                        value={settings.advanced.customRPC}
                        onChange={(e) =>
                          updateLocal('advanced', { customRPC: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Use a custom RPC endpoint (leave empty for default)
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset All Settings
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reset All Settings?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reset all settings to their default values. Your
                              data will not be affected.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={reset}>
                              Reset Settings
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <Button onClick={handleAdvancedUpdate} className="gradient-primary">
                      <Save className="mr-2 h-4 w-4" />
                      Save Advanced Settings
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
