"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { CardElement, useBasisTheory } from "@basis-theory/react-elements";
import type { ICardElement, Token } from "@basis-theory/react-elements";
import { authorizeBtSession } from "../app/authorize";

const CreditCardForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<Token>();
  const [revealedToken, setRevealedToken] = useState<Token>();

  const cardRef = useRef<ICardElement | null>(null);
  const cardRefReveal = useRef<ICardElement | null>(null);

  const { bt, error } = useBasisTheory("<PUBLIC_API_KEY>");

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
      setToken(token);
    } catch (error) {
      console.error("Error creating token:", error);
      setError("An error occurred while processing your card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const revealToken = async () => {
    if (bt && token?.id) {
      try {
        const session = await bt?.sessions.create();
        await authorizeBtSession(session.nonce, token?.id);

        const retrievedToken = await bt.tokens.retrieve(token?.id, {
          apiKey: session.sessionKey,
        });

        setRevealedToken(retrievedToken);
        cardRefReveal.current?.setValue(retrievedToken.data);
      } catch (error) {
        console.error("Error revealing token:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">Credit Card Form</h2>
        <div>
          <div className="form-group">
            <label className="label">Card Information</label>
            <div className="bt-card-element">
              <CardElement
                id="card"
                bt={bt}
                ref={cardRef}
                style={{
                  base: {
                    fontSize: "16px",
                    color: "#1f2937",
                    fontFamily: "inherit",
                    "::placeholder": {
                      color: "#6b7280",
                    },
                  },
                  invalid: {
                    color: "#dc2626",
                  },
                }}
              />
            </div>
            {_error && <p className="error">{_error}</p>}
          </div>
          <button onClick={handleSubmit} className="button" disabled={!bt || isLoading}>
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </div>

        <hr className="divider" />

        <div className="form-group">
          <h2 className="card-title">Reveal Token</h2>
          <div className="token-input-group">
            <input value={token?.id ?? ""} className="bt-card-element" readOnly placeholder="Token ID will appear here" />
            <button className="button" onClick={revealToken} disabled={!token?.id}>
              Reveal Token
            </button>
          </div>

          <div className="bt-card-element">
            <CardElement
              id="card_reveal"
              bt={bt}
              ref={cardRefReveal}
              style={{
                base: {
                  fontSize: "16px",
                  color: "#1f2937",
                  fontFamily: "inherit",
                  "::placeholder": {
                    color: "#6b7280",
                  },
                },
                invalid: {
                  color: "#dc2626",
                },
              }}
            />
          </div>

          {revealedToken && (
            <>
              <div className="form-group">
                <pre className="bt-card-element json-display">{JSON.stringify(revealedToken, null, 2)}</pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
