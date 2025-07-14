import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { getUserDataForExport } from "@/lib/database";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLoading } from "@/components/common/PageLoading";
import { LoadingButton } from "@/components/common/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Download, Trash2, History } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuthCheck();
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Form states
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user?.email) {
      setNewEmail(user.email);
    }
  }, [user]);

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === user?.email) return;
    
    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) throw error;
      
      toast({
        title: "Email Update Requested",
        description: "Please check both your old and new email addresses for confirmation links.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Get all user data in a single optimized query
      const { data, error } = await getUserDataForExport(user.id);
      
      if (error) throw error;
      
      const exportData = {
        profile: { email: user.email },
        questionnaire_responses: data || [],
        exported_at: new Date().toISOString()
      };
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `career_questionnaire_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your data has been downloaded as a JSON file.",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      // Delete user's data first
      await supabase.from('recommendations').delete().eq('user_id', user.id);
      await supabase.from('questionnaire_responses').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('user_id', user.id);
      
      // Delete the auth user
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (isLoading) {
    return <PageLoading message="Loading your profile..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-8 py-8 max-w-4xl">
        <PageHeader
          title="Account Settings"
          subtitle="Manage your account information and preferences."
          onBack={() => navigate("/")}
          rightContent={
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/history")}
                className="text-muted-foreground hover:text-foreground font-normal"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button
                onClick={() => navigate("/questionnaire")}
                className="bg-primary text-primary-foreground px-4 py-2 text-sm font-normal rounded-lg transition-all duration-200 hover:bg-primary/90"
              >
                Take Quiz
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Settings */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-normal text-foreground mb-6">
              Email Settings
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-email">Current Email</Label>
                <Input
                  id="current-email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                />
              </div>
              <LoadingButton
                onClick={handleUpdateEmail}
                isLoading={isUpdatingEmail}
                disabled={!newEmail || newEmail === user?.email}
                loadingText="Updating..."
                className="w-full bg-primary text-primary-foreground px-4 py-2 text-sm font-normal rounded-lg transition-all duration-200 hover:bg-primary/90"
              >
                Update Email
              </LoadingButton>
            </div>
          </div>

          {/* Password Settings */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-normal text-foreground mb-6">
              Password Settings
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <LoadingButton
                onClick={handleUpdatePassword}
                isLoading={isUpdatingPassword}
                disabled={!newPassword || newPassword !== confirmPassword}
                loadingText="Updating..."
                className="w-full bg-primary text-primary-foreground px-4 py-2 text-sm font-normal rounded-lg transition-all duration-200 hover:bg-primary/90"
              >
                Update Password
              </LoadingButton>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="border border-border rounded-lg p-6 mt-8">
          <h2 className="text-xl font-normal text-foreground mb-6">
            Data Management
          </h2>
          <div className="space-y-6">
            {/* Export Data */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h3 className="font-normal text-foreground">Export Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download all your questionnaire responses and recommendations as a JSON file.
                </p>
              </div>
              <LoadingButton
                variant="outline"
                onClick={handleExportData}
                isLoading={isExporting}
                loadingText="Exporting..."
                className="border border-border text-foreground hover:bg-muted px-4 py-2 text-sm font-normal rounded-lg transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </LoadingButton>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
              <div>
                <h3 className="font-normal text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={isDeletingAccount}
                    className="bg-destructive text-destructive-foreground px-4 py-2 text-sm font-normal rounded-lg transition-all duration-200 hover:bg-destructive/90"
                  >
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers, including:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>All questionnaire responses</li>
                        <li>All career recommendations</li>
                        <li>Your profile information</li>
                        <li>Your account access</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <LoadingButton
                      onClick={handleDeleteAccount}
                      isLoading={isDeletingAccount}
                      loadingText="Deleting..."
                      variant="destructive"
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </LoadingButton>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;