import { isNone, isSome } from 'fp-ts/lib/Option';
import {
  Card,
  cardToString,
  Hand,
  parseCard,
  Rank,
  Suit,
  valueOfHand,
} from './card';

describe('Playing cards', () => {
  describe('parseCard()', () => {
    it('Parses a basic card correctly', () => {
      // Arrange
      const str = '2H';

      // Act
      const card = parseCard(str);

      // Assert
      if (!isSome(card)) {
        throw new Error('Parse unsuccessful, should have succeeded');
      }

      expect(card.value.rank).toBe(Rank['2']);
      expect(card.value.suit).toBe(Suit.Hearts);
    });

    it('Rejects a string with less than two characters', () => {
      // Arrange
      const str = '2';

      // Act
      const card = parseCard(str);

      // Assert
      expect(isNone(card)).toBe(true);
    });

    it('Rejects a string with more than two characters', () => {
      // Arrange
      const str = '10H';

      // Act
      const card = parseCard(str);

      // Assert
      expect(isNone(card)).toBe(true);
    });

    it('Rejects a string with invalid rank', () => {
      // Arrange
      const str = '1C';

      // Act
      const card = parseCard(str);

      // Assert
      expect(isNone(card)).toBe(true);
    });

    it('Rejects a string with invalid suit', () => {
      // Arrange
      const str = '2G';

      // Act
      const card = parseCard(str);

      // Assert
      expect(isNone(card)).toBe(true);
    });
  });

  describe('cardToString()', () => {
    it('Outputs correct string for a card', () => {
      // Arrange
      const card: Card = {
        rank: Rank.J,
        suit: Suit.Diamonds,
      };

      // Act
      const str = cardToString(card);

      // Assert
      expect(str).toBe('JD');
    });
  });

  describe('valueOfHand()', () => {
    it('Outputs correct value of a hand without aces', () => {
      // Arrange
      const hand: Hand = [
        {
          rank: Rank['5'],
          suit: Suit.Clubs,
        },
        {
          rank: Rank['9'],
          suit: Suit.Hearts,
        },
      ];

      // Act
      const value = valueOfHand(hand);

      // Assert
      expect(value).toBe(14);
    });

    it('Values aces as 11 when value is <= 21', () => {
      // Arrange
      const hand: Hand = [
        {
          rank: Rank.J,
          suit: Suit.Clubs,
        },
        {
          rank: Rank.A,
          suit: Suit.Hearts,
        },
      ];

      // Act
      const value = valueOfHand(hand);

      // Assert
      expect(value).toBe(21);
    });

    it('Values aces as 1 when value would be > 21', () => {
      // Arrange
      const hand: Hand = [
        {
          rank: Rank['5'],
          suit: Suit.Clubs,
        },
        {
          rank: Rank['9'],
          suit: Suit.Hearts,
        },
        {
          rank: Rank.A,
          suit: Suit.Diamonds,
        },
      ];

      // Act
      const value = valueOfHand(hand);

      // Assert
      expect(value).toBe(15);
    });

    it('Values hands with multiple aces correctly', () => {
      // Arrange
      const hand: Hand = [
        {
          rank: Rank.A,
          suit: Suit.Clubs,
        },
        {
          rank: Rank.A,
          suit: Suit.Hearts,
        },
      ];

      // Act
      const value = valueOfHand(hand);

      // Assert
      expect(value).toBe(12);
    });
  });
});
