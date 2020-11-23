import { Card, Rank, Suit } from './card';

export type Deck = Array<Card>;

export const newDeck = (): Deck => {
  const deck: Deck = [];

  for (const rankKey in Rank) {
    const rank: Rank = Rank[rankKey];
    for (const suitKey in Suit) {
      const suit: Suit = Suit[suitKey];
      deck.push({
        rank,
        suit,
      });
    }
  }

  return deck;
};

export const shuffleDeck = (deck: Deck): Deck => {
  const newDeck = deck.slice(0); // make by-value copy

  // Durstenfeld/Fisher-Yates shuffle
  // taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/12646864#12646864
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }

  return newDeck;
};
