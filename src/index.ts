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

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
				},
			});
		}

		if (request.method !== 'POST') {
			return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 });
		}

		try {
			const apiKey = request.headers?.get('X-API-Key');
			if (apiKey !== env.VALID_API_KEY) {
				return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
			}

			const requestData = (await request.json()) as TranslationRequest;

			const translationRequest: TranslationRequest = {
				text: requestData.text,
				source_lang: requestData.source_lang || 'english',
				target_lang: requestData.target_lang,
			};

			if (!translationRequest.text) {
				return Response.json({ success: false, error: 'Text field is required' }, { status: 400 });
			}

			if (!translationRequest.target_lang) {
				return Response.json({ success: false, error: 'Target language is required' }, { status: 400 });
			}

			const translation = await env.AI.run('@cf/meta/m2m100-1.2b', translationRequest);

			const response: TranslationResponse = {
				success: true,
				original: translationRequest,
				translation: translation.translated_text,
			};

			return Response.json(response, {
				headers: {
					'Access-Control-Allow-Origin': '*',
				},
			});
		} catch (error) {
			const response: TranslationResponse = {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};

			return Response.json(response, {
				status: 500,
				headers: {
					'Access-Control-Allow-Origin': '*',
				},
			});
		}
	},
} satisfies ExportedHandler<Env>;
