import type { Service } from '@/types';
import { UploadField } from './UploadField';

/** Shared inputs for the "add" and "edit" service forms. */
export function ServiceFields({ service }: { service?: Partial<Service> }) {
  const hasUploadedImage = Boolean(service?.image && !service.image.startsWith('data:'));
  return (
    <>
      <input name="title" required placeholder="Package title" defaultValue={service?.title} className="admin-input" />
      <input name="price" placeholder="Price, e.g. BDT 22,000.00" defaultValue={service?.price ?? ''} className="admin-input" />
      <input
        name="badge"
        placeholder="Small label, e.g. Drone Included (optional)"
        defaultValue={service?.badge ?? ''}
        className="admin-input"
      />
      <input
        name="sort_order"
        type="number"
        placeholder="Order (0 = first)"
        defaultValue={service?.sort_order ?? 0}
        className="admin-input"
      />
      <textarea
        name="description"
        placeholder="Short line under the title"
        defaultValue={service?.description}
        className="admin-input min-h-[60px] md:col-span-2"
      />
      <textarea
        name="deliverables"
        placeholder={'What is included — one item per line\n👤 2 Photographers\n🎥 1 Cinematographer'}
        defaultValue={service?.deliverables?.join('\n')}
        className="admin-input min-h-[140px] md:col-span-2"
      />
      <input
        name="note"
        placeholder="Closing line, e.g. Book your date now. (optional)"
        defaultValue={service?.note ?? ''}
        className="admin-input md:col-span-2"
      />
      <UploadField
        name="image"
        resourceType="image"
        label={service ? 'Change photo (leave empty to keep the current one)' : 'Photo (optional)'}
        defaultValue=""
        placeholder={hasUploadedImage ? 'Current photo is kept unless you upload a new one' : undefined}
      />
    </>
  );
}
