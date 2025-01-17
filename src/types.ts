export interface GeneratedStory {
  englishStory: string;
  translatedStory: string;
  tokenUsed: Number;
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
