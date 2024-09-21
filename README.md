# give-me-answers

This lightweight utility is designed to help you quickly get AI-generated answers from OpenAI with minimal setup. It includes Zod schema validation, making it easy to ensure responses are structured the way you need.

## Installation

You can install this package using npm:

```bash
npm install give-me-answers
```

## Usage

### Importing the Package

```typescript
import { openAiRequestWithSchema, giveMeAiMessages, craftJsonSchemaPrompt } from 'give-me-answers';
```

### Example Usage

```typescript
import { z } from 'zod';
import { openAiRequestWithSchema, giveMeAiMessages } from 'give-me-answers';

// Define your schema using Zod
const responseSchema = z.object({
  name: z.string(),
  age: z.number()
});

// Create messages for the AI
const messages = giveMeAiMessages({
  system: "You are a helpful assistant.",
  user: "Tell me a bit about yourself."
});

// Make an OpenAI request and get the validated response
(async () => {
  const response = await openAiRequestWithSchema('gpt-4o', messages, responseSchema);
  console.log('Validated Response:', response);
})();
```

### Available Functions

#### `openAiRequestWithSchema<T>(model: string, messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], schema: z.ZodType<T>): Promise<T | null>`

Sends a request to OpenAI and validates the response against a Zod schema.

- `model`: The OpenAI model to use (e.g., `'gpt-4o'`).
- `messages`: An array of system and user messages.
- `schema`: A Zod schema for validating the response.

#### `giveMeAiMessages({ system: string, user: string }): OpenAI.Chat.Completions.ChatCompletionMessageParam[]`

Generates an array of OpenAI chat messages from a system and user prompt.

- `system`: The system message for the assistant.
- `user`: The user message or prompt for the assistant.

#### `craftJsonSchemaPrompt({ instructions: string[], fieldDescriptions: string[], exampleJson: string }): string`

Crafts a detailed JSON schema prompt from provided instructions, field descriptions, and an example JSON string.

- `instructions`: Instructions for the AI.
- `fieldDescriptions`: Descriptions of the fields in the expected output.
- `exampleJson`: An example JSON string.

### Example Use Cases

### Get AI Answers with Validated Responses
Use this package to send prompts and get structured responses that match your Zod schema, making sure the returned data is in the format you expect.

### Automated Prompt Generation
With `craftJsonSchemaPrompt`, you can easily generate detailed prompts with field descriptions and example JSON, useful for generating structured outputs from AI models.

### Quick Chat Setup
Quickly create chat interactions with OpenAI using `giveMeAiMessages`, perfect for conversational agents or simple AI interactions.

## License

This package is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## Contributing

Feel free to open issues or submit pull requests to improve this package. Contributions are welcome!
