import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  UserPlus,
  Rocket,
  GraduationCap,
  Building2,
  MapPin,
  Building,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { MAHARASHTRA_DISTRICTS, cn } from '@/lib/utils';
import { useAuth, type UserRole } from '@/lib/auth';
import { DemoAccountPicker } from '@/components/shared/DemoAccountPicker';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const [role, setRole] = useState<UserRole>('STARTUP');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [district, setDistrict] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

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
      toast.error('Please enter your Startup / Entity name & DPIIT recognition number');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await signup({
        name,
        email,
        password,
        role,
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
      toast.error(err.response?.data?.error || t('auth.signup.error', 'Registration failed. Please check details.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleSubmitting(true);
    try {
      const user = await loginWithGoogle(role, {
        name: name || undefined,
        email: email || undefined,
        organizationName: organizationName || (role === 'STARTUP' ? 'Registered Maharashtra Startup' : undefined),
        district: district || 'Pune',
      });
      toast.success(`Google Registration Successful! Welcome, ${user.name}`);
      if (user.role === 'DEPARTMENT_USER') {
        navigate('/report');
      } else if (user.role === 'STARTUP') {
        navigate('/problems');
      } else {
        navigate('/admin/approvals');
      }
    } catch (err: any) {
      toast.error(err.message || 'Google registration could not be completed.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12 bg-secondary/20">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="border-border/80 shadow-2xl specular-card rounded-2xl bg-card overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-4 border-b border-border/60">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shadow-xs border border-accent/30 glow-saffron">
              <UserPlus className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold font-heading">
              {t('auth.signup.title', 'Register on SamadhanSetu')}
            </CardTitle>
            <CardDescription className="text-xs max-w-md mx-auto">
              Join Maharashtra's Sovereign Public Procurement & Startup Pilot Gateway
            </CardDescription>
          </CardHeader>

          {/* Quick 1-Click Demo Accounts for Hackathon Judges */}
          <div className="p-4 sm:p-5 bg-secondary/30 border-b border-border/60">
            <DemoAccountPicker compact />
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-6">
              {/* Role Selection Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  {t('auth.signup.role', 'Select Your Primary Role')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('STARTUP')}
                    className={cn(
                      'p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer',
                      role === 'STARTUP'
                        ? 'border-accent bg-accent/10 ring-1 ring-accent shadow-xs'
                        : 'border-border bg-card hover:bg-secondary/60'
                    )}
                  >
                    <Rocket className={cn('h-5 w-5 mb-2', role === 'STARTUP' ? 'text-accent' : 'text-muted-foreground')} />
                    <div>
                      <span className="text-xs font-bold block text-foreground">
                        Eligible Startup
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                        DPIIT startups pitching novel tech
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('DEPARTMENT_USER')}
                    className={cn(
                      'p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer',
                      role === 'DEPARTMENT_USER'
                        ? 'border-accent bg-accent/10 ring-1 ring-accent shadow-xs'
                        : 'border-border bg-card hover:bg-secondary/60'
                    )}
                  >
                    <Building2 className={cn('h-5 w-5 mb-2', role === 'DEPARTMENT_USER' ? 'text-accent' : 'text-muted-foreground')} />
                    <div>
                      <span className="text-xs font-bold block text-foreground">
                        Govt. Department
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                        Post civic challenges & fund pilots
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('EVALUATOR')}
                    className={cn(
                      'p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer',
                      role === 'EVALUATOR'
                        ? 'border-accent bg-accent/10 ring-1 ring-accent shadow-xs'
                        : 'border-border bg-card hover:bg-secondary/60'
                    )}
                  >
                    <GraduationCap className={cn('h-5 w-5 mb-2', role === 'EVALUATOR' ? 'text-accent' : 'text-muted-foreground')} />
                    <div>
                      <span className="text-xs font-bold block text-foreground">
                        Expert Panelist
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                        Evaluate & score startup proposals
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Fast Google Sign-up Action */}
              <div className="p-3 rounded-xl border border-border/80 bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block font-heading">
                      Fast Registration with Google
                    </span>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      Instantly links your verified Google account as a {role.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isGoogleSubmitting}
                  onClick={handleGoogleSignUp}
                  className="w-full sm:w-auto h-8 px-4 font-bold text-xs gap-1.5 cursor-pointer border-accent/40 text-foreground hover:bg-accent hover:text-accent-foreground shrink-0"
                >
                  {isGoogleSubmitting ? 'Registering...' : 'Sign Up with Google'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-semibold">Or fill form manually</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    {t('auth.signup.name', 'Full Name / Authorized Signatory')}
                  </label>
                  <Input
                    placeholder="e.g. Dr. Ramesh Patil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {t('auth.signup.email', 'Email Address')}
                  </label>
                  <Input
                    type="email"
                    placeholder="officer@organization.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    {t('auth.signup.password', 'Password')}
                  </label>
                  <Input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {t('auth.signup.district', 'Maharashtra District')}
                  </label>
                  <Select
                    options={districtOptions}
                    placeholder={t('auth.signup.districtPlaceholder', 'Select District')}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Entity / DPIIT details for startups and departments */}
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                  {role === 'STARTUP'
                    ? 'Startup Legal Name & DPIIT Number *'
                    : role === 'DEPARTMENT_USER'
                    ? 'Department / Directorate Name'
                    : 'Institutional Affiliation / Organization'}
                </label>
                <Input
                  placeholder={
                    role === 'STARTUP'
                      ? 'e.g. EcoCatalyst BioTech Pvt Ltd (DPIIT #94821)'
                      : role === 'DEPARTMENT_USER'
                      ? 'e.g. Directorate of Information Technology (DIT)'
                      : 'e.g. Veermata Jijabai Technological Institute (VJTI)'
                  }
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required={role === 'STARTUP'}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 font-bold bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering Account...' : t('auth.signup.submit', 'Complete Official Registration')}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex justify-center py-4 border-t border-border/60 bg-muted/20">
            <p className="text-xs text-muted-foreground">
              {t('auth.signup.hasAccount', 'Already have an account?')}{' '}
              <Link to="/login" className="text-accent font-bold hover:underline">
                {t('auth.signup.loginLink', 'Sign In or use 1-Click Demo')} &rarr;
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
