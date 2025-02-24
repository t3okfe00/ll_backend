# NestJS REST API for language learning app 
Initially, I developed [TwinTongues](https://youtu.be/R3MYzJaM3Jg) using NextJS & Javascript.
However, I decided to rebuild the backend using NestJS & TS to better support a mobile app and future features.

This repository is the backend for React-Native & NextJS language learning app 
that provides three key features:
* Story Generation
* Text-to-Speech
* Word translation

Backend:
* Interacts with OpenAI's API to generate a story in multiple languages using the GPT model.
* Converts text into speech using Google Cloud TTS, stores the generated audio in an S3 bucket (supabase) and returns a signed URL for access.
* Translates words using DeepL
* Authentication with google and JWT (in progress)
