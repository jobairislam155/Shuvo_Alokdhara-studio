export interface BookingFormValues {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  budget: string;
  service: string;
  message: string;
}

export type BookingFormErrors = Partial<Record<keyof BookingFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBookingForm(values: BookingFormValues): BookingFormErrors {
  const errors: BookingFormErrors = {};

  if (!values.name.trim()) errors.name = 'Please enter your full name.';
  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.phone.trim()) errors.phone = 'Please enter a phone number.';
  if (!values.eventType.trim()) errors.eventType = 'Please select an event type.';
  if (!values.eventDate.trim()) {
    errors.eventDate = 'Please select a date.';
  } else if (Number.isNaN(new Date(values.eventDate).getTime())) {
    errors.eventDate = 'Please enter a valid date.';
  }
  if (!values.message.trim()) errors.message = 'Tell me a little about the project.';

  return errors;
}
