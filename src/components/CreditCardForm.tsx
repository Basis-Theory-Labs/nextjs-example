"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { CardElement, useBasisTheory } from "@basis-theory/react-elements";
import type { ICardElement } from "@basis-theory/react-elements";

const CreditCardForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const cardRef = useRef<ICardElement | null>(null);

  const { bt, error } = useBasisTheory("<API KEY>");

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!bt || !cardRef.current) {
      setError("Basis Theory is not initialized");
      setIsLoading(false);
      return;
    }

    try {
      const token = await bt.tokens.create({
        type: "card",
        data: cardRef.current,
      });

      console.log("Token created:", token);
      // Handle the token (e.g., send to your server)
    } catch (error) {
      console.error("Error creating token:", error);
      setError("An error occurred while processing your card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Credit Card Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Card Information</label>
          <CardElement
            id="card"
            bt={bt}
            ref={cardRef}
            style={{
              base: {
                fontSize: "16px",
                color: "var(--text-color)",
                "::placeholder": {
                  color: "var(--text-light)",
                },
              },
              invalid: {
                color: "var(--error-color)",
              },
            }}
          />
          {_error && <p className="error">{_error}</p>}
        </div>
        <button type="submit" className="button" disabled={!bt || isLoading}>
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreditCardForm;
