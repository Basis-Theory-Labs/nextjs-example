# Next.js Example with Basis Theory Integration

This is a sample application demonstrating how to integrate Basis Theory React Elements into a Next.js application. The implementation shows how to securely collect and tokenize sensitive card data using Basis Theory's React elements.

## Implementation Details

### 1. Client-Side Only Implementation

The Basis Theory integration must run client-side only. This is critical because:

**Basis Theory Web Elements Requirements:**

- Handle sensitive card data directly in the browser
- Create secure iframes loaded from `js.basistheory.com`
- Require browser-specific APIs and DOM access
- Need to handle user input and manage secure communication channels

This is implemented using:

```typescript
"use client";

import dynamic from "next/dynamic";

// Dynamically import the CreditCardForm with no SSR
const CreditCardForm = dynamic(() => import("@/components/CreditCardForm"), { ssr: false });
```

### 2. Component Implementation

Example implementation showing secure card data collection:

```typescript
"use client";

import { useRef, useState } from "react";
import { CardElement, useBasisTheory } from "@basis-theory/react-elements";

const CreditCardForm = () => {
  const cardRef = useRef<ICardElement | null>(null);
  const { bt } = useBasisTheory(process.env.NEXT_PUBLIC_BASIS_THEORY_KEY);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = await bt.tokens.create({
        type: "card",
        data: cardRef.current,
      });
      // Handle the token
    } catch (err) {
      console.error("Tokenization error", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement id="card" bt={bt} ref={cardRef} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Security Considerations

1. **Client-Side Processing**

   - Card data is collected and tokenized in the browser
   - Sensitive data never touches your server
   - Reduces PCI compliance scope

2. **Secure Communication**

   - All communication happens through secure iframes
   - Data is encrypted in transit
   - API keys are kept in environment variables

3. **Error Handling**
   - All sensitive operations are wrapped in try/catch
   - Errors are logged for debugging
   - Failed operations don't expose sensitive data

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up your environment variables:
   Create a `.env.local` file with your Basis Theory public API key:

```bash
NEXT_PUBLIC_BASIS_THEORY_KEY=your_public_api_key_here
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Creating a Card Element

```typescript
import { CardElement, useBasisTheory } from "@basis-theory/react-elements";

const MyComponent = () => {
  const { bt } = useBasisTheory(process.env.NEXT_PUBLIC_BASIS_THEORY_KEY);

  return <CardElement id="card" bt={bt} ref={cardRef} />;
};
```

### Tokenizing Card Data

```typescript
const handleSubmit = async () => {
  try {
    const token = await bt.tokens.create({
      type: "card",
      data: cardRef.current,
    });
    // Handle the token
  } catch (err) {
    console.error("Tokenization error", err);
  }
};
```

## Additional Resources

- [Basis Theory Documentation](https://docs.basistheory.com/)
- [React Elements Documentation](https://docs.basistheory.com/elements/react-elements)
- [Next.js Documentation](https://nextjs.org/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
