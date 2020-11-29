import { none, Option, some } from 'fp-ts/lib/Option';
import { match, TypeNames, variantList, VariantOf } from 'variant';

const validRanks = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0', // represents 10
  'J',
  'Q',
  'K',
  'A',
];

export const Rank = variantList(validRanks);

export type Rank<T extends TypeNames<typeof Rank> = undefined> = VariantOf<
  typeof Rank,
  T
>;

const validSuits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

export const Suit = variantList(validSuits);

export type Suit<T extends TypeNames<typeof Suit> = undefined> = VariantOf<
  typeof Suit,
  T
>;

export interface Card {
  rank: Rank;
  suit: Suit;
}

export const parseCard = (str: string): Option<Card> => {
  if (str.length != 2) {
    return none;
  }

  const possibleRank = str[0];
  const possibleSuit = str[1];

  let rank: Rank;
  if (validRanks.includes(possibleRank)) {
    rank = Rank[possibleRank];
  } else {
    return none;
  }

  let suit: Suit;
  switch (possibleSuit) {
    case 'C':
      suit = Suit.Clubs;
      break;
    case 'D':
      suit = Suit.Diamonds;
      break;
    case 'H':
      suit = Suit.Hearts;
      break;
    case 'S':
      suit = Suit.Spades;
      break;
    default:
      return none;
  }

  return some({
    rank,
    suit,
  });
};

export const cardToString = (card: Card): string => {
  const suitChar = match(card.suit, {
    Clubs: () => 'C',
    Diamonds: () => 'D',
    Hearts: () => 'H',
    Spades: () => 'S',
  });

  return card.rank.type + suitChar;
};

export type Hand = Array<Card>;
