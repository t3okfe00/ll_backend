import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeneratedText } from 'src/types';
@Injectable()
export class OpenAIService {
  constructor(private configService: ConfigService) {}
  async generateStory(prompt: string, translateTo: string) {
    let apikey = this.getOpenAIKey();

    const url = this.getOpenAITextGenerationBaseUrl();

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apikey}`,
    };

    const body = {
      model: 'gpt-4o',
      store: true,
      messages: [
        {
          role: 'user',
          content:
            `${prompt}` +
            `I  want to hear the same story in English and ${translateTo} in a daily used vocabulary.The format should be like this. English:[story itself]. ${translateTo}:[story itself].First give me the English story completely, then same story in ${translateTo}. Do not mix any content!Number of sentences in each translation must be the same and there should be at least 7 sentences.Do not include any ** in your sentences`,
        },
      ],
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
      if (response.status !== 200) {
        throw new Error('Error fetching data from OpenAI');
      }
      const data = await response.json();

      const openai_response_stroy = data.choices[0].message.content;

      const englishStory = this.extractEnglishStory(
        openai_response_stroy,
        translateTo,
      );

      const translatedStory = this.extractTranslatedStory(
        openai_response_stroy,
        translateTo,
      );

      const tokenUsed = data.usage.total_tokens;

      const toClient: GeneratedText = {
        englishStory,
        translatedStory,
        tokenUsed,
      };

      return toClient;
    } catch (error) {
      throw new Error('Error fetching data from OpenAI');
    }
  }

  extractEnglishStory(story: string, translateTo: string) {
    return story
      .match(new RegExp(`English:\\s*(.*?)\\s*${translateTo}:`, 's'))?.[1]
      ?.trim();
  }

  extractTranslatedStory(story: string, translateTo: string) {
    const translateRegex = new RegExp(`${translateTo}:\\s*([\\s\\S]*)`, 's');
    return story.match(translateRegex)?.[1]?.trim();
  }

  getOpenAIKey(): string {
    let apiKey = this.configService.get<string>('OPEN_AI_KEY');
    return apiKey;
  }

  getOpenAITextGenerationBaseUrl(): string {
    return this.configService.get<string>('OPEN_AI_TEXT_GENERATION_BASE_URL');
  }
}
