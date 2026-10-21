import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { UserPlus, Rocket, GraduationCap, Building2, MapPin, Building, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { MAHARASHTRA_DISTRICTS, cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState<'STARTUP' | 'DEPARTMENT_USER' | 'EVALUATOR'>('STARTUP');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [district, setDistrict] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const districtOptions = MAHARASHTRA_DISTRICTS.map((d) => ({ value: d, label: d }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !district) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (role === 'STARTUP' && !organizationName.trim()) {
      toast.error('Please enter your Startup / Entity name & DPIIT number');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await signup({
        name,
        email,
        password,
        role: role as any,
        organizationName: organizationName.trim() || undefined,
        district,
      });
      toast.success(`Account registered! Welcome, ${user.name}`);
      if (user.role === 'DEPARTMENT_USER') {
        navigate('/report');
      } else if (user.role === 'STARTUP') {
        navigate('/problems');
      } else {
        navigate('/admin/approvals');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || t('auth.signup.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12 bg-secondary/20">
      <div className="w-full max-w-xl space-y-6">
        <Card className="border-border/80 shadow-lg specular-card rounded-2xl bg-card">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs border border-primary/20">
              <UserPlus className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold">{t('auth.signup.title')}</CardTitle>
            <CardDescription className="text-xs">{t('auth.signup.subtitle')}</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {/* Role Selection Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  {t('auth.signup.role')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('STARTUP')}
                    className={cn(
                      'p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer',
                      role === 'STARTUP'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-secondary/60'
                    )}
                  >
                    <Rocket className={cn('h-5 w-5 mb-2', role === 'STARTUP' ? 'text-primary' : 'text-muted-foreground')} />
                    <div>
                      <span className="text-xs font-bold block text-foreground">
                        Eligible Startup
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                        Pitch solutions & pilot tests
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('DEPARTMENT_USER')}
                    className={cn(
                      'p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer',
                      role === 'DEPARTMENT_USER'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-secondary/60'
                    )}
                  >
                    <Building2 className={cn('h-5 w-5 mb-2', role === 'DEPARTMENT_USER' ? 'text-primary' : 'text-muted-foreground')} />
                    <div>
                      <span className="text-xs font-bold block text-foreground">
                        Govt. Department
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                        Post challenges & pilot needs
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('EVALUATOR')}
                    className={cn(
                      'p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer',
                      role === 'EVALUATOR'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-secondary/60'
                    )}
                  >
                    <GraduationCap className={cn('h-5 w-5 mb-2', role === 'EVALUATOR' ? 'text-primary' : 'text-muted-foreground')} />
                    <div>
                      <span className="text-xs font-bold block text-foreground">
                        Expert Evaluator
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                        Evaluate & validate pilots
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    {t('auth.signup.name')}
                  </label>
                  <Input
                    placeholder="e.g. Dr. Ramesh Soren"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {t('auth.signup.email')}
                  </label>
                  <Input
                    type="email"
                    placeholder="official@domain.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    {t('auth.signup.password')}
                  </label>
                  <Input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {t('auth.signup.district')}
                  </label>
                  <Select
                    options={districtOptions}
                    placeholder={t('auth.signup.districtPlaceholder')}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Conditional Organization Field */}
              {(role === 'UNIVERSITY' || role === 'INDUSTRY') && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    {t('auth.signup.organization')} *
                  </label>
                  <Input
                    placeholder={
                      role === 'UNIVERSITY'
                        ? 'e.g. BIT Mesra, Department of Civil Engineering'
                        : 'e.g. Tata Steel Rural Development Society'
                    }
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">{t('auth.signup.organizationHint')}</p>
                </div>
              )}

              <Button type="submit" className="w-full mt-3" disabled={isSubmitting}>
                {isSubmitting ? t('common.loading') : t('auth.signup.submit')}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex justify-center pt-2 border-t border-border/60">
            <p className="text-xs text-muted-foreground">
              {t('auth.signup.hasAccount')}{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                {t('auth.signup.loginLink')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
