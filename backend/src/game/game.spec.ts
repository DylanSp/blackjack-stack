import { Hand, Rank, Suit } from './card';
import { valueOfHand } from './game';

describe('Blackjack game', () => {
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
