'use client';

import { Modal } from '@/components/admin/Modal';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = 'danger',
  onConfirm,
  onClose,
  loading = false,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: 'danger' | 'default';
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
}) {
  return (
    <Modal open={open} title={title} description={description} onClose={onClose}>
      <div className="flex flex-wrap justify-end gap-3">
        <button onClick={onClose} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button
          onClick={() => void onConfirm()}
          className={tone === 'danger' ? 'btn-danger' : 'btn-primary'}
          disabled={loading}
        >
          {loading ? 'Processing…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
