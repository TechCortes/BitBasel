'use client';

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { usePhysicalStore } from '@/store/StoreProvider';
import { ArtworkInquiry } from '@/types/physicalArt';

interface Props {
  artworkId: string;
  artworkTitle: string;
  onClose: () => void;
}

export const InquireModal: React.FC<Props> = observer(({ artworkId, artworkTitle, onClose }) => {
  const store = usePhysicalStore();
  const [form, setForm] = useState<Omit<ArtworkInquiry, 'artworkId' | 'artworkTitle'>>({
    name: '',
    email: '',
    phone: '',
    institution: '',
    message: '',
    shippingCountry: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await store.submitInquiry({ artworkId, artworkTitle, ...form });
  }

  return (
    <div className="phys-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="phys-modal" role="dialog" aria-modal="true" aria-labelledby="inquire-title">
        <div className="phys-modal-header">
          <div>
            <p className="phys-modal-title" id="inquire-title">
              Inquire
            </p>
            <p className="phys-modal-subtitle">{artworkTitle}</p>
          </div>
          <button className="phys-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {store.inquirySuccess ? (
          <div className="phys-modal-success">
            <h3>Thank you for your inquiry</h3>
            <p>A member of the BitBasel gallery team will be in touch within one business day.</p>
            <button
              className="phys-inquire-btn"
              style={{ marginTop: '1.5rem', maxWidth: 200, margin: '1.5rem auto 0' }}
              onClick={() => {
                store.resetInquiry();
                onClose();
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form className="phys-modal-body" onSubmit={handleSubmit}>
            <div className="phys-form-row">
              <div className="phys-form-group">
                <label className="phys-form-label" htmlFor="inquire-name">
                  Full Name *
                </label>
                <input
                  id="inquire-name"
                  name="name"
                  className="phys-form-input"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="phys-form-group">
                <label className="phys-form-label" htmlFor="inquire-email">
                  Email *
                </label>
                <input
                  id="inquire-email"
                  name="email"
                  type="email"
                  className="phys-form-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="phys-form-row">
              <div className="phys-form-group">
                <label className="phys-form-label" htmlFor="inquire-phone">
                  Phone
                </label>
                <input
                  id="inquire-phone"
                  name="phone"
                  type="tel"
                  className="phys-form-input"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
              <div className="phys-form-group">
                <label className="phys-form-label" htmlFor="inquire-country">
                  Country *
                </label>
                <input
                  id="inquire-country"
                  name="shippingCountry"
                  className="phys-form-input"
                  placeholder="e.g. United States"
                  value={form.shippingCountry}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="phys-form-group">
              <label className="phys-form-label" htmlFor="inquire-institution">
                Institution / Collection
              </label>
              <input
                id="inquire-institution"
                name="institution"
                className="phys-form-input"
                value={form.institution}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

            <div className="phys-form-group">
              <label className="phys-form-label" htmlFor="inquire-message">
                Message
              </label>
              <textarea
                id="inquire-message"
                name="message"
                className="phys-form-textarea"
                value={form.message}
                onChange={handleChange}
                placeholder="Please include any questions about condition, framing, or shipping."
              />
            </div>

            {store.inquiryError && (
              <p
                style={{
                  color: 'var(--color-error)',
                  fontSize: '0.875rem',
                  marginBottom: '0.75rem',
                }}
              >
                {store.inquiryError}
              </p>
            )}

            <button className="phys-modal-submit" type="submit" disabled={store.inquirySubmitting}>
              {store.inquirySubmitting ? 'Sending…' : 'Send Inquiry'}
            </button>

            <p className="phys-modal-privacy">
              Your information is kept strictly confidential and will only be used to respond to
              your inquiry.
            </p>
          </form>
        )}
      </div>
    </div>
  );
});

export default InquireModal;
