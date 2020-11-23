import { isNone, isSome } from 'fp-ts/lib/Option';
import { parseCard, Rank, Suit } from './card';

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
});
