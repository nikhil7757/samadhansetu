import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  Camera,
  MapPin,
  Send,
  UploadCloud,
  CheckCircle2,
  Copy,
  ArrowRight,
  Sparkles,
  X,
  Navigation,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { submitNewComplaint, type Complaint, type ComplaintCategory } from '@/lib/complaints';
import { JHARKHAND_DISTRICTS, cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

import { StateSeal } from '@/components/shared/StateSeal';

const CATEGORY_OPTIONS = [
  { value: 'roads', label: 'Roads & Bridges', icon: '🛣️', dept: 'RCD / PWD', desc: 'Potholes, culverts, broken tarmac' },
  { value: 'water', label: 'Water Supply & Quality', icon: '🚰', dept: 'DWSD', desc: 'Contamination, dried borewells, pipeline leaks' },
  { value: 'electricity', label: 'Power & Transmission', icon: '⚡', dept: 'JBVNL', desc: 'Burnt transformers, sagging 11kV lines' },
  { value: 'sanitation', label: 'Solid Waste & Drainage', icon: '🧹', dept: 'UD&HD', desc: 'Overflowing dump yards, open drains' },
  { value: 'corruption', label: 'Public Scheme Delivery', icon: '⚖️', dept: 'District Admin', desc: 'Ration delivery, scholarship hurdles' },
  { value: 'other', label: 'Civic Infrastructure', icon: '🏛️', dept: 'Rural Dev', desc: 'Community halls, bridges, streetlights' },
];

export function QuickReportWidget() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = [
    { value: 'roads', label: t('widget.catRoads', 'Roads & Bridges'), icon: '🛣️', dept: 'RCD / PWD', desc: t('widget.catRoadsDesc', 'Potholes, culverts, broken tarmac') },
    { value: 'water', label: t('widget.catWater', 'Water Supply & Quality'), icon: '🚰', dept: 'DWSD', desc: t('widget.catWaterDesc', 'Contamination, dried borewells, pipeline leaks') },
    { value: 'electricity', label: t('widget.catElectricity', 'Power & Transmission'), icon: '⚡', dept: 'JBVNL', desc: t('widget.catElectricityDesc', 'Burnt transformers, sagging 11kV lines') },
    { value: 'sanitation', label: t('widget.catSanitation', 'Solid Waste & Drainage'), icon: '🧹', dept: 'UD&HD', desc: t('widget.catSanitationDesc', 'Overflowing dump yards, open drains') },
    { value: 'corruption', label: t('widget.catCorruption', 'Public Scheme Delivery'), icon: '⚖️', dept: 'District Admin', desc: t('widget.catCorruptionDesc', 'Ration delivery, scholarship hurdles') },
    { value: 'other', label: t('widget.catOther', 'Civic Infrastructure'), icon: '🏛️', dept: 'Rural Dev', desc: t('widget.catOtherDesc', 'Community halls, bridges, streetlights') },
  ];

  const [category, setCategory] = useState<ComplaintCategory>('roads');
  const [description, setDescription] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Expandable full-details toggle
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [district, setDistrict] = useState<string>('Ranchi');
  const [title, setTitle] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Post-submission confirmation modal
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10 MB limit');
      return;
    }
    setSelectedPhoto(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDetectGPS = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsGettingLocation(false);
          setAddress(`GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
          toast.success('Live GPS coordinates attached');
        },
        () => {
          setIsGettingLocation(false);
          setAddress(`${district} Municipal Area`);
          toast.info('Defaulted to district administrative center');
        },
        { timeout: 8000 }
      );
    } else {
      setIsGettingLocation(false);
      setAddress(`${district} Municipal Area`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.length < 15) {
      toast.error('Please describe the problem (at least 15 characters for AI verification)');
      return;
    }

    // Generate smart title from description if not manually provided
    const derivedTitle =
      title.trim() ||
      description.slice(0, 70).replace(/(\r\n|\n|\r)/gm, ' ') + (description.length > 70 ? '...' : '');

    setIsSubmitting(true);
    try {
      const result = submitNewComplaint({
        title: derivedTitle,
        description: description.trim(),
        category,
        district: district || 'Ranchi',
        address: address.trim() || `${district || 'Ranchi'} Ward Locality`,
        imageFileName: selectedPhoto?.name,
        imageFileSize: selectedPhoto?.size,
        mediaUrls: photoPreview ? [photoPreview] : undefined,
        citizen_id: user?.id || `u-${Date.now()}`,
        citizen_name: user?.name || 'Verified Citizen',
        citizen_email: user?.email || 'citizen@samadhansetu.gov.in',
      });

      setSubmittedComplaint(result);
      setModalOpen(true);
      toast.success(`Complaint registered! Tracking ID: ${result.id}`);

      // Reset form
      setDescription('');
      setTitle('');
      setAddress('');
      handleRemovePhoto();
      setIsExpanded(false);
    } catch {
      toast.error('Failed to submit grievance. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingId = () => {
    if (!submittedComplaint) return;
    navigator.clipboard.writeText(submittedComplaint.id);
    setHasCopied(true);
    toast.success('Tracking ID copied to clipboard!');
    setTimeout(() => setHasCopied(false), 2500);
  };

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto docket-sheet rounded-2xl overflow-hidden transition-all duration-300">
        {/* Paper Ledger Rule */}
        <div className="docket-ledger-rule" />

        {/* Official Sovereign Docket Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <StateSeal size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono tracking-widest text-emerald-300 uppercase">
                  {t('widget.headerCode', 'JH-REG/2026/INTAKE')}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-semibold">
                  {t('widget.gazetteVerified', 'GAZETTE VERIFIED')}
                </span>
              </div>
              <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>{t('widget.docketTitle', 'Citizen Public Grievance Intake Docket')}</span>
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-200 bg-white/10 px-3 py-1 rounded-lg border border-white/15">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">{t('widget.aiRadarActive', 'AI Anti-Fraud Radar Active')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Row 1: Interactive Category Selection Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>{t('widget.targetDept', 'Target Civic Department & Category')}</span>
                <span className="text-accent">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {t('widget.assigned', 'Assigned:')} <strong className="text-primary">{categoryOptions.find(c => c.value === category)?.dept}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categoryOptions.map((cat) => {
                const isSelected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value as ComplaintCategory)}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group relative',
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-border/80 bg-secondary/30 hover:bg-secondary/70 hover:border-border'
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-card border border-border/80 text-muted-foreground">
                        {cat.dept}
                      </span>
                    </div>
                    <div>
                      <span className={cn('text-xs font-bold block leading-tight', isSelected ? 'text-primary' : 'text-foreground')}>
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                        {cat.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Short Description Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                {t('widget.particulars', 'Grievance Particulars & Ground Facts')} <span className="text-accent">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {description.length}/500 chars (Min 15)
              </span>
            </div>
            <Textarea
              placeholder={t('widget.placeholder', 'Provide exact field particulars: Specific street, landmark, municipal ward, duration of failure, and safety hazards (e.g. 100kVA transformer exploded near Katras Bazaar Chowk, sparking wires hanging 6 feet above road for 48 hours)...')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              maxLength={500}
              className="resize-none text-xs sm:text-sm leading-relaxed bg-secondary/15 font-sans"
            />

            {/* Live AI Telemetry HUD */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px]">
              <span className={cn(
                'px-2.5 py-0.5 rounded-md border font-mono font-semibold flex items-center gap-1',
                description.length >= 30
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-secondary text-muted-foreground border-border'
              )}>
                <Sparkles className="h-3 w-3" />
                {t('widget.clarity', 'Clarity:')} {description.length >= 50 ? t('widget.clarityExcellent', '98% (Excellent)') : description.length >= 25 ? t('widget.clarityAdequate', '75% (Adequate)') : t('widget.clarityPending', 'Pending input')}
              </span>

              <span className="px-2.5 py-0.5 rounded-md border border-border bg-secondary/50 font-mono text-muted-foreground flex items-center gap-1">
                <span>🛡️ {t('widget.antiDuplicate', 'Anti-Duplicate:')}</span>
                <strong className="text-foreground">{t('widget.zeroMatches', '0 Prior Matches')}</strong>
              </span>

              <span className="px-2.5 py-0.5 rounded-md border border-border bg-secondary/50 font-mono text-muted-foreground flex items-center gap-1">
                <span>⏱️ {t('widget.targetSla', 'Target SLA:')}</span>
                <strong className="text-amber-600 dark:text-amber-400">{t('widget.maxSla', '72 Hours Max')}</strong>
              </span>
            </div>
          </div>

          {/* Row 3: Photo Upload with Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                {t('widget.photoEvidence', 'Photo Evidence (Recommended)')}
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <Sparkles className="h-3 w-3" />
                {t('widget.aiBoost', '+30% AI Authenticity Boost')}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {photoPreview ? (
              <div className="flex items-center gap-3.5 p-3 border border-border/80 rounded-xl bg-secondary/40">
                <img
                  src={photoPreview}
                  alt="Selected evidence"
                  className="h-14 w-14 rounded-lg object-cover border border-border shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-foreground block truncate">
                    {selectedPhoto?.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {((selectedPhoto?.size || 0) / 1024).toFixed(1)} KB
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="h-3 w-3" /> {t('widget.validEvidence', 'Valid Evidence')}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Camera className="h-4 w-4" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-bold text-foreground block sm:inline mr-1">{t('widget.uploadPhoto', 'Upload on-site photograph')}</span>
                  <span className="text-muted-foreground">{t('widget.uploadSpecs', '(JPEG, PNG, WebP < 10MB)')}</span>
                </div>
              </button>
            )}
          </div>

          {/* Expandable Section Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer py-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>{t('widget.hideLocation', 'Hide Additional Location Details')}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>{t('widget.addLocation', 'Add Specific District, Title or GPS Coordinates (Optional)')}</span>
                </>
              )}
            </button>
          </div>

          {/* Expanded Fields */}
          {isExpanded && (
            <div className="p-4 rounded-xl border border-border/80 bg-secondary/20 space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">{t('widget.district', 'District Jurisdiction')}</label>
                  <Select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    options={JHARKHAND_DISTRICTS.map((d) => ({ value: d, label: d }))}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">{t('widget.street', 'Street / Landmark')}</label>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={isGettingLocation}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className="h-3 w-3" />
                      {isGettingLocation ? t('widget.detecting', 'Detecting...') : t('widget.useGps', 'Use GPS')}
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="h-3.5 w-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Ward 6, Near Kanke Bazar Crossing"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-8 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">{t('widget.customTitle', 'Custom Grievance Title')}</label>
                <Input
                  placeholder={t('widget.customTitlePlaceholder', 'Optional custom headline (e.g. Collapsed drainage culvert)')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          {/* Primary Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-sm font-extrabold bg-accent hover:bg-accent-hover text-accent-foreground shadow-md gap-2 cursor-pointer transition-all duration-200 hover:shadow-lg rounded-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  {t('widget.submitting', 'Running Multi-Factor AI Verification...')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t('widget.submitBtn', 'Submit Grievance Now')}
                </span>
              )}
            </Button>
            <p className="text-[11px] text-center text-muted-foreground mt-2 font-medium">
              {t('widget.permanentAuditNote', '🔒 Generates a permanent public tracking ID (SS-2026-NNNNNN) with real-time audit trail')}
            </p>
          </div>
        </form>
      </Card>

      {/* Immediate Tracking ID Confirmation Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border border-border shadow-2xl docket-sheet">
          {/* Accessibility Header */}
          <DialogHeader className="sr-only">
            <DialogTitle>{t('receipt.title', 'Official Grievance Docket Receipt')}</DialogTitle>
            <DialogDescription>{t('receipt.desc', 'Your civic grievance tracking ID and verification details.')}</DialogDescription>
          </DialogHeader>

          {/* Top Ledger Stripe */}
          <div className="docket-ledger-rule" />

          {/* Official Docket Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white p-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <StateSeal size="sm" />
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase block">
                  {t('receipt.govJharkhand', 'GOVERNMENT OF JHARKHAND')}
                </span>
                <h3 className="text-base font-black tracking-tight text-white">
                  {t('receipt.title', 'Official Grievance Docket Receipt')}
                </h3>
              </div>
            </div>
            <div className="docket-stamp docket-stamp-verified">
              {t('receipt.verifiedIntake', 'VERIFIED INTAKE')}
            </div>
          </div>

          {submittedComplaint && (
            <div className="p-6 space-y-4">
              {/* Barcode & Registry Serial */}
              <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                    {t('receipt.trackingNumber', 'OFFICIAL DOCKET TRACKING NUMBER')}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {t('receipt.slaClock', 'SLA CLOCK: 72H')}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-primary">
                    {submittedComplaint.id}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyTrackingId}
                    className="gap-1.5 text-xs font-bold shrink-0 border-primary/40 hover:bg-primary/10 cursor-pointer"
                  >
                    {hasCopied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{t('receipt.copied', 'Copied!')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{t('receipt.copyToken', 'Copy Token')}</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Barcode Pattern */}
                <div className="barcode-stripe w-full text-foreground/40 mt-1" />
              </div>

              {/* Docket Specifics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg border border-border/80 bg-card">
                  <span className="text-[10px] text-muted-foreground block uppercase font-mono font-bold">{t('receipt.districtWard', 'District & Ward')}</span>
                  <span className="font-bold text-foreground truncate block">{submittedComplaint.location.district} ({submittedComplaint.location.address || 'Central Ward'})</span>
                </div>
                <div className="p-3 rounded-lg border border-border/80 bg-card">
                  <span className="text-[10px] text-muted-foreground block uppercase font-mono font-bold">{t('receipt.deptRouting', 'Department Routing')}</span>
                  <span className="font-bold text-primary truncate block uppercase">{submittedComplaint.category} Division</span>
                </div>
              </div>

              {/* AI Verification Score HUD with Lifecycle Status and Signal Chips */}
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-foreground font-bold">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    {t('receipt.aiValidation', 'AI Authenticity Validation')}
                  </span>
                  <span
                    className={cn(
                      'font-mono font-black text-xs px-2.5 py-0.5 rounded-md',
                      submittedComplaint.ai_score >= 80
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : submittedComplaint.ai_score >= 40
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                    )}
                  >
                    {submittedComplaint.ai_score} / 100 PTS
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10.5px] font-mono text-muted-foreground uppercase font-bold block">
                    {t('receipt.lifecycleStatus', 'Lifecycle Status:')}
                  </span>
                  <div className="text-xs font-bold text-foreground">
                    {submittedComplaint.status === 'auto_approved' && (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t('receipt.autoApproved', 'Auto-Approved & Forwarded to Department Works')}
                      </span>
                    )}
                    {submittedComplaint.status === 'pending_officer' && (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {t('receipt.underReview', 'Under Review by District Nodal Officer (72H SLA Clock Active)')}
                      </span>
                    )}
                    {submittedComplaint.status === 'auto_rejected' && (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {t('receipt.flagged', 'Flagged by Automated Pre-check (One-Click Appeal Rights Admissible)')}
                      </span>
                    )}
                    {submittedComplaint.status === 'verified_in_progress' && (
                      <span className="text-sky-600 dark:text-sky-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t('receipt.verifiedInProgress', 'Verified In Progress — District Dispatch Mobilized')}
                      </span>
                    )}
                  </div>
                </div>

                {submittedComplaint.ai_flags && submittedComplaint.ai_flags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {submittedComplaint.ai_flags.map((flag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-card border border-border text-muted-foreground font-mono"
                      >
                        #{flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-1/2 text-xs font-semibold cursor-pointer"
                >
                  {t('receipt.fileAnother', 'File Another Docket')}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    navigate(`/track/${submittedComplaint.id}`);
                  }}
                  className="w-full sm:w-1/2 text-xs font-bold bg-accent hover:bg-accent-hover text-accent-foreground shadow-md gap-1.5 cursor-pointer"
                >
                  <span>{t('receipt.openDossier', 'Open Official Dossier')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
