import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  KeyRound,
  Mail,
  LogIn,
  ArrowRight,
  Shield,
  Building2,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth';
import { DemoAccountPicker } from '@/components/shared/DemoAccountPicker';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loginWithGoogle, sendPasswordReset, completeMfaSignIn, mfaResolver } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // 2FA state
  const [isMfaPromptOpen, setIsMfaPromptOpen] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  // Password Reset state
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const redirectByUserRole = (user: any) => {
    if (user.role === 'INNOVATION_SOCIETY_ADMIN') {
      navigate('/admin');
    } else if (user.role === 'DEPARTMENT_USER') {
      navigate('/my/submissions');
    } else if (user.role === 'STARTUP') {
      navigate('/challenges');
    } else if (user.role === 'EVALUATOR') {
      navigate('/admin');
    } else if (user.role === 'VALIDATOR') {
      navigate('/track');
    } else {
      navigate('/challenges');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      redirectByUserRole(user);
    } catch (err: any) {
      if (err.message === 'MFA_REQUIRED') {
        setIsMfaPromptOpen(true);
        toast.info('Two-Factor Authentication required for this account.');
      } else {
        toast.error(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      const user = await loginWithGoogle('STARTUP');
      toast.success(`Google Sign-In Successful! Welcome, ${user.name}`);
      redirectByUserRole(user);
    } catch (err: any) {
      if (err.message === 'MFA_REQUIRED') {
        setIsMfaPromptOpen(true);
        toast.info('Two-Factor Authentication required for this account.');
      } else {
        toast.error(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length !== 6) {
      toast.error('Please enter the 6-digit TOTP code');
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await completeMfaSignIn(mfaCode.trim());
      setIsMfaPromptOpen(false);
      toast.success(`MFA verified. Welcome, ${user.name}!`);
      redirectByUserRole(user);
    } catch (err: any) {
      toast.error(err.message || 'Invalid 2FA verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    setIsResetting(true);
    try {
      await sendPasswordReset(resetEmail);
      toast.success('Password reset email dispatched. Check your inbox.');
      setIsResetDialogOpen(false);
      setResetEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Could not send password reset email');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12 bg-secondary/20">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="border-border/80 shadow-2xl rounded-2xl bg-card specular-card overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-4 border-b border-border/60">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shadow-xs border border-accent/30 glow-saffron">
              <LogIn className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold font-heading">
              {t('auth.login.title', 'Sign In to SamadhanSetu')}
            </CardTitle>
            <CardDescription className="text-xs max-w-md mx-auto">
              Innovation Procurement & Pilot Management Platform • Government of Maharashtra (MSInS)
            </CardDescription>
          </CardHeader>

          {/* 1-Click Demo Accounts for Hackathon Judges & Evaluators */}
          <div className="p-4 sm:p-6 bg-secondary/30 border-b border-border/60">
            <DemoAccountPicker
              onSuccess={(role) => {
                if (role === 'INNOVATION_SOCIETY_ADMIN' || role === 'EVALUATOR') navigate('/admin');
                else if (role === 'DEPARTMENT_USER') navigate('/my/submissions');
                else if (role === 'VALIDATOR') navigate('/track');
                else navigate('/challenges');
              }}
            />
          </div>

          {isMfaPromptOpen ? (
            /* 2FA Verification View */
            <form onSubmit={handleMfaSubmit}>
              <CardContent className="space-y-4 pt-6">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
                  <ShieldCheck className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-xs font-semibold text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-digit code from your authenticator app (Google Authenticator, Microsoft Authenticator).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">6-Digit Verification Code</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="font-mono text-center text-xl tracking-widest h-12"
                    autoFocus
                    required
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting || mfaCode.length !== 6} className="w-full">
                  {isSubmitting ? 'Verifying 2FA...' : 'Verify and Sign In'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  onClick={() => setIsMfaPromptOpen(false)}
                >
                  Cancel
                </Button>
              </CardFooter>
            </form>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                    Or Sign In with Official Email
                  </span>
                  <span className="text-[10px] text-muted-foreground">Production Gateway</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {t('auth.login.email', 'Email Address')}
                    </label>
                    <Input
                      type="email"
                      placeholder="officer@maharashtra.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                        {t('auth.login.password', 'Password')}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setIsResetDialogOpen(true);
                        }}
                        className="text-[11px] text-accent hover:underline font-medium cursor-pointer"
                      >
                        Forgot?
                      </button>
                    </div>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 font-bold gap-2 cursor-pointer bg-primary hover:bg-primary-hover text-primary-foreground"
                  >
                    {isSubmitting ? 'Authenticating...' : t('auth.login.submit', 'Sign In with Email')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* Google Federated Sign-in */}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isGoogleSubmitting}
                    onClick={handleGoogleSignIn}
                    className="w-full h-10 gap-2 font-medium cursor-pointer border-border hover:bg-secondary/60"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    {isGoogleSubmitting ? 'Connecting Google...' : 'Continue with Google'}
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between py-4 px-6 border-t border-border/60 bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  New to SamadhanSetu?
                </span>
                <Link to="/signup" className="text-xs text-accent hover:underline font-bold">
                  {t('auth.login.signupLink', 'Register as Startup or Department')} &rarr;
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>

        {/* Informational Security Callout */}
        <div className="rounded-xl border border-border bg-card/60 p-4 text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Lock className="h-4 w-4 text-accent" />
            <span>Cryptographically Verified Role-Based Access Control</span>
          </div>
          <p className="leading-relaxed">
            SamadhanSetu enforces Firebase Custom Claims and server-verified sessions. Department officials, startup founders, evaluators, and validators receive cryptographically signed access tokens verified at every API boundary.
          </p>
        </div>
      </div>

      {/* Password Reset Modal */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Reset Password</DialogTitle>
            <DialogDescription className="text-xs">
              Enter your registered official or startup email address. A secure recovery link will be sent immediately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <Input
                type="email"
                placeholder="name@organization.in"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsResetDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isResetting}>
                {isResetting ? 'Sending Link...' : 'Send Recovery Link'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
