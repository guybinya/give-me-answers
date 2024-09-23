import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import * as ChatAPI from 'openai/src/resources/chat/chat';

export const openAiRequestWithSchema = async <T>(
	model: string | ChatAPI.ChatModel,
	messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
	schema: z.ZodType<T>
): Promise<T | null> => {
	const client = new OpenAI();

	const responseFormat = zodResponseFormat(schema, 'schema');
	try {
		const completion = await client.beta.chat.completions.parse({
			model,
			messages,
			response_format: responseFormat
		});
		if (completion.choices[0].message.content === null) {
			return null;
		}
		const parsedArguments = schema.parse(JSON.parse(completion.choices[0].message.content));
		return parsedArguments as T;
	} catch (error) {
		console.error('Error calling OpenAI:', error);
		return null;
	}
};

export const giveMeAiMessages = ({
	                                 system,
	                                 user
                                 }: {
	system: string;
	user: string;
}): OpenAI.Chat.Completions.ChatCompletionMessageParam[] => {
	return [
		{
			role: 'system',
			content: system
		},
		{
			role: 'user',
			content: user
		}
	];
};

export const craftJsonSchemaPrompt = ({
	                                      instructions,
	                                      fieldDescriptions,
	                                      exampleJson
                                      }: {
	instructions: string[];
	fieldDescriptions: string[];
	exampleJson: string;
}) => {
	return `
    ## INSTRUCTIONS:
    ${instructions.join('\n')}
    
    ## FIELDS DESCRIPTION:
    ${fieldDescriptions.join('\n')}
    
    ## EXAMPLE JSON:
    ${exampleJson}
  `;
};
