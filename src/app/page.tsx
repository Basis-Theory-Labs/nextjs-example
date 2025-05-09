"use client";

import dynamic from "next/dynamic";

// Dynamically import the CreditCardForm with no SSR
const CreditCardForm = dynamic(() => import("@/components/CreditCardForm"), { ssr: false });

export default function Home() {
  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Secure Payment Processing</h1>
        <p className="subtitle">Enter your payment details securely using Basis Theory</p>
      </div>
      <CreditCardForm />
    </div>
  );
}
