import { ConfigService } from '@nestjs/config';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  GoogleCloudRequestObject,
  SaveToBucketResponse,
  User,
} from 'src/types';
import { SupabaseService } from 'src/supabase/supabase.service';
import { HttpException, HttpStatus } from '@nestjs/common';
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
  constructor(private supabaseService: SupabaseService) {}

  async processTextToSpeech(userId: string, userEmail: string, text: string) {
    const user: User = await this.supabaseService.getUserByEmail(userEmail);

    if (!user || user.daily_tts <= 0) {
      throw new HttpException(
        'You have reached your daily limit for Text-to-Speech.',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      let audioBuffer: Buffer = null;
      const audioContent = await this.synthesizeSpeech(text);
      const uniqueFileName = this.supabaseService.createUniqueFileName(text);
      const existingFile =
        await this.supabaseService.checkIfFileExistsInS3Bucket(uniqueFileName);

      if (!existingFile) {
        audioBuffer = this.convertAudioToBuffer(audioContent);

        await this.supabaseService.saveFileToS3Bucket(
          uniqueFileName,
          audioBuffer,
        );
      }

      const remaining_daily_tts =
        await this.supabaseService.deductTtsQuota(userId);
      const url = await this.supabaseService.createSignedUrl(uniqueFileName);
      return [remaining_daily_tts, url];
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      console.error('Error in creating speech', error);
      throw new HttpException(
        'Failed to create speech',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async synthesizeSpeech(text: string) {
    const googleLanguageCode = this.detectAndMapLanguage(text);
    const request: GoogleCloudRequestObject = {
      input: { text: text },
      voice: {
        name: `${googleLanguageCode}-Standard-A`,
        languageCode: googleLanguageCode,
        ssmlGender: 'NEUTRAL',
      },
      audioConfig: { audioEncoding: 'MP3' },
    };
    console.log('**** REQUEST TO GOOGLE CLOUD ****');

    try {
      const response = await client.synthesizeSpeech(request);
      const mp3content = response[0].audioContent;

      return mp3content;
    } catch (error) {
      console.error('Error in synthesizeSpeech', error);
      throw new HttpException(
        'Failed to synthesize speech',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  convertAudioToBuffer(audioContent: string) {
    const buffer = Buffer.from(audioContent, 'binary');
    return buffer;
  }

  async convertBlobToBuffer(blob: Blob) {
    return Buffer.from(await blob.arrayBuffer());
  }

  detectAndMapLanguage(text: string) {
    const languageCode = langdetect.detect(text);
    const googleLanguageCode =
      this.googleLanguageMap[languageCode[0].lang] || 'en-US';
    return googleLanguageCode;
  }
}
