export interface GeneratedStory {
  englishStory: string;
  translatedStory: string;
  tokenUsed: Number;
  remainingTokens: Number;
}

export type GoogleCloudRequestObject = {
  input: { text: string };
  voice: {
    name: string;
    languageCode: string;
    ssmlGender: 'NEUTRAL' | 'MALE' | 'FEMALE';
  };
  audioConfig: {
    audioEncoding: 'MP3' | 'OGG_OPUS' | 'LINEAR16';
  };
};

export type SaveToBucketResponse = {
  path: string;
  id: string;
  fullPath: string;
};

export type User = {
  id: string;
  created_at: string;
  token: number;
  email: string;
  daily_free_translations: number;
  last_translation_reset: string;
  paid_tokens: number;
  total_tokens: number;
  num_stories: number;
  daily_tts: number;
};
