"use client";

// Next Imports
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
// Services
import { ProductI } from "@/services";
// Components
import { Modal } from "@/components/admin/Modal";
// Lib
import { validateStockAmount } from "@/lib/validation";

export function StockModal({
  open,
  product,
  onClose,
  onSubmit,
  loading = false,
}: {
  open: boolean;
  product?: ProductI | null;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  loading?: boolean;
}) {
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setError("");
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextError = validateStockAmount(amount);
    setError(nextError);
    if (nextError) return;
    onSubmit(Number(amount));
  }

  return (
    <Modal
      open={open}
      title="Add product stock"
      description={
        product
          ? `Increase inventory for ${product.name}. Current stock: ${product.stock}.`
          : undefined
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-base">Units to add</label>
          <input
            className="input-base"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setAmount(event.target.value);
              setError("");
            }}
            placeholder="12"
          />
          {error ? <p className="error-text">{error}</p> : null}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Updating…" : "Add Stock"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
