import {useEffect, useRef, useState, type FormEvent} from 'react';
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import {
  SERVICE_PACKAGES,
  STUDIO_GROUNDED_INFO,
  formatCurrencyPrice,
  type CurrencyCode,
  type LanguageCode,
  type Translations,
} from '../data/studioData';
import type {StudioPlaceData} from '../hooks/useStudioPlaceData';

interface BookingSectionProps {
  selectedPackageId: string;
  onSelectPackage: (id: string) => void;
  currency: CurrencyCode;
  language: LanguageCode;
  t: Translations['booking'];
  placeData: StudioPlaceData;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
}

interface ConfirmedBooking {
  reference: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  vehicle: string;
  packageName: string;
  estimatedPrice: string;
  date: string;
  time: string;
  notes: string;
}

const TIME_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '01:00 PM',
  '03:00 PM',
  '05:00 PM',
  '07:00 PM',
  '08:30 PM',
];

function getTomorrowIsoDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0] || '';
}

export function BookingSection({
  selectedPackageId,
  onSelectPackage,
  currency,
  language,
  t,
  placeData,
  nameInputRef,
}: BookingSectionProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [vehicle, setVehicle] = useState('');
  const [date, setDate] = useState(getTomorrowIsoDate);
  const [time, setTime] = useState(TIME_SLOTS[1]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (sameAsPhone) {
      setWhatsapp(phone);
    }
  }, [phone, sameAsPhone]);

  useEffect(() => {
    if (confirmed) {
      modalCloseBtnRef.current?.focus();
    }
  }, [confirmed]);

  useEffect(() => {
    if (!confirmed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setConfirmed(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmed]);

  const activePackage =
    SERVICE_PACKAGES.find((pkg) => pkg.id === selectedPackageId) ?? SERVICE_PACKAGES[2];

  const estimatedPrice = formatCurrencyPrice(activePackage.usdPrice, currency);

  const conciergeMessage = encodeURIComponent(
    `Hello ${placeData.displayName}, I would like to inquire about "${activePackage.name.en}" (${estimatedPrice}) for my vehicle.`,
  );
  const conciergeWhatsappUrl = `https://wa.me/${placeData.whatsappDigits}?text=${conciergeMessage}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedWhatsapp = (sameAsPhone ? phone : whatsapp).trim();
    const trimmedVehicle = vehicle.trim();

    if (trimmedName.length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }

    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
      setFormError('Please provide a valid phone number so our studio desk can reach you.');
      return;
    }

    const waDigits = trimmedWhatsapp.replace(/\D/g, '');
    if (waDigits.length < 7) {
      setFormError('Please provide a valid WhatsApp number.');
      return;
    }

    if (trimmedVehicle.length < 3) {
      setFormError('Please enter your vehicle make, model, and year (e.g., Audi A6, 2025).');
      return;
    }

    if (!date) {
      setFormError('Please select a preferred appointment date.');
      return;
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const reference = `ACS-${date.replace(/-/g, '').slice(2)}-${randomCode}`;

    setConfirmed({
      reference,
      fullName: trimmedName,
      phone: trimmedPhone,
      whatsapp: trimmedWhatsapp,
      vehicle: trimmedVehicle,
      packageName: activePackage.name[language],
      estimatedPrice,
      date,
      time,
      notes: notes.trim(),
    });
  };

  const buildWhatsAppSlipUrl = (booking: ConfirmedBooking): string => {
    const lines = [
      `*${placeData.displayName} — Booking Request*`,
      `Ref: ${booking.reference}`,
      `Client: ${booking.fullName}`,
      `Phone: ${booking.phone}`,
      `Vehicle: ${booking.vehicle}`,
      `Package: ${booking.packageName} (${booking.estimatedPrice})`,
      `Slot: ${booking.date} at ${booking.time}`,
    ];
    if (booking.notes) {
      lines.push(`Notes: ${booking.notes}`);
    }
    return `https://wa.me/${placeData.whatsappDigits}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <section
      id="booking"
      className="py-20 lg:py-28 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
            {t.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
            {t.title}
          </h2>
          <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Selected Package Briefing & WhatsApp Concierge */}
          <aside className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {t.estimatedTotal}
                </p>
                <p className="mt-2 font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {activePackage.name[language]}
                </p>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-semibold tabular-nums text-amber-700 dark:text-amber-400">
                    {estimatedPrice}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    · {activePackage.duration[language]}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {placeData.formattedAddress}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {STUDIO_GROUNDED_INFO.defaultHoursSummary}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${placeData.phoneNumber.replace(/\s+/g, '')}`}
                    className="font-mono tabular-nums text-zinc-900 dark:text-zinc-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    {placeData.phoneNumber}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="font-display text-base font-semibold text-zinc-950 dark:text-zinc-50">
                {t.conciergeTitle}
              </h3>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.conciergeBody}
              </p>
              <a
                href={conciergeWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.whatsappCta}</span>
              </a>
            </div>
          </aside>

          {/* Right Column: Interactive Validated Booking Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 flex flex-col justify-between gap-6"
          >
            <div className="space-y-5">
              {formError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3.5 rounded-lg border border-red-300 dark:border-red-900/80 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    {t.fullName} *
                  </label>
                  <input
                    ref={nameInputRef}
                    id="booking-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Hamza Malik"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    {t.phone} *
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label
                      htmlFor="booking-whatsapp"
                      className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {t.whatsapp} *
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => setSameAsPhone(e.target.checked)}
                        className="rounded border-zinc-300 dark:border-zinc-700 accent-amber-600"
                      />
                      <span>{t.sameAsPhone}</span>
                    </label>
                  </div>
                  <input
                    id="booking-whatsapp"
                    type="tel"
                    required
                    disabled={sameAsPhone}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+92 314 5593546"
                    className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 disabled:bg-zinc-100 dark:disabled:bg-zinc-900/70 disabled:text-zinc-500 text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-vehicle"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    {t.vehicle} *
                  </label>
                  <input
                    id="booking-vehicle"
                    type="text"
                    required
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder={t.vehiclePlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-package"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  {t.packageLabel} *
                </label>
                <select
                  id="booking-package"
                  value={selectedPackageId}
                  onChange={(e) => onSelectPackage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors"
                >
                  {SERVICE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.indexLabel}. {pkg.name[language]} —{' '}
                      {formatCurrencyPrice(pkg.usdPrice, currency)} ({pkg.duration[language]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    {t.dateLabel} *
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-time"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    {t.timeLabel} *
                  </label>
                  <select
                    id="booking-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-notes"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  {t.notesLabel}
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.submitBtn}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Instant Confirmation Modal */}
      {confirmed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setConfirmed(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3
                    id="booking-modal-title"
                    className="font-display text-xl font-bold text-zinc-950 dark:text-zinc-50"
                  >
                    {t.modalTitle}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {t.modalSubtitle}
                  </p>
                </div>
              </div>

              <button
                ref={modalCloseBtnRef}
                type="button"
                onClick={() => setConfirmed(null)}
                aria-label="Close confirmation modal"
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t.referenceLabel}
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums text-amber-700 dark:text-amber-400">
                  {confirmed.reference}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500 dark:text-zinc-400">{t.fullName}</span>
                <span className="font-medium text-zinc-950 dark:text-zinc-100 text-end">
                  {confirmed.fullName}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500 dark:text-zinc-400">{t.vehicle}</span>
                <span className="font-medium text-zinc-950 dark:text-zinc-100 text-end">
                  {confirmed.vehicle}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500 dark:text-zinc-400">{t.packageLabel}</span>
                <span className="font-medium text-zinc-950 dark:text-zinc-100 text-end">
                  {confirmed.packageName}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500 dark:text-zinc-400">{t.estimatedTotal}</span>
                <span className="font-mono font-semibold tabular-nums text-zinc-950 dark:text-zinc-100">
                  {confirmed.estimatedPrice}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {t.dateLabel} · {t.timeLabel}
                </span>
                <span className="font-mono tabular-nums text-zinc-950 dark:text-zinc-100">
                  {confirmed.date} · {confirmed.time}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsAppSlipUrl(confirmed)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.sendWhatsAppBtn}</span>
              </a>
              <button
                type="button"
                onClick={() => setConfirmed(null)}
                className="px-5 py-3 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
