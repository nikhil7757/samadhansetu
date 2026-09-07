import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { KeyRound, Mail, LogIn, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'CITIZEN') {
        navigate('/my/submissions');
      } else {
        navigate('/problems');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || t('auth.login.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('Test@1234');
    setIsSubmitting(true);
    try {
      const user = await login(quickEmail, 'Test@1234');
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'CITIZEN') {
        navigate('/my/submissions');
      } else {
        navigate('/problems');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || t('auth.login.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12 bg-secondary/20">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-border/80 shadow-lg specular-card rounded-2xl bg-card">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs border border-primary/20">
              <LogIn className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold">{t('auth.login.title')}</CardTitle>
            <CardDescription className="text-xs">{t('auth.login.subtitle')}</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  {t('auth.login.email')}
                </label>
                <Input
                  type="email"
                  placeholder="name@organization.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                  {t('auth.login.password')}
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-2 rounded-xl font-bold" disabled={isSubmitting}>
                {isSubmitting ? t('common.loading') : t('auth.login.submit')}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex flex-col space-y-4 pt-2 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground">
              {t('auth.login.noAccount')}{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                {t('auth.login.signupLink')}
              </Link>
            </p>

            {/* Demo Quick-Fill Accounts with 1-Click Instant Login */}
            <div className="w-full pt-3 border-t border-dashed border-border/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-foreground tracking-wide flex items-center gap-1">
                  ⚡ 1-Click Instant Login (Select Role)
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Password: Test@1234</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleQuickLogin('admin@samadhansetu.gov.in')}
                  className="px-2.5 py-2 rounded-xl text-[11px] bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all border border-primary/20 text-left flex flex-col gap-0.5 cursor-pointer disabled:opacity-50 hover:shadow-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="font-bold truncate">Nodal Admin</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">Govt. of Jharkhand</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleQuickLogin('priya.kumar@gmail.com')}
                  className="px-2.5 py-2 rounded-lg text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium transition-all border border-emerald-500/20 text-left flex flex-col gap-0.5 cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold truncate">Citizen</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">Dhanbad Submitter</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleQuickLogin('iit.ism.team@gmail.com')}
                  className="px-2.5 py-2 rounded-lg text-[11px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-medium transition-all border border-sky-500/20 text-left flex flex-col gap-0.5 cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span className="font-bold truncate">University Solver</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">IIT (ISM) Dhanbad</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleQuickLogin('tata.steel.csr@gmail.com')}
                  className="px-2.5 py-2 rounded-lg text-[11px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium transition-all border border-amber-500/20 text-left flex flex-col gap-0.5 cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span className="font-bold truncate">Industry CSR</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate">Tata Steel CSR</span>
                </button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
