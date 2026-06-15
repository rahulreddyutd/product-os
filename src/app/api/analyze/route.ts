import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AgentStep, PainPoint, Opportunity, Feature, RoadmapQuarter, KPI, Experiment, PRDSection, ProductBrief } from "@/lib/types";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function llm(system: string, user: string): Promise<string> {
  const openai = getOpenAI();
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini", temperature: 0,
    messages: [{ role: "system", content: system }, { role: "user", content: user }],
    response_format: { type: "json_object" },
  });
  return res.choices[0].message.content ?? "{}";
}

// ─── Agent 1: Research Agent ──────────────────────────────────────────────────

async function runResearchAgent(input: string, context: string): Promise<string> {
  return llm(
    `You are the Research Agent in ProductOS — an AI CPO system.
Analyze customer interviews, support tickets, NPS data, and feedback to surface the real pain points.
Return JSON:
{
  "painPoints": [
    {
      "title": "concise pain point title",
      "frequency": "CRITICAL|HIGH|MEDIUM|LOW",
      "sourceCount": <approximate number of distinct sources mentioning this — interviews, tickets, reviews>,
      "affectedSegment": "who experiences this most",
      "evidence": "direct quote or specific data from the input with numbers",
      "revenueRisk": "$ amount at risk if not addressed, or null"
    }
  ],
  "topInsight": "the single most important finding — the thing that should change the product direction",
  "underservedSegment": "which customer segment is most underserved right now"
}
Extract 4-6 pain points. Ground every finding in specific evidence — cite quotes, percentages, dollar amounts.
For sourceCount: count distinct sources (interviews, ticket categories, review themes) that mention this pain. Be specific — "8 of 12 interviews" becomes sourceCount: 8. "312 of 847 tickets" becomes sourceCount: 312.`,
    `Product context: ${context}\n\nInput:\n${input.slice(0, 3000)}`
  );
}

// ─── Agent 2: Opportunity Agent ───────────────────────────────────────────────

async function runOpportunityAgent(input: string, context: string, researchOutput: string): Promise<string> {
  return llm(
    `You are the Opportunity Agent in ProductOS — an AI CPO system.
Identify the highest-value product opportunities based on customer pain and market signals.
Return JSON:
{
  "opportunities": [
    {
      "title": "opportunity title",
      "type": "acquisition|retention|expansion|efficiency",
      "revenueImpact": "specific $ or % estimate with rationale",
      "confidence": 0-100,
      "rationale": "why this opportunity is significant and winnable",
      "linkedPainPoint": "which pain point this addresses"
    }
  ],
  "biggestBet": "the single highest-leverage opportunity and why"
}
Identify 3-4 opportunities. Be specific about revenue impact — use numbers from the input where available.`,
    `Context: ${context}\n\nResearch findings:\n${researchOutput}\n\nRaw input:\n${input.slice(0, 1500)}`
  );
}

// ─── Agent 3: Prioritization Agent ───────────────────────────────────────────

async function runPrioritizationAgent(input: string, context: string, researchOutput: string, opportunityOutput: string): Promise<string> {
  return llm(
    `You are the Prioritization Agent in ProductOS — an AI CPO system.
Generate a RICE-scored feature list from the pain points and opportunities.
RICE = (Reach * Impact * Confidence) / Effort
- Reach: % of users affected (0-100)
- Impact: 1=minimal, 2=significant, 3=massive
- Confidence: % confidence in estimates (0-100)
- Effort: weeks of engineering work
Return JSON:
{
  "features": [
    {
      "name": "feature name",
      "description": "what it does and why",
      "reach": 0-100,
      "impact": 1-3,
      "confidence": 0-100,
      "effort": weeks,
      "riceScore": computed,
      "priority": "P0|P1|P2|P3",
      "quarter": "Q3|Q4|Q1|Q2|Backlog",
      "userStory": "As a [user], I want [feature] so that [outcome]"
    }
  ]
}
Generate 5-7 features. P0 = do now or something breaks. P1 = this quarter. P2 = next quarter. P3 = backlog.
Sort by RICE score descending.`,
    `Context: ${context}\n\nResearch:\n${researchOutput}\n\nOpportunities:\n${opportunityOutput}`
  );
}

