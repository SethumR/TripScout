# 🏝️ TripScout

An AI-powered travel package discovery application that helps users find the perfect Sri Lankan travel experience using natural language queries. Built with Next.js, OpenAI API, and TypeScript.

## Assessment Questions

### 1. The "Under the Hood" Moment

**Technical Hurdle**: Preventing AI hallucinations and ensuring grounded responses

**The Problem**: Initially, when users asked for experiences not in the inventory (e.g., "snorkeling in Maldives"), the AI would sometimes fabricate packages or suggest items with incorrect details.

**How I Debugged**:
- Added `response_format: { type: 'json_object' }` to force structured output
- Created a dual-validation system:
  1. Zod schema validation on the AI response structure
  2. Backend filtering to verify all returned IDs exist in inventory
- Implemented a strict system prompt that lists the exact inventory and explicitly forbids suggesting other destinations
- Set temperature to 0.1 for more deterministic behavior
- Added a safeguard in the API route that only returns packages present in our inventory array

**Key Learning**: AI grounding requires both prompt engineering AND programmatic validation layers.

### 2. The Scalability Thought

**For 50,000 packages**, I would implement:

**Hybrid Retrieval Architecture**:
1. **Vector Embeddings + Semantic Search**:
   - Pre-compute embeddings for each package (title + tags + location)
   - Use a vector database (Pinecone, Weaviate, or pgvector)
   - Perform top-k similarity search (k=20-50) to narrow candidates
   - Only send top candidates to LLM for final ranking

2. **Caching Layer**:
   - Cache embeddings and popular query results in Redis
   - Implement query normalization to improve cache hits
   - Cache identical prompts with OpenAI's built-in caching

3. **Cost Optimization**:
   - Pre-filter by price/tags before LLM call when possible
   - Use cheaper models (gpt-3.5-turbo) for initial filtering
   - Only use expensive models (gpt-4) for complex ambiguous queries
   - Batch similar queries together

4. **Performance**:
   - Index packages by price ranges, tags, and locations
   - Implement pagination for results
   - Use streaming responses for better UX
   - Add CDN caching for static inventory data

**Estimated Cost**: With vector search, only ~50 packages sent to LLM instead of 50,000, reducing tokens from ~500K to ~5K per query (99% reduction).

### 3. The AI Reflection

**AI Tools Used**: GitHub Copilot, ChatGPT for debugging

**Bad Suggestion Instance**:

When implementing the Zod validation, Copilot suggested:
```typescript
const validatedResponse = SearchResultSchema.safeParse(parsedResponse);
if (!validatedResponse.success) {
  return validatedResponse.data; // ❌ WRONG - data doesn't exist on failure
}
```

**The Bug**: On validation failure, `validatedResponse.data` is undefined. The correct property is `validatedResponse.error`.

**How I Corrected It**:
```typescript
const validatedResponse = SearchResultSchema.parse(parsedResponse);
// parse() throws on failure, which gets caught by try-catch
// OR use safeParse() and check .success first before accessing .data
```

I wrapped the validation in a try-catch and return a proper error response with the Zod error details. This taught me to always verify AI-suggested code, especially for error handling paths which AI often gets wrong.

**Another Instance**: AI suggested using `gpt-4` by default, which would be 10x more expensive. I switched to `gpt-3.5-turbo` since the task is straightforward pattern matching, reducing cost from ~$0.02 to ~$0.002 per query.

---

Built with ❤️ for the TripScout technical assessment.
