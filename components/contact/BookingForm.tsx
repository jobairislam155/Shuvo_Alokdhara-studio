'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { BookingFormErrors, BookingFormValues, validateBookingForm } from '@/lib/utils/validation';
import { cn } from '@/lib/utils/cn';

const eventTypes = ['Wedding', 'Portrait', 'Fashion', 'Commercial', 'Event', 'Other'];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-sans text-xs uppercase tracking-widest text-ink-200">
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 font-sans text-xs text-danger">{error}</p> : null}
    </div>
  );
}

const inputClass =
  // text-base (16px) prevents iOS Safari's auto-zoom-on-focus; steps back
  // down to text-sm on desktop where that concern doesn't apply.
  'w-full border-b border-ink-300 bg-transparent py-2.5 font-sans text-base text-ink-50 outline-none transition-colors placeholder:text-ink-200 focus:border-brass md:text-sm';

export function BookingForm({ services }: { services: { slug: string; title: string }[] }) {
  const searchParams = useSearchParams();
  const preselected = services.find((s) => s.slug === searchParams.get('service'))?.title ?? '';

  const [values, setValues] = useState<BookingFormValues>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    location: '',
    budget: '',
    service: preselected,
    message: '',
  });
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (key: keyof BookingFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validateBookingForm(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus('loading');
    setServerError(null);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong.');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-brass/40 p-10 text-center"
      >
        <h3 className="font-serif text-2xl text-ink-50">Thank you.</h3>
        <p className="mt-3 font-sans text-sm text-ink-100">
          Your inquiry has been received. I&rsquo;ll be in touch within 2 business days.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Field label="Full Name" error={errors.name}>
        <input
          className={inputClass}
          value={values.name}
          onChange={update('name')}
          placeholder="Jane Doe"
          autoComplete="name"
        />
      </Field>
      <Field label="Email" error={errors.email}>
        <input
          className={inputClass}
          type="email"
          value={values.email}
          onChange={update('email')}
          placeholder="jane@email.com"
          autoComplete="email"
        />
      </Field>
      <Field label="Phone" error={errors.phone}>
        <input
          className={inputClass}
          type="tel"
          value={values.phone}
          onChange={update('phone')}
          placeholder="+880 1XX XXX XXXX"
          autoComplete="tel"
        />
      </Field>
      <Field label="Event Type" error={errors.eventType}>
        <select className={cn(inputClass, 'appearance-none')} value={values.eventType} onChange={update('eventType')}>
          <option value="">Select an event type</option>
          {eventTypes.map((t) => (
            <option key={t} value={t} className="bg-ink-500">
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Event Date" error={errors.eventDate}>
        <input className={inputClass} type="date" value={values.eventDate} onChange={update('eventDate')} />
      </Field>
      <Field label="Location" error={errors.location}>
        <input
          className={inputClass}
          value={values.location}
          onChange={update('location')}
          placeholder="City, venue"
        />
      </Field>
      <Field label="Estimated Budget" error={errors.budget}>
        <input
          className={inputClass}
          value={values.budget}
          onChange={update('budget')}
          placeholder="e.g. BDT 80,000 – 150,000"
        />
      </Field>
      <Field label="Preferred Service" error={errors.service}>
        <select className={cn(inputClass, 'appearance-none')} value={values.service} onChange={update('service')}>
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title} className="bg-ink-500">
              {s.title}
            </option>
          ))}
        </select>
      </Field>

      <div className="md:col-span-2">
        <Field label="Message" error={errors.message}>
          <textarea
            className={cn(inputClass, 'min-h-[120px] resize-none')}
            value={values.message}
            onChange={update('message')}
            placeholder="Tell me about your event or project…"
          />
        </Field>
      </div>

      <div className="md:col-span-2">
        <AnimatePresence>
          {status === 'error' && serverError ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 font-sans text-sm text-danger"
            >
              {serverError}
            </motion.p>
          ) : null}
        </AnimatePresence>
        <Button type="submit" variant="solid" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send Inquiry'}
        </Button>
      </div>
    </form>
  );
}
