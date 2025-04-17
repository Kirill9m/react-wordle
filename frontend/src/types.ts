export type GameData = {
  gameId?: string | undefined;
  lang?: string;
  length: number;
  playerId: string;
  unique: boolean;
  status?: string;
  coins?: string;
};

export type UserStatement = 'notReadyToPlay' | 'readyToPlay' | 'register';
