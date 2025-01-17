import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { GoogleCloudRequestObject } from 'src/types';
import { SupabaseService } from 'src/supabase/supabase.service';
var langdetect = require('langdetect');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

@Injectable()
export class TextToSpeechService {
  private googleLanguageMap = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    fi: 'fi-FI',
    tr: 'tr-TR',
    ru: 'ru-RU',
  };
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {}

  async createSpeech(text: string) {
    try {
      const audioContent = await this.fetchAudioContent(text);
      const uniqueFileName = this.supabaseService.createUniqueFileName(text);
      const audioBuffer = this.convertToBuffer(audioContent);
      const saveToBucket = await this.supabaseService.saveFileToS3Bucket(
        uniqueFileName,
        audioBuffer,
      );
    } catch (error) {
      console.error('Error in creating speech', error);
      throw new Error('Failed to create speech');
    }
  }

  async fetchAudioContent(text: string) {
    const googleLanguageCode = this.detectLanguage(text);
    const request: GoogleCloudRequestObject = {
      input: { text: text },
      voice: {
        name: `${googleLanguageCode}-Standard-A`,
        languageCode: googleLanguageCode,
        ssmlGender: 'NEUTRAL',
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const response = await client.synthesizeSpeech(request);
    const mp3content = response[0].audioContent;

    return mp3content;
  }

  convertToBuffer(audioContent: string) {
    const buffer = Buffer.from(audioContent, 'binary');
    console.log('HERE', typeof buffer);
    return buffer;
  }

  detectLanguage(text: string) {
    const languageCode = langdetect.detect(text);
    const googleLanguageCode =
      this.googleLanguageMap[languageCode[0].lang] || 'en-US';
    return googleLanguageCode;
  }
}
