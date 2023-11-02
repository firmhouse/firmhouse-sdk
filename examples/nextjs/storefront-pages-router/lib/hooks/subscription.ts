import { useEffect, useState } from 'react';
import { firmhouseClient } from '../firmhouse';
import {
  OrderedProductIntervalUnitOfMeasure,
  OrderedProductType,
  SubscriptionType,
} from '@firmhouse/firmhouse-sdk';
const SUBSCRIPTION_TOKEN_KEY = 'Firmhouse.cartToken';

async function addToCart(
  subscriptionToken: string,
  productId: string,
  quantity: number
) {
  return firmhouseClient.subscriptions.addToCart(
    { productId, quantity },
    subscriptionToken
  );
}

async function removeFromCart(
  subscriptionToken: string,
  orderedProductId: string
) {
  return firmhouseClient.subscriptions.removeFromCart(
    orderedProductId,
    subscriptionToken
  );
}

async function updateOrderedProductQuantity(
  subscriptionToken: string,
  orderedProductId: string,
  quantity: number
) {
  return firmhouseClient.subscriptions.updateOrderedProductQuantity(
    orderedProductId,
    quantity,
    subscriptionToken
  );
}

export function useSubscription() {
  const [subscription, setSubscription] = useState(
    null as SubscriptionType | null
  );
  useEffect(() => {
    const token =
      subscription?.token ??
      localStorage.getItem(SUBSCRIPTION_TOKEN_KEY) ??
      undefined;
    const initialize = async (subscriptionToken?: string) => {
      const response =
        await firmhouseClient.subscriptions.getOrCreateDraftSubscription(
          subscriptionToken
        );
      setSubscription(response);
      localStorage.setItem(SUBSCRIPTION_TOKEN_KEY, response.token);
    };
    if (subscription === null) {
      initialize(token).catch((error) => {
        console.error(error);
      });
    }
  }, [subscription]);

  return {
    subscription,
    addToCart: (productId: string, quantity = 1) => {
      if (subscription === null) {
        return;
      }
      addToCart(subscription.token, productId, quantity)
        .then((response) => {
          if (
            response?.subscription === null ||
            response?.subscription === undefined
          )
            return;
          setSubscription({
            ...response.subscription,
            token: subscription.token,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    removeFromCart: (orderedProductId: string) => {
      if (subscription === null) {
        return;
      }
      removeFromCart(subscription.token, orderedProductId)
        .then((response) => {
          if (
            response?.subscription === null ||
            response?.subscription === undefined
          )
            return;
          setSubscription({
            ...response.subscription,
            token: subscription.token,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateOrderedProductQuantity: (
      orderedProductId: string,
      quantity: number
    ) => {
      if (subscription === null) {
        return;
      }
      updateOrderedProductQuantity(
        subscription.token,
        orderedProductId,
        quantity
      )
        .then((response) => {
          if (
            response?.subscription === null ||
            response?.subscription === undefined
          )
            return;
          setSubscription({
            ...response.subscription,
            token: subscription.token,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateOrderedProductInterval: (
      orderedProductId: string,
      interval: number,
      intervalUnitOfMeasureType: OrderedProductIntervalUnitOfMeasure
    ) => {
      if (subscription === null) {
        return;
      }
      firmhouseClient.subscriptions
        .updateOrderedProduct(
          {
            id: orderedProductId,
            interval,
            intervalUnitOfMeasureType,
          },
          subscription.token
        )
        .then((response) => {
          const updatedOrderedProduct = response?.orderedProduct;
          if (
            updatedOrderedProduct === null ||
            updatedOrderedProduct === undefined
          )
            return;
          setSubscription({
            ...subscription,
            orderedProducts:
              subscription?.orderedProducts?.map((op): OrderedProductType => {
                if (op.id === orderedProductId) {
                  return updatedOrderedProduct;
                }
                return { ...op, intervalUnitOfMeasureType: null };
              }) ?? [],
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  };
}
