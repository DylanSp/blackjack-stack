/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fields, lookup, TypeNames, variantModule, VariantOf } from 'variant';
import { Card, Hand, Rank } from './card';
import { Deck, newDeck, shuffleDeck } from './deck';

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

interface BlackjackRules {
  playerBonusOnBlackjack: number; // multiply bet by this number, i.e. if payout is 3:2, this should be 1.5
  dealerHitsOnSoft17: boolean;
}

interface BlackjackGame {
  rules: BlackjackRules;
  deck: Deck;
  playerHand: Array<Card>;
  dealerHiddenCard: Card;
  dealerVisibleHand: Array<Card>;
  playerBet: number;
}

const dealerHand = (game: BlackjackGame): Hand => {
  return [game.dealerHiddenCard, ...game.dealerVisibleHand];
};

const newGame = (rules: BlackjackRules): BlackjackGame => {
  const deck = shuffleDeck(newDeck());
  const playerCard1 = deck.pop()!;
  const playerCard2 = deck.pop()!;
  const playerHand = [playerCard1, playerCard2];
  const dealerHiddenCard = deck.pop()!;
  const dealerVisibleCard = deck.pop()!;
  const dealerVisibleHand = [dealerVisibleCard];
  return {
    rules,
    deck,
    playerHand,
    dealerHiddenCard,
    dealerVisibleHand,
    playerBet: 0,
  };
};

const MoveResult = variantModule({
  gameContinues: fields<{ game: BlackjackGame }>(),
  push: undefined,
  dealerWinsFromBlackjack: undefined,
  dealerWinsFromPlayerBust: undefined,
  dealerWinsFromHigherHandValue: undefined,
  playerWinsFromBlackjack: undefined,
  playerWinsFromDealerBust: undefined,
  playerWinsFromHigherHandValue: undefined,
});

type MoveResult<T extends TypeNames<typeof MoveResult> = undefined> = VariantOf<
  typeof MoveResult,
  T
>;

const startGame = (rules: BlackjackRules) => (
  playerBet: number,
): MoveResult => {
  const game = newGame(rules);
  game.playerBet = playerBet;

  const playerHasBlackjack = valueOfHand(game.playerHand) === 21;
  const dealerHasBlackjack = valueOfHand(dealerHand(game)) === 21;

  if (playerHasBlackjack && dealerHasBlackjack) {
    return MoveResult.push;
  }

  if (playerHasBlackjack && !dealerHasBlackjack) {
    return MoveResult.playerWinsFromBlackjack;
  }

  if (!playerHasBlackjack && dealerHasBlackjack) {
    return MoveResult.dealerWinsFromBlackjack;
  }

  return MoveResult.gameContinues({ game });
};

type PlayerMove = 'Hit' | 'Stay';

const makePlayerMove = (
  game: BlackjackGame,
  playerMove: PlayerMove,
): MoveResult => {
  if (playerMove === 'Hit') {
    const dealtPlayerCard = game.deck.pop()!;
    game.playerHand.push(dealtPlayerCard);

    const playerHandValue = valueOfHand(game.playerHand);

    if (playerHandValue > 21) {
      return MoveResult.dealerWinsFromPlayerBust;
    }

    if (playerHandValue === 21) {
      return MoveResult.playerWinsFromBlackjack;
    }

    return MoveResult.gameContinues({ game });
  } else if (playerMove === 'Stay') {
    // dealer moves

    do {
      const dealtDealerCard = game.deck.pop()!;
      game.dealerVisibleHand.push(dealtDealerCard);
    } while (dealerShouldMove(dealerHand(game), game.rules.dealerHitsOnSoft17));

    const dealerHandValue = valueOfHand(dealerHand(game));
    const playerHandValue = valueOfHand(game.playerHand);

    if (dealerHandValue > 21) {
      return MoveResult.playerWinsFromDealerBust;
    }

    if (dealerHandValue === 21) {
      return MoveResult.dealerWinsFromBlackjack;
    }

    if (dealerHandValue === playerHandValue) {
      return MoveResult.push;
    }

    if (dealerHandValue > playerHandValue) {
      return MoveResult.dealerWinsFromHigherHandValue;
    }

    return MoveResult.playerWinsFromHigherHandValue;
  } else {
    throw new Error(
      'Programming error - possible player move not accounted for',
    );
  }
};

const dealerShouldMove = (hand: Hand, hitOnSoft17: boolean): boolean => {
  const handValue = valueOfHand(hand);

  if (handValue > 17) {
    return false;
  }

  if (handValue < 17) {
    return true;
  }

  const isSoft = hand.some((card) => card.rank === Rank.A);
  return hitOnSoft17 && isSoft;
};