// ─── Agent 4: Strategy Agent ──────────────────────────────────────────────────

async function runStrategyAgent(context: string, researchOutput: string, opportunityOutput: string, prioritizationOutput: string): Promise<string> {
  return llm(
    `You are the Strategy Agent in ProductOS — an AI CPO system.
Create a quarterly roadmap, KPI framework, and strategic memo.
Return JSON:
{
  "roadmap": [
    {
      "quarter": "Q3 2025",
      "theme": "one-word quarterly theme",
      "features": ["feature name 1", "feature name 2"],
      "successMetric": "how we know this quarter succeeded"
    }
  ],
  "kpis": [
    {
      "name": "metric name",
      "type": "north_star|adoption|retention|revenue|engagement",
      "current": "current value if available",
      "target": "target value",
      "measurement": "how to measure this"
    }
  ],
  "strategicMemo": "3-4 paragraph strategic memo in the voice of a CPO. What's the diagnosis, what's the strategy, what are we NOT doing and why, what does success look like in 12 months."
}
Be specific. Name actual features in the roadmap quarters. The strategic memo should sound like it came from a real CPO, not a template.`,
    `Context: ${context}\n\nResearch:\n${researchOutput}\n\nOpportunities:\n${opportunityOutput}\n\nPrioritized features:\n${prioritizationOutput}`
  );
}

// ─── Agent 5: PRD Agent ───────────────────────────────────────────────────────

async function runPRDAgent(context: string, prioritizationOutput: string, strategyOutput: string): Promise<string> {
  return llm(
    `You are the PRD Agent in ProductOS — an AI CPO system.
Write a concise PRD for the highest-priority (P0/P1) feature.
Return JSON:
{
  "prd": {
    "feature": "feature name",
    "problemStatement": "what problem this solves and for whom",
    "userStories": ["As a...", "As a..."],
    "acceptanceCriteria": ["Given... When... Then...", "..."],
    "successMetrics": ["metric and target"],
    "outOfScope": ["what we are explicitly NOT building in v1"]
  }
}
Write 3-4 user stories, 4-5 acceptance criteria, 3 success metrics, 3 out-of-scope items.
Be specific and actionable — a real engineer should be able to build from this.`,
    `Context: ${context}\n\nPrioritized features:\n${prioritizationOutput}\n\nStrategy:\n${strategyOutput}`
  );
}

// ─── Agent 6: Experiment Agent ────────────────────────────────────────────────

