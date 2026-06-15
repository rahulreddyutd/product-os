# ProductOS — AI Operating System for Product Teams

**Live Demo:** [product-os.vercel.app](https://product-os.vercel.app)

What if every product team had an AI CPO? ProductOS is a 6-agent pipeline that converts raw customer signal — interviews, support tickets, NPS data, feature requests — into a prioritized roadmap, RICE-scored feature board, PRD, KPI framework, and A/B test designs in under 30 seconds.

Most AI tools automate work. ProductOS automates product thinking.

---

## Why This Exists

PMs spend 60-70% of their time collecting and synthesizing signal: reading interview transcripts, triaging ticket themes, debating priorities with stakeholders, writing PRDs from scratch. The output of all that work is a set of decisions: what to build, in what order, for whom, and why.

ProductOS compresses the synthesis layer. It does not replace the PM. It removes the part that doesn't require a PM — pattern recognition across large bodies of unstructured text — so the PM can focus on the part that does: judgment, stakeholder alignment, and tradeoffs.

---

## Architecture

### Agent Pipeline

```
Raw Input (interviews, tickets, NPS, feature requests)
              │
              ▼
┌─────────────────────────┐
│     Research Agent      │  Extracts pain points with source counts and evidence
│                         │  "Mentioned in 8 of 12 interviews, cited in 37% of tickets"
└────────────┬────────────┘
             │
    ┌────────┴────────┐  ← Parallel execution
    ▼                 ▼
┌──────────┐  ┌─────────────────────┐
│Opportunity│  │  Prioritization     │
│  Agent   │  │      Agent          │
│          │  │                     │
│ Sizes    │  │ RICE = (R*I*C) / E  │
│ revenue  │  │ Reach, Impact,      │
│ impact   │  │ Confidence, Effort  │
└────┬─────┘  └──────────┬──────────┘
     └─────────┬──────────┘
               ▼
┌──────────────────────────┐
│      Strategy Agent      │  Quarterly roadmap, KPI framework, strategic memo
│                          │  "What we are NOT building this quarter and why"
└────────────┬─────────────┘
             │
    ┌────────┴────────┐  ← Parallel execution
    ▼                 ▼
┌──────────┐  ┌──────────────────┐
│   PRD    │  │   Experiment     │
│  Agent   │  │     Agent        │
│          │  │                  │
│ Stories  │  │ Hypothesis-first │
│ Criteria │  │ A/B test designs │
│ Metrics  │  │ Rollout plans    │
└──────────┘  └──────────────────┘
```

**Two parallel execution pairs reduce end-to-end latency by ~40%:**
- Opportunity + Prioritization run in parallel (both depend only on Research output)
- PRD + Experiment run in parallel (both depend only on Strategy output)

### The Canonical Output Schema

The output schema was designed first, before writing a single agent. Every agent's extraction logic is designed backward from what the Product Brief needs:

```json
{
  "productName": "B2B SaaS Platform",
  "topPainPoints": [
    {
      "title": "Reporting too basic for enterprise CFOs",
      "frequency": "CRITICAL",
      "sourceCount": 8,
      "affectedSegment": "Enterprise accounts > $200K ARR",
      "evidence": "Lost 8 accounts ($1.1M ARR) to Competitor X citing reporting",
      "revenueRisk": "$2.3M ARR at churn risk"
    }
  ],
  "features": [
    {
      "name": "Custom Reporting Dashboard",
      "reach": 68,
      "impact": 3,
      "confidence": 85,
      "effort": 8,
      "riceScore": 216,
      "priority": "P0",
      "quarter": "Q3",
      "userStory": "As an enterprise admin, I want custom dashboards so my CFO stops exporting to Excel"
    }
  ],
  "strategicMemo": "..."
}
```

The `sourceCount` field on pain points is the key signal that separates evidence-grounded analysis from summarization. "Mentioned in 8 of 12 interviews" is a confidence signal a PM can act on. "Customers want better reporting" is noise.

---

## Key Design Decisions

**Why schema-first?**
Every agent's output was designed backward from what the Product Brief dashboard needed to render. This prevents the failure mode where agents produce rich output that doesn't compose into anything useful downstream.

**Why parallel execution for Opportunity + Prioritization?**
Both depend only on Research Agent output, not on each other. `Promise.all` reduces the total pipeline from ~6 sequential LLM calls to ~4 serial stages. On GPT-4o-mini, this cuts latency from ~45s to ~28s.

**Why a 150-word input minimum?**
Generic input produces generic output. "Our app has churn" gives the agents nothing to work with. The minimum enforces the quality bar that makes the output actually useful — and trains the user to paste real signal, not summaries.

**Why does the Strategy Agent explicitly prompt for what NOT to build?**
Most product strategy documents are lists of things to do. The hardest PM skill is saying no with a reason. Prompting the Strategy Agent to name deliberate exclusions — "We are not building white-label dashboards this quarter because engineering capacity is consumed by PCI Level 1 certification, which is contractually required by Q4" — produces output that reads like a real CPO wrote it, not an AI tool.

**Why RICE over ICE or MoSCoW?**
RICE (Reach * Impact * Confidence / Effort) is the most widely used prioritization framework in B2B product teams. The numeric output creates a defensible ranking that PMs can show to stakeholders. ICE is faster but less rigorous. MoSCoW is qualitative and harder to defend.

---

## Demo Scenarios

Three pre-loaded scenarios, each demonstrating a different agent capability:

| Scenario | Context | What to Watch |
|----------|---------|---------------|
| B2B SaaS Churn Crisis | Enterprise SaaS, $2.3M ARR at risk | Research Agent surfaces reporting as the real churn driver (not UX). Opportunity Agent sizes the retention play at $2.3M. RICE board puts reporting dashboard at P0 above all new features. |
| B2C Consumer App Growth Plateau | Fitness app, D30 retention at 14% vs 22% benchmark | Research Agent identifies social isolation as the root cause, not content quality. Strategy Agent recommends two bets: social graph and adaptive coaching. |
| Enterprise Fintech Feature Backlog | Payments platform, 8 competing priorities | Prioritization Agent RICE-scores all 8 features. PCI Level 1 certification surfaces as P0 (contract penalty risk). Strategy Agent sequences the roadmap to unblock dependent features. |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| AI | OpenAI GPT-4o-mini |
| Agent pattern | Parallel Chain-of-Agents with schema-first output |
| Input | Paste text or upload .txt / .csv / .md |
| Deployment | Vercel |
| Language | TypeScript |

---

## Run Locally

```bash
git clone https://github.com/rahulreddyutd/product-os
cd product-os
npm install
cp .env.local.example .env.local
# Add your OPENAI_API_KEY
npm run dev
```

**Required:**
- `OPENAI_API_KEY` — powers all six agents

**Input quality note:** Paste at least 150 words of real customer signal. The agents are calibrated for interview transcripts, ticket exports, NPS verbatims, and sales call notes. Summaries produce weaker output than raw data.

---

## What This Demonstrates

**For Senior AI PM roles:**
- Product thinking as architecture: the strategic memo prompt, the schema-first design, the 150-word minimum all reflect PM judgment built into the system
- Framework fluency: RICE scoring, hypothesis-format experiments, acceptance criteria structure
- AI evaluation instinct: sourceCount as a confidence signal, confidence normalization, input quality enforcement

**For Senior AI ML Engineer roles:**
- Parallel agent execution with `Promise.all`
- Structured JSON output at every agent boundary
- Type-safe data flow from model output to UI rendering
- Input validation with UX feedback

---

## Related Projects

- **[RegulatedAI](https://regulated-ai.vercel.app)** — Financial advisory and legal intelligence with compliance-by-architecture
- **[ExecutiveAI](https://executive-ai.vercel.app)** — AI Chief of Staff with approval queue and decision memory

---

Built by [Rahul Reddy](https://www.linkedin.com/in/rahulreddypuchakayala/) | Product Manager at Capital One | [GitHub](https://github.com/rahulreddyutd)
