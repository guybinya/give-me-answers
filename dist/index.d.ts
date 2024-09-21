import OpenAI from 'openai';
import { z } from 'zod';
import * as ChatAPI from 'openai/src/resources/chat/chat';
export declare const openAiRequestWithSchema: <T>(model: string | ChatAPI.ChatModel, messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], schema: z.ZodType<T>) => Promise<T | null>;
export declare const giveMeAiMessages: ({ system, user }: {
    system: string;
    user: string;
}) => OpenAI.Chat.Completions.ChatCompletionMessageParam[];
export declare const craftJsonSchemaPrompt: ({ instructions, fieldDescriptions, exampleJson }: {
    instructions: string[];
    fieldDescriptions: string[];
    exampleJson: string;
}) => string;
