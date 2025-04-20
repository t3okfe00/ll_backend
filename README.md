# NestJS REST API for language learning app 

This repository is the backend for language learning application
that provides three key features:
* Story Generation
* Text-to-Speech
* Word translation

Tech Stack:
* Backend: NestJS
* Database: supabase & s3 (to store audio files)
* Authentication: Google Auth + JWT
* Story Generation: openAI
* Text-To-Speech: GCP

## API Documentation

* ### AUTHENTICATION
  
#### Google Sign-in
* #### Endpoint: POST /auth/google-signin

##### Request:

Body
 ```json
  {
    "token":"google_id_token_from_client"
  } 
 ```
Response

Schema:

 ```json
  {
    "accessToken":string,
    "refreshToken":string,
    "userEmail":string
  }
 ```
Example:

 ```json
  {
    "accessToken":"jwt_access_token",
    "refreshToken":"jwt_refresh_token",
    "userEmail":"example@gmail.com"
  }
 ```
#### Process

1-Client obtains Google ID Token

2-Client sends ID token to server

3-Server verifies token with Google

4-Server checks if the user with the email (from google payload) exists in supabase database

5-If user does not exist, server creates a new user

6-Server generates JWT access and refresh tokens

7-Server returns tokens to client

* ### STORY GENERATION

  
* #### Endpoint: POST /generate-story
  This endpoint will return a story in two languages(one in english, one in chosen langauge) along with tokens used and remaining.
  
##### Request

 Headers
 
           Authorization: Bearer {accessToken}
 
      
  Body
  
  ```json
    {
      "prompt":"story about a kid who dreams about being a football player",
      "translateTo":"Turkish"
    }
  ```

Response

Schema:
 ```json
  {
    "englishStroy":string,
    "translatedStory":string,
    "tokenUsed":number,
    "remainingTokens":number
  }
 ```

Example:
 ```json
  {
    "englishStroy":"Once there was a young boy named Alex....",
    "translatedStory":"Bir zamanlar Alex adında genç bir çocuk vardı....",
    "tokenUsed":323,
    "remainingTokens":5297
  }
 ```
* ### Text-To-Speech GENERATION
  
* #### Endpoint: POST /text-to-speech

  This endpoint will return mp3 link that is stored in supabase s3 bucket as well as remaining daily text-to-speech requests user has.

  ##### Request

 Headers
 
           Authorization: Bearer {accessToken}
 
      
  Body
  
  ```json
    {
      "text":"your message that you want to get text to speech"
    }
  ```

Response

Schema:
 ```json
  {
   "success":boolean,
   "url":string,
   "remaining_daily_tts": number,
   "message":string
  }
 ```
Example:
 ```json
  {
   "success":true,
   "url":"https://example.com/example.mp3",
   "remaining_daily_tts": 9,
   "message":"Audio generated succesfully"
  }
 ```

* ![Alt text](/ttss.png)
