import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { Expense, AIInsight } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface InsightRaw {
  type: 'warning' | 'tip' | 'positive';
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { expenses: Expense[] };
    const { expenses } = body;

    // Guard: no data
    if (!expenses || expenses.length === 0) {
      return NextResponse.json({ insights: [] });
    }

    // Build summary for the last 30 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    const recent = expenses.filter((e) => e.date >= cutoffStr);
    const total30 = recent.reduce((s, e) => s + e.amount, 0);

    const categoryTotals: Record<string, number> = {};
    for (const e of recent) {
      categoryTotals[e.category] = (categoryTotals[e.category] ?? 0) + e.amount;
    }

    const categoryLines = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, amt]) => `  - ${cat}: $${amt.toFixed(2)}`)
      .join('\n');

    const allTotal = expenses.reduce((s, e) => s + e.amount, 0);
    const months = new Set(expenses.map((e) => e.date.substring(0, 7))).size;
    const monthlyAvg = months > 0 ? allTotal / months : 0;

    const userPrompt = `Here is my spending data:

Last 30 days total: $${total30.toFixed(2)}
All-time monthly average: $${monthlyAvg.toFixed(2)}
Total transactions: ${expenses.length}

Last 30 days by category:
${categoryLines || '  (no data)'}

Return exactly 3 concise financial insights as a JSON array with this shape:
[{"type":"warning"|"tip"|"positive","text":"..."}]

Rules:
- Use specific dollar amounts from the data above
- "warning" = concerning spending pattern
- "tip" = actionable suggestion to save money
- "positive" = something the user is doing well
- Keep each insight under 120 characters
- Return ONLY valid JSON — no markdown, no explanation`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system:
        'You are a concise personal finance advisor. You respond ONLY with valid JSON arrays — no markdown fences, no prose.',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawText =
      message.content[0].type === 'text' ? message.content[0].text.trim() : '[]';

    // Extract JSON even if model wraps it
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : '[]';
    const parsed = JSON.parse(jsonStr) as InsightRaw[];

    const insights: AIInsight[] = parsed
      .slice(0, 3)
      .map((item, i) => ({
        id: `insight-${Date.now()}-${i}`,
        text: item.text,
        type: (['warning', 'tip', 'positive'].includes(item.type)
          ? item.type
          : 'tip') as AIInsight['type'],
      }));

    return NextResponse.json({ insights });
  } catch (err) {
    console.error('[insights] Error:', err);
    return NextResponse.json(
      { insights: [], error: 'Unable to generate insights at this time.' },
      { status: 200 }
    );
  }
}
