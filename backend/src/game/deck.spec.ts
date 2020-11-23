import { newDeck } from './deck';

describe('Deck of cards', () => {
  describe('Deck initialization', () => {
    it('Initializes deck with correct length', () => {
      // Arrange - not needed

      // Act
      const deck = newDeck();

      // Assert
      expect(deck.length).toBe(52);
    });
  });
});
