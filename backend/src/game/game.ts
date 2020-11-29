import { lookup } from 'variant';
import { Hand, Rank } from './card';

export const valueOfHand = (hand: Hand): number => {
  let value = 0;

  for (const card of hand) {
    value += lookup(card.rank, {
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '0': 10,
      J: 10,
      Q: 10,
      K: 10,
      A: 0, // value of aces will be determined after summing the rest of the cards
    });
  }

  hand
    .filter((card) => card.rank === Rank.A)
    .forEach(() => {
      if (value + 11 <= 21) {
        value += 11;
      } else {
        value += 1;
      }
    });

  return value;
};
