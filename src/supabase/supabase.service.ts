import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { S3Client } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

@Injectable()
export class SupabaseService {
  private textToSpeechBucketName = 'llearning_bucket';

  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
  ) {}

  async saveFileToS3Bucket(fileName: string, buffer: Buffer) {
    const { data, error } = await this.supabaseClient.storage
      .from(this.textToSpeechBucketName)
      .upload(fileName, buffer, {
        contentType: 'audio/mpeg',
      });

    if (error) {
      throw new Error(`Error saving file to Supabase: ${error.message}`);
    }

    return data;
  }
  createUniqueFileName(text: string) {
    const fileName = `${this.generateUniqueId(text)}.mp3`;
    console.log('Unique File Name', fileName);
    return fileName; // Return the generated filename
  }

  generateUniqueId(text: string) {
    return crypto.createHash('md5').update(text).digest('hex');
  }
}
