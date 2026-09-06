import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PlusCircle, Upload, MapPin, Tag, AlertCircle, Image as ImageIcon, CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { JHARKHAND_DISTRICTS, CATEGORIES } from '@/lib/utils';
import api from '@/lib/api';

export default function SubmitProblem() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const districtOptions = JHARKHAND_DISTRICTS.map((d) => ({ value: d, label: d }));
  const categoryOptions = CATEGORIES.map((c) => ({ value: c.value, label: t(c.labelKey) }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category || !district) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('district', district);
      formData.append('urgency', urgency);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await api.post('/problems', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(t('problems.submit.success'));
      navigate('/my/submissions');
    } catch (err: any) {
      toast.error(err.response?.data?.error || t('problems.submit.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <PlusCircle className="h-7 w-7 text-primary" />
          {t('problems.submit.title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('problems.submit.subtitle')}</p>
      </div>

      <Card className="border-border shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                {t('problems.submit.titleField')} *
              </label>
              <Input
                placeholder={t('problems.submit.titlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
              <span className="text-[10px] text-muted-foreground block text-right">
                {title.length}/200 characters
              </span>
            </div>

            {/* Category & District Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  {t('problems.submit.category')} *
                </label>
                <Select
                  placeholder={t('problems.submit.categoryPlaceholder')}
                  options={categoryOptions}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {t('problems.submit.district')} *
                </label>
                <Select
                  placeholder={t('problems.submit.districtPlaceholder')}
                  options={districtOptions}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Urgency Radio Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                {t('problems.submit.urgency')} *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgency(lvl)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      urgency === lvl
                        ? lvl === 'HIGH'
                          ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500'
                          : lvl === 'MEDIUM'
                          ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-500'
                          : 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    {lvl === 'HIGH'
                      ? t('common.urgencyHigh')
                      : lvl === 'MEDIUM'
                      ? t('common.urgencyMedium')
                      : t('common.urgencyLow')}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t('problems.submit.description')} *
              </label>
              <Textarea
                placeholder={t('problems.submit.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
              <span className="text-[10px] text-muted-foreground block text-right">
                {description.length} characters (minimum 20)
              </span>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {t('problems.submit.photo')}
              </label>
              <div className="rounded-xl border border-dashed border-border p-4 bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-foreground block">
                      {selectedFile ? selectedFile.name : 'Attach photographic evidence'}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      {t('problems.submit.photoHint')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="cursor-pointer">
                    <span className="px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border inline-block transition-colors">
                      {selectedFile ? 'Change File' : 'Browse File'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary leading-relaxed flex items-start gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Submissions undergo nodal officer verification. Once approved, the challenge will be visible in the public directory to university research cells and corporate CSR partners.
              </span>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('problems.submit.submitting') : t('problems.submit.submit')}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
