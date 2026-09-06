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

  const handleQuickLogin = (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('Test@1234');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12 bg-secondary/20">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-border shadow-md">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
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

              <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
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

            {/* Demo Quick-Fill Accounts */}
            <div className="w-full pt-3 border-t border-dashed border-border/80">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                {t('auth.login.demoCredentials')}
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-left">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@samadhansetu.gov.in')}
                  className="px-2 py-1.5 rounded text-[11px] bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border/50 text-left flex items-center gap-1 cursor-pointer"
                >
                  <Shield className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate">Nodal Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('priya.kumar@gmail.com')}
                  className="px-2 py-1.5 rounded text-[11px] bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border/50 text-left flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate">Citizen (Dhanbad)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('iit.ism.team@gmail.com')}
                  className="px-2 py-1.5 rounded text-[11px] bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border/50 text-left flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="h-3 w-3 text-sky-600 shrink-0" />
                  <span className="truncate">IIT ISM Solver</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('tata.steel.csr@gmail.com')}
                  className="px-2 py-1.5 rounded text-[11px] bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border/50 text-left flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="h-3 w-3 text-amber-600 shrink-0" />
                  <span className="truncate">Tata Steel CSR</span>
                </button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
