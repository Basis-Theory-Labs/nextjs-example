"use server";

import { BasisTheoryClient } from "@basis-theory/node-sdk";

export const authorizeBtSession = async (nonce: string, tokenId: string) => {
  const bt = await new BasisTheoryClient({
    apiKey: "<PRIVATE_API_KEY>",
  });

  try {
    await bt.sessions.authorize({
      nonce: nonce,
      rules: [
        {
          description: "Reveal Token",
          priority: 1,
          conditions: [
            {
              attribute: "id",
              operator: "equals",
              value: tokenId,
            },
          ],
          permissions: ["token:read", "token:use"],
          transform: "reveal",
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};
