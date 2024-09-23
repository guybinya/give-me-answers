"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.craftJsonSchemaPrompt = exports.giveMeAiMessages = exports.openAiRequestWithSchema = void 0;
const openai_1 = require("openai");
const zod_1 = require("openai/helpers/zod");
const openAiRequestWithSchema = async (model, messages, schema) => {
    const client = new openai_1.default();
    const responseFormat = (0, zod_1.zodResponseFormat)(schema, 'schema');
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
