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
} from 'lucide-react';
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
import { JHARKHAND_DISTRICTS } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

const CATEGORY_OPTIONS = [
  { value: 'roads', label: '🛣️ Roads & Bridges (Potholes, Culverts)' },
  { value: 'water', label: '🚰 Water Supply & Quality (Arsenic, Leaks)' },
  { value: 'electricity', label: '⚡ Electricity & Power (Transformers, Cables)' },
  { value: 'sanitation', label: '🧹 Sanitation & Solid Waste (Open Sewage)' },
  { value: 'corruption', label: '⚖️ Public Scheme & Service Redressal' },
  { value: 'other', label: '🏛️ Other Community Infrastructure' },
];

export function QuickReportWidget() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <Card className="w-full max-w-3xl mx-auto border-border shadow-xl rounded-2xl bg-card overflow-hidden transition-all duration-300">
        <div className="bg-gradient-to-r from-primary via-primary-hover to-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
            <h3 className="text-sm font-extrabold tracking-tight uppercase">
              Quick Report — File a Grievance Direct
            </h3>
          </div>
          <span className="text-[11px] font-mono opacity-90 hidden sm:inline">
            ⚡ Automated AI Scoring (0–100) Active
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {/* Row 1: Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Select Grievance Category <span className="text-accent">*</span>
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              options={CATEGORY_OPTIONS}
            />
          </div>

          {/* Row 2: Short Description Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Describe the Problem <span className="text-accent">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                {description.length}/500 characters
              </span>
            </div>
            <Textarea
              placeholder="Explain the issue clearly: What happened? How severe is it? Mention specific landmarks or streets (e.g. Broken water pipeline flooding Katras market road for 3 days)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              maxLength={500}
              className="resize-none text-xs sm:text-sm"
            />
          </div>

          {/* Row 3: Photo Upload with Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Photo Evidence (Recommended)</span>
              <span className="text-[11px] text-emerald-600 font-medium">
                +30% AI Authenticity Boost
              </span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {photoPreview ? (
              <div className="flex items-center gap-3 p-2.5 border rounded-xl bg-secondary/30">
                <img
                  src={photoPreview}
                  alt="Selected evidence"
                  className="h-12 w-12 rounded-lg object-cover border"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-foreground block truncate">
                    {selectedPhoto?.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {((selectedPhoto?.size || 0) / 1024).toFixed(1)} KB • Verified Format
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-dashed border-border rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
              >
                <Camera className="h-4 w-4 text-primary" />
                <span>Click to Upload Photo (JPEG, PNG, WebP &lt; 10MB)</span>
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
                  <span>Hide Additional Location Details</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Add Specific District, Title or GPS Coordinates (Optional)</span>
                </>
              )}
            </button>
          </div>

          {/* Expanded Fields */}
          {isExpanded && (
            <div className="p-4 rounded-xl border border-border/80 bg-secondary/20 space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">District Jurisdiction</label>
                  <Select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    options={JHARKHAND_DISTRICTS.map((d) => ({ value: d, label: d }))}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">Street / Landmark</label>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={isGettingLocation}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className="h-3 w-3" />
                      {isGettingLocation ? 'Detecting...' : 'Use GPS'}
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
                <label className="text-xs font-semibold text-foreground">Custom Grievance Title</label>
                <Input
                  placeholder="Optional custom headline (e.g. Collapsed drainage culvert)"
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
                  Running Multi-Factor AI Verification...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Grievance Now
                </span>
              )}
            </Button>
            <p className="text-[11px] text-center text-muted-foreground mt-2 font-medium">
              🔒 Generates a permanent public tracking ID (SS-2026-NNNNNN) with real-time audit trail
            </p>
          </div>
        </form>
      </Card>

      {/* Immediate Tracking ID Confirmation Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader className="space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-black tracking-tight text-foreground">
              Complaint Registered Successfully
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Your grievance has been verified and permanently indexed on the Jharkhand Civic Registry.
            </DialogDescription>
          </DialogHeader>

          {submittedComplaint && (
            <div className="space-y-4 my-2">
              {/* Tracking ID Box */}
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Public Tracking ID
                  </span>
                  <span className="text-lg font-black font-mono text-primary tracking-tight">
                    {submittedComplaint.id}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyTrackingId}
                  className="gap-1.5 text-xs font-bold border-primary/40"
                >
                  {hasCopied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </Button>
              </div>

              {/* AI Verification Score */}
              <div className="p-3.5 rounded-xl border border-border bg-secondary/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-foreground font-bold">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    AI Authenticity Score
                  </span>
                  <span
                    className={`font-black font-mono px-2.5 py-0.5 rounded-md text-xs ${
                      submittedComplaint.ai_score >= 80
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        : submittedComplaint.ai_score >= 40
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {submittedComplaint.ai_score} / 100
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground block">
                    Lifecycle Status:
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {submittedComplaint.status === 'auto_approved' && (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        ✅ Auto-Approved & Forwarded to Department
                      </span>
                    )}
                    {submittedComplaint.status === 'pending_officer' && (
                      <span className="text-amber-600 dark:text-amber-400">
                        ⏳ Under Review by District Nodal Officer
                      </span>
                    )}
                    {submittedComplaint.status === 'auto_rejected' && (
                      <span className="text-rose-600 dark:text-rose-400">
                        ⚠️ Flagged as Invalid (One-Click Appeal Available)
                      </span>
                    )}
                  </span>
                </div>

                {submittedComplaint.ai_flags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {submittedComplaint.ai_flags.map((flag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-card border border-border/80 text-muted-foreground font-mono"
                      >
                        #{flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="w-full sm:w-1/2 text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                setModalOpen(false);
                if (submittedComplaint) {
                  navigate(`/track/${submittedComplaint.id}`);
                }
              }}
              className="w-full sm:w-1/2 text-xs font-bold gap-1.5"
            >
              <span>Track Live Status</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
