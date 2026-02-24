import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { TravelPackage } from '@/types';
import { INVENTORY, getPackagesByIds } from '@/lib/inventory';

// Zod schema for validating AI response
const SearchResultSchema = z.object({
  matches: z.array(z.object({
    id: z.number(),
    reasoning: z.string()
  })),
  message: z.string().optional()
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Create a strict system prompt that grounds the AI to our inventory
    const systemPrompt = `You are a travel package recommendation assistant. Your ONLY job is to match user queries to items from the provided inventory.

STRICT RULES:
1. You can ONLY recommend travel packages from the inventory list below
2. NEVER suggest or mention destinations not in this list
3. Return matches as JSON with package IDs and reasoning
4. If no good matches exist, return an empty matches array with a helpful message

INVENTORY (THE ONLY OPTIONS):
${JSON.stringify(INVENTORY, null, 2)}

MATCHING CRITERIA:
- Price: Consider user's budget (e.g., "under $100", "cheap", "luxury")
- Tags: Match activity preferences (beach, hiking, history, adventure, etc.)
- Location: Match region preferences if mentioned
- Vibe: Match mood/atmosphere (chill, adventurous, cultural, etc.)

RESPONSE FORMAT (JSON only):
{
  "matches": [
    {"id": 1, "reasoning": "Matches your preference for X because of Y tags and Z price"},
    {"id": 2, "reasoning": "Also fits because..."}
  ],
  "message": "Optional message if no matches or to provide context"
}

If the query is ambiguous or has no matches, return empty matches array with a helpful message suggesting refinement.`;

    const userPrompt = `User query: "${query}"

Analyze this query and return matching travel packages from the inventory. Consider price range, tags, location, and overall vibe. Return ONLY valid package IDs from the inventory.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1, // Low temperature for deterministic results
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse and validate AI response
    const parsedResponse = JSON.parse(aiResponse);
    const validatedResponse = SearchResultSchema.parse(parsedResponse);

    // Double-check: only return packages that exist in our inventory
    const validIds = validatedResponse.matches
      .map(m => m.id)
      .filter(id => INVENTORY.some(pkg => pkg.id === id));

    const packages = getPackagesByIds(validIds);

    // Combine package data with AI reasoning
    const results = packages.map(pkg => {
      const match = validatedResponse.matches.find(m => m.id === pkg.id);
      return {
        ...pkg,
        reasoning: match?.reasoning || 'Matches your criteria'
      };
    });

    return NextResponse.json({
      results,
      message: validatedResponse.message,
      query
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    // Handle different error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid AI response format', details: error.issues },
        { status: 500 }
      );
    }

    // Handle OpenAI API errors
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status?: number; message?: string };
      if (apiError.status === 401) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.' },
          { status: 500 }
        );
      }
    }

    // Log the full error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error:', errorMessage);

    return NextResponse.json(
      { error: 'Failed to process search request', details: errorMessage },
      { status: 500 }
    );
  }
}
