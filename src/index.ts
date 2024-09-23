import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import * as ChatAPI from 'openai/src/resources/chat/chat';

type ChatModelPrices = {
	inputPrice: number;
	outputPrice: number;
}

// Updated on 2024-09-23
const modelPrices: {[index: string | ChatAPI.ChatModel]: ChatModelPrices} = {
	'gpt-4o': {
		inputPrice: 0.000005,
		outputPrice: 0.000015,
	},
	'gpt-4o-mini': {
		inputPrice: 0.00000015,
		outputPrice: 0.0000006,
	},
}

const calculatePrice = (usage: OpenAI.Completions.CompletionUsage, model: string | ChatAPI.ChatModel) => {
	const modelPrice = modelPrices[model];
	if (!modelPrice) {
		return null;
	}
	const pricing = {
		prompt_tokens: usage.prompt_tokens,
		prompt_price: usage.prompt_tokens * modelPrice.inputPrice,
		completion_tokens: usage.completion_tokens,
		completion_price: usage.completion_tokens * modelPrice.outputPrice,
		total_tokens: usage.prompt_tokens + usage.completion_tokens,
		total_price: usage.prompt_tokens * modelPrice.inputPrice + usage.completion_tokens * modelPrice.outputPrice
	};
	return pricing;
};

export const openAiRequestWithSchema = async <T>(
	model: string | ChatAPI.ChatModel,
	messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
	schema: z.ZodType<T>,
	showPrices = false
): Promise<T | null> => {
	const client = new OpenAI();

	const responseFormat = zodResponseFormat(schema, 'schema');
	try {
		const completion = await client.beta.chat.completions.parse({
			model,
			messages,
			response_format: responseFormat
		});
		if (completion.usage && showPrices) {
			console.log('Usage and Prices:', calculatePrice(completion.usage, model));
		}
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
