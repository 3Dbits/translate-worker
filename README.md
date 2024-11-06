# Translation API Using Cloudflare Workers AI

This API provides free translation services powered by Cloudflare Workers and Meta's M2M100 AI model. It's a simple, yet powerful way to translate text between different languages.

## API Endpoint

```
https://translate-worker.matija-cvetan28.workers.dev/
```

## Authentication

All requests require an API key to be sent in the `X-API-Key` header. Contact me to obtain a valid API key.

## Available Endpoints

### Translation Endpoint (POST)

Translates text from one language to another.

- **Method**: POST
- **Headers Required**:
  - `Content-Type: application/json`
  - `X-API-Key: your-api-key`

#### Request Body

```json
{
	"text": "Text to translate",
	"source_lang": "en", // optional, defaults to "en"
	"target_lang": "hr" // required
}
```

#### Response Format

```json
{
	"success": true,
	"original": {
		"text": "Text to translate",
		"source_lang": "en",
		"target_lang": "hr"
	},
	"translation": "Tekst za prijevod"
}
```

In case of errors:

```json
{
	"success": false,
	"error": "Error message"
}
```

### OPTIONS Request

The API supports OPTIONS requests for CORS preflight checks.

- **Method**: OPTIONS
- **Response**: Empty response with CORS headers

## Example Usage

### Using cURL

```bash
# Translation request
curl -X POST https://translate-worker.matija-cvetan28.workers.dev/ \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your-api-key" \
    -d '{
        "text": "Hello, how are you?",
        "target_lang": "es"
    }'
```

### Using Typescript Fetch

#### Types Definition

First, you can define the types for the request and response:

```typescript
interface TranslationRequest {
	text: string;
	source_lang?: string;
	target_lang: string;
}

interface TranslationResponse {
	success: boolean;
	original?: TranslationRequest;
	translation?: string;
	error?: string;
}
```

#### Basic Translation Request

```typescript
async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
	const response = await fetch('https://translate-worker.matija-cvetan28.workers.dev', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': apiKey,
		},
		body: JSON.stringify({
			text,
			target_lang: targetLang,
		}),
	});

	const data = (await response.json()) as TranslationResponse;

	if (!data.success) {
		throw new Error(data.error || 'Translation failed');
	}

	return data.translation || '';
}
```

## Error Codes

- `400`: Bad Request (missing required fields)
- `401`: Unauthorized (invalid API key)
- `405`: Method Not Allowed (only POST and OPTIONS are supported)
- `500`: Internal Server Error

## Limitations

- Maximum text length is limited by the AI model to 720 characters
- Service availability depends on Cloudflare Workers and the AI model's uptime
- Rate limiting may apply

## Contributing

Feel free to open issues or submit pull requests on our GitHub repository.

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.
