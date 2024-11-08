import { Card, getInitialCards } from './card';

export interface Game {
  handleClick(card: Card): Game;
  resetUnmatchedCards(): Game;
  reset(): Game;
  resetWithDifficulty(difficulty: Difficulty): Game;
  getDuration(): string;
  getScore(): number;
  getAttempts(): number;
  getCards(): Card[];
  getCounts(): number[];
  hasFlippedTwoCardsWithoutMatch(): boolean;
  getDifficulty(): Difficulty;
  hasMatchAllCards(): boolean;
}

interface DifficultyLevel {
  numCards: number,
  matchLength: number,
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}


function getDifficultySpec(difficulty: Difficulty): DifficultyLevel {
  switch (difficulty) {
    case Difficulty.EASY:
      return { numCards: 2, matchLength: 2 };
    case Difficulty.MEDIUM:
      return { numCards: 4, matchLength: 2 };
    case Difficulty.HARD:
      return { numCards: 8, matchLength: 2 };
  }
}

interface GameData {
  start: Date | null;
  end: Date | null;
  score: number;
  attempts: number;
  cards: Card[];
  difficulty: Difficulty;
}

const DefaultGameData = {
  start: null,
  end: null,
  score: 0,
  attempts: 0,
  cards: getInitialCards(getDifficultySpec(Difficulty.HARD).numCards),
  difficulty: Difficulty.HARD
}


export function NewGame(game: GameData = DefaultGameData): Game {

  function getFaceUpCards(cards = game.cards): Card[] {
    return cards.filter((c) => c.isFaceUp && !c.isMatched);
  }

  function hasFlippedTwoCards(cards = game.cards): boolean {
    return getFaceUpCards(cards).length >= 2;
  }

  function hasTwoMatchingCards(cards = game.cards): boolean {
    const [one, two] = getFaceUpCards(cards);
    return one?.value === two?.value;
  }

  function hasMatchAllCards(cards = game.cards): boolean {
    return cards.find((c) => !c.isMatched) === undefined;
  }

  return {
    reset(): Game {
      return NewGame({
        start: null,
        end: null,
        score: 0,
        attempts: 0,
        cards: getInitialCards(getDifficultySpec(game.difficulty).numCards),
        difficulty: game.difficulty
      })
    },
    resetWithDifficulty(difficulty: Difficulty): Game {
      return NewGame({
        start: null,
        end: null,
        score: 0,
        attempts: 0,
        cards: getInitialCards(getDifficultySpec(difficulty).numCards),
        difficulty: difficulty
      })
    },
    handleClick(card: Card): Game {
      if (card.isFaceUp || card.isMatched || hasFlippedTwoCards()) {
        return this;
      }

      let cards = game.cards.map((c) =>
        c.id === card.id ? { ...c, isFaceUp: true, count: c.count + 1 } : c
      );

      let score = game.score;

      if (hasTwoMatchingCards(cards)) {
        score++;

        cards = cards.map((c) => (c.isFaceUp ? { ...c, isMatched: true } : c));
      }

      let end = game.end;

      if (end === null && hasMatchAllCards(cards)) {
        end = new Date();
      }

      return NewGame({
        ...game,
        start: game.start === null ? new Date() : game.start,
        attempts: game.attempts + 1,
        cards,
        score,
        end
      });
    },
    resetUnmatchedCards(): Game {
      return NewGame({
        ...game,
        cards: game.cards.map((c) => c.isMatched ? c : ({ ...c, isFaceUp: false })),
      });
    },
    getDuration(): string {
      if (game.start === null) {
        return "0m 0s";
      }

      let end = new Date();

      if (game.end !== null) {
        end = game.end;
      }

      const diff = end.getTime() - game.start.getTime();
      const totalSeconds = Math.floor(diff / 1000);

      // Calculate minutes and remaining seconds
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      return `${minutes}m ${seconds}s`;
    },
    getScore(): number {
      return game.score;
    },
    getAttempts(): number {
      return game.attempts;
    },
    getCards(): Card[] {
      return game.cards;
    },
    getCounts(): number[] {
      return game.cards.map((c) => c.count);
    },
    hasFlippedTwoCardsWithoutMatch(): boolean {
      if (!hasFlippedTwoCards()) {
        return false;
      }

      if (hasTwoMatchingCards()) {
        return false;
      }

      return true;
    },
    getDifficulty(): Difficulty {
      return game.difficulty;
    },
    hasMatchAllCards
  };
}
