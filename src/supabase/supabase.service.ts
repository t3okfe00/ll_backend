import { ConfigService } from '@nestjs/config';
import { StorageError } from './../../node_modules/@supabase/storage-js/src/lib/errors';
import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { S3Client } from '@aws-sdk/client-s3';
import { HttpStatus, HttpException } from '@nestjs/common';
import * as crypto from 'crypto';
import { SaveToBucketResponse } from 'src/types';
@Injectable()
export class SupabaseService {
  private textToSpeechBucketName: string;

  constructor(
    private configService: ConfigService,
    @Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
  ) {
    this.textToSpeechBucketName = this.configService.get('S3_BUCKET_NAME');
  }

  async saveFileToS3Bucket(
    fileName: string,
    buffer: Buffer,
  ): Promise<SaveToBucketResponse> {
    const { data, error } = await this.supabaseClient.storage
      .from(this.textToSpeechBucketName)
      .upload(fileName, buffer, {
        contentType: 'audio/mpeg',
      });

    if (error) {
      console.log('Error,', error);
      throw new HttpException(
        `Failed to save file to S3 bucket-${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data;
  }

  async checkIfFileExistsInS3Bucket(fileName: string): Promise<Blob | false> {
    const { data, error } = await this.supabaseClient.storage
      .from(this.textToSpeechBucketName)
      .download(fileName);

    if (error) {
      if (error.name === 'StorageUnknownError') {
        return false;
      }

      console.log('Network or unknown error occurred');

      throw new HttpException(
        'Error checking file existence in s3 bucket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data;
  }

  createUniqueFileName(text: string) {
    const fileName = `${this.generateUniqueId(text)}.mp3`;
    return fileName; // Return the generated filename
  }

  generateUniqueId(text: string) {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  async createSignedUrl(filePath: string, expiresIn = 60) {
    'use server';
    try {
      // Generate the signed URL
      const { data, error } = await this.supabaseClient.storage
        .from(this.textToSpeechBucketName)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw new HttpException(
          'Error creating signed URL',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error creating signed URL:', error.message || error);
      throw new HttpException(
        'Error creating signed URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
