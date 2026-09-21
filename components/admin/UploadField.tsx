'use client';

import { useRef, useState } from 'react';

type Props = {
  /** Name of the form field that receives the Cloudinary public ID (or a pasted URL). */
  name: string;
  resourceType: 'image' | 'video' | 'auto';
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  /** When set, also renders an Image/Video select under this name, auto-set after an upload. */
  typeName?: string;
};

/**
 * Upload a photo/video straight to Cloudinary from the admin dashboard.
 * The browser asks our server for a signature (admin-only — the API secret
 * never reaches the browser), uploads the file, and drops the resulting
 * public ID into the field. A URL or public ID can also be typed by hand.
 */
export function UploadField({ name, resourceType, label, placeholder, defaultValue, required, typeName }: Props) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const accept = resourceType === 'image' ? 'image/*' : resourceType === 'video' ? 'video/*' : 'image/*,video/*';

  async function upload(file: File) {
    setError(null);
    setDone(false);
    setProgress(0);
    try {
      const sigRes = await fetch('/api/admin/upload-signature', { method: 'POST' });
      if (!sigRes.ok) {
        const body = await sigRes.json().catch(() => null);
        throw new Error(body?.error ?? 'Could not start the upload.');
      }
      const sig = await sigRes.json();

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sig.apiKey);
      form.append('timestamp', String(sig.timestamp));
      form.append('signature', sig.signature);
      form.append('folder', sig.folder);

      const result = await new Promise<{ public_id: string; resource_type: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) resolve(json);
            else reject(new Error(json?.error?.message ?? 'Upload failed.'));
          } catch {
            reject(new Error('Upload failed.'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error during upload.'));
        xhr.send(form);
      });

      setValue(result.public_id);
      if (result.resource_type === 'image' || result.resource_type === 'video') setType(result.resource_type);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2 md:col-span-2">
      {label ? <p className="font-sans text-xs uppercase tracking-widest text-ink-200">{label}</p> : null}
      <div className="flex flex-wrap gap-3">
        {typeName ? (
          <select
            name={typeName}
            value={type}
            onChange={(e) => setType(e.target.value as 'image' | 'video')}
            className="admin-input w-auto"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        ) : null}
        <input
          name={name}
          value={value}
          required={required}
          onChange={(e) => {
            setValue(e.target.value);
            setDone(false);
          }}
          placeholder={placeholder ?? 'Upload a file, or paste a Cloudinary public ID / URL'}
          className="admin-input min-w-[14rem] flex-1"
        />
        <button
          type="button"
          disabled={progress !== null}
          onClick={() => fileRef.current?.click()}
          className="border border-brass px-5 py-2 font-sans text-xs uppercase tracking-widest text-brass disabled:opacity-40"
        >
          {progress !== null ? `Uploading… ${progress}%` : 'Upload file'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
      {done ? <p className="font-sans text-xs text-brass">Uploaded — save the form to use it.</p> : null}
      {error ? <p className="font-sans text-xs text-danger">{error}</p> : null}
    </div>
  );
}
