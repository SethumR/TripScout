# 🏝️ TripScout

An AI-powered travel package discovery application that helps users find the perfect Sri Lankan travel experience using natural language queries. Built with Next.js, OpenAI API, and TypeScript.

## Assessment Questions

### 1. The "Under the Hood" Moment

**The Problem I Hit**: The AI kept making stuff up. When someone searched for something we didn't have, it would just... invent travel packages. Like if you asked for "snorkeling in Maldives," it would confidently suggest packages that didn't exist in our inventory.

**How I Fixed It**:
First, I made the AI respond in JSON format only - no room for creative writing. Then I added a double-check system: even if the AI suggests something, my code verifies that package ID actually exists in our database before showing it to the user. I also lowered the AI's "creativity" setting (temperature) from the default to 0.1 so it sticks to facts.

Basically learned that you can't just trust AI responses blindly - you need guardrails in your code too.

### 2. The Scalability Thought

Right now we're sending all 5 packages to the AI with every search. That works fine, but with 50,000 packages? That would be way too expensive and slow.

**What I'd Do Instead**:
- Use a vector database to store "embeddings" (fancy word for converting package descriptions into numbers)
- When someone searches, find the 30-50 packages that are most similar to their query
- Only send those top candidates to the AI for final ranking
- Add caching so popular searches ("beach under $100") don't hit the AI every time

This would cut costs by like 99% because instead of sending 50,000 packages through the AI each time, we'd only send 50. Plus, we could use the cheaper version of GPT for most queries and only use the expensive one when needed.

### 3. The AI Reflection

**Tools I Used**: GitHub Copilot and ChatGPT

**When AI Gave Bad Advice**:
Copilot suggested this code for validation:
```typescript
if (!validatedResponse.success) {
  return validatedResponse.data; // This doesn't exist!
}
```

The problem? When validation fails, there IS no `.data` - that's the whole point of the failure. The app would crash trying to return something that doesn't exist.

I fixed it by just using `.parse()` which automatically throws an error if validation fails, then my try-catch handles it properly.

**Lesson**: AI is great for boilerplate and common patterns, but it often messes up error handling and edge cases. Always read the code it suggests, especially the parts dealing with what happens when things go wrong.

---