async function runExperimentAgent(context: string, prioritizationOutput: string, strategyOutput: string): Promise<string> {
  return llm(
    `You are the Experiment Agent in ProductOS — an AI CPO system.
Design A/B tests and experiments for the top 2-3 features.
Return JSON:
{
  "experiments": [
    {
      "name": "experiment name",
      "hypothesis": "If we [change], then [metric] will [improve] because [reason]",
      "variant": "what the test variant looks like",
      "successMetric": "primary metric and minimum detectable effect",
      "rolloutPlan": "% traffic, duration, rollout stages",
      "linkedFeature": "which feature this validates"
    }
  ]
}
Design 2-3 experiments. Be specific about hypothesis format, sample size implications, and rollout stages.`,
    `Context: ${context}\n\nPrioritized features:\n${prioritizationOutput}\n\nStrategy:\n${strategyOutput}`
  );
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { input = "", context = "Product team" } = await req.json();
    if (!input.trim()) return NextResponse.json({ error: "No input provided" }, { status: 400 });

    const steps: AgentStep[] = [];
    const addStep = (agent: string, role: string, status: AgentStep["status"], output?: string, durationMs?: number) => {
      steps.push({ agent, role, status, output, timestamp: new Date().toISOString(), durationMs });
    };

    // ── Agent 1: Research ──
    addStep("Research Agent", "Analyzing interviews, tickets, and feedback", "running");
    const t1 = Date.now();
    const researchRaw = await runResearchAgent(input, context);
    const research = JSON.parse(researchRaw);
    steps[steps.length - 1] = { ...steps[steps.length - 1], status: "done", durationMs: Date.now() - t1,
      output: `Identified ${research.painPoints?.length ?? 0} pain points. Top insight: ${research.topInsight ?? ""}` };

    // ── Agents 2 + 3 run in parallel — both depend only on Research ──
    addStep("Opportunity Agent", "Sizing revenue opportunities from pain signals", "running");
    addStep("Prioritization Agent", "RICE-scoring features against capacity", "running");
    const t23 = Date.now();
    const [opportunityRaw, prioritizationRaw] = await Promise.all([
      runOpportunityAgent(input, context, researchRaw),
      runPrioritizationAgent(input, context, researchRaw, "pending"),
    ]);
    const opportunity = JSON.parse(opportunityRaw);
    const prioritization = JSON.parse(prioritizationRaw);
    const dur23 = Date.now() - t23;
    steps[steps.length - 2] = { ...steps[steps.length - 2], status: "done", durationMs: dur23,
      output: `Found ${opportunity.opportunities?.length ?? 0} opportunities. Biggest bet: ${opportunity.biggestBet?.slice(0, 80) ?? ""}` };
    steps[steps.length - 1] = { ...steps[steps.length - 1], status: "done", durationMs: dur23,
      output: `Scored ${prioritization.features?.length ?? 0} features. Top RICE: ${prioritization.features?.[0]?.name ?? ""} (${prioritization.features?.[0]?.riceScore ?? 0})` };

    // ── Agent 4: Strategy ──
    addStep("Strategy Agent", "Building roadmap, KPIs, and strategic memo", "running");
    const t4 = Date.now();
    const strategyRaw = await runStrategyAgent(context, researchRaw, opportunityRaw, prioritizationRaw);
    const strategy = JSON.parse(strategyRaw);
    steps[steps.length - 1] = { ...steps[steps.length - 1], status: "done", durationMs: Date.now() - t4,
      output: `${strategy.roadmap?.length ?? 0}-quarter roadmap. North star: ${strategy.kpis?.find((k: KPI) => k.type === "north_star")?.name ?? strategy.kpis?.[0]?.name ?? ""}` };

    // ── Agents 5 + 6 run in parallel ──
    addStep("PRD Agent", "Writing requirements for top-priority feature", "running");
    addStep("Experiment Agent", "Designing A/B tests and rollout plans", "running");
    const t56 = Date.now();
    const [prdRaw, experimentRaw] = await Promise.all([
      runPRDAgent(context, prioritizationRaw, strategyRaw),
      runExperimentAgent(context, prioritizationRaw, strategyRaw),
    ]);
    const prdData = JSON.parse(prdRaw);
    const experimentData = JSON.parse(experimentRaw);
    const dur56 = Date.now() - t56;
    steps[steps.length - 2] = { ...steps[steps.length - 2], status: "done", durationMs: dur56,
      output: `PRD drafted for "${prdData.prd?.feature ?? ""}". ${prdData.prd?.userStories?.length ?? 0} user stories, ${prdData.prd?.acceptanceCriteria?.length ?? 0} acceptance criteria.` };
    steps[steps.length - 1] = { ...steps[steps.length - 1], status: "done", durationMs: dur56,
      output: `Designed ${experimentData.experiments?.length ?? 0} experiments. First: "${experimentData.experiments?.[0]?.name ?? ""}"` };

    const brief: ProductBrief = {
      productName: context,
      context,
      executiveSummary: research.topInsight ?? "",
      topPainPoints: research.painPoints ?? [],
      opportunities: opportunity.opportunities ?? [],
      features: prioritization.features ?? [],
      roadmap: strategy.roadmap ?? [],
      kpis: strategy.kpis ?? [],
      experiments: experimentData.experiments ?? [],
      prd: prdData.prd ?? {},
      strategicMemo: strategy.strategicMemo ?? "",
      inputWordCount: input.split(/\s+/).length,
      processingTimeMs: Date.now() - startTime,
    };

    return NextResponse.json({ steps, brief });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg, steps: [] }, { status: 500 });
  }
}
