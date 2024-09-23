"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.craftJsonSchemaPrompt = exports.giveMeAiMessages = exports.openAiRequestWithSchema = void 0;
const openai_1 = require("openai");
const zod_1 = require("openai/helpers/zod");
// Updated on 2024-09-23
const modelPrices = {
    'gpt-4o': {
        inputPrice: 0.000005,
        outputPrice: 0.000015,
    },
    'gpt-4o-mini': {
        inputPrice: 0.00000015,
        outputPrice: 0.0000006,
    },
};
const calculatePrice = (usage, model) => {
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
const openAiRequestWithSchema = async (model, messages, schema, showPrices = false) => {
    const client = new openai_1.default();
    const responseFormat = (0, zod_1.zodResponseFormat)(schema, 'schema');
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
        return parsedArguments;
    }
    catch (error) {
        console.error('Error calling OpenAI:', error);
        return null;
    }
};
exports.openAiRequestWithSchema = openAiRequestWithSchema;
const giveMeAiMessages = ({ system, user }) => {
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
exports.giveMeAiMessages = giveMeAiMessages;
const craftJsonSchemaPrompt = ({ instructions, fieldDescriptions, exampleJson }) => {
    return `
    ## INSTRUCTIONS:
    ${instructions.join('\n')}
    
    ## FIELDS DESCRIPTION:
    ${fieldDescriptions.join('\n')}
    
    ## EXAMPLE JSON:
    ${exampleJson}
  `;
};
exports.craftJsonSchemaPrompt = craftJsonSchemaPrompt;
