// ─── Agent step ───────────────────────────────────────────────────────────────

export interface AgentStep {
  agent: string;
  role: string;
  status: "running" | "done" | "error";
  output?: string;
  durationMs?: number;
  timestamp: string;
}

// ─── Output types ─────────────────────────────────────────────────────────────

export interface PainPoint {
  title: string;
  frequency: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  sourceCount?: number;     // "mentioned in 8 of 12 interviews" — the evidence signal
  affectedSegment: string;
  evidence: string;
  revenueRisk?: string;
}

export interface Opportunity {
  title: string;
  type: "acquisition" | "retention" | "expansion" | "efficiency";
  revenueImpact: string;
  confidence: number;     // 0-100
  rationale: string;
  linkedPainPoint: string;
}

export interface Feature {
  name: string;
  description: string;
  reach: number;          // % users affected (R in RICE)
  impact: number;         // 1-3 scale
  confidence: number;     // 0-100
  effort: number;         // weeks
  riceScore: number;      // computed: (R * I * C) / E
  priority: "P0" | "P1" | "P2" | "P3";
  quarter: "Q3" | "Q4" | "Q1" | "Q2" | "Backlog";
  userStory: string;
}

export interface RoadmapQuarter {
  quarter: string;
  theme: string;
  features: string[];
  successMetric: string;
}

export interface KPI {
  name: string;
  type: "north_star" | "adoption" | "retention" | "revenue" | "engagement";
  current?: string;
  target: string;
  measurement: string;
}

export interface Experiment {
  name: string;
  hypothesis: string;
  variant: string;
  successMetric: string;
  rolloutPlan: string;
  linkedFeature: string;
}

export interface PRDSection {
  feature: string;
  problemStatement: string;
  userStories: string[];
  acceptanceCriteria: string[];
  successMetrics: string[];
  outOfScope: string[];
}

// ─── Master output ────────────────────────────────────────────────────────────

export interface ProductBrief {
  productName: string;
  context: string;           // B2B SaaS / B2C / etc
  executiveSummary: string;
  topPainPoints: PainPoint[];
  opportunities: Opportunity[];
  features: Feature[];
  roadmap: RoadmapQuarter[];
  kpis: KPI[];
  experiments: Experiment[];
  prd: PRDSection;
  strategicMemo: string;
  inputWordCount: number;
  processingTimeMs: number;
}

export interface AnalysisResult {
  steps: AgentStep[];
  brief: ProductBrief | null;
  error?: string;
}

// ─── Preset scenarios ─────────────────────────────────────────────────────────

export interface Preset {
  id: string;
  label: string;
  context: string;
  tag: string;
  tagColor: string;
  narrative: string;
  input: string;
}

export const PRESETS: Preset[] = [
  {
    id: "b2b-churn",
    label: "B2B SaaS — Churn Crisis",
    context: "B2B SaaS",
    tag: "Retention play",
    tagColor: "#f87171",
    narrative: "14 enterprise accounts at churn risk, $2.3M ARR exposed. Watch the Research Agent surface the real pain (reporting gaps, not features), the Opportunity Agent size the retention play, and the Prioritization Agent RICE-score the fix against new feature requests.",
    input: `CUSTOMER INTERVIEW NOTES — Q2 Retention Review

Interview 1 — Acme Corp ($340K ARR, renewal in 45 days)
"Honestly the product is fine but we can't get the reports our CFO needs. We export to Excel every week and rebuild the charts ourselves. That's 3 hours a week for my analyst. We're evaluating Competitor X specifically because they have custom dashboards."

Interview 2 — Meridian Health ($210K ARR, renewal in 60 days)
"Onboarding took 6 weeks. That's not acceptable for a SaaS tool. By the time our team was trained, two key users had left and we had to start over. The core functionality is great but we almost churned in month 3."

Interview 3 — TechBridge ($180K ARR, just renewed but flagged)
"The API documentation is outdated. Our engineers spent 2 weeks on an integration that should have taken 2 days. We submitted 4 support tickets and got generic responses. Almost went with a competitor mid-integration."

SUPPORT TICKETS — Last 90 days (n=847 tickets)
- Reporting/exports: 312 tickets (37%) — "can't filter by custom date range", "need PDF export", "chart won't load for date ranges > 90 days"
- Onboarding/setup: 198 tickets (23%) — "how do I add team members", "SSO setup failing", "import taking too long"
- API/integrations: 156 tickets (18%) — "webhook not firing", "API rate limit too low for our use case", "documentation doesn't match actual behavior"
- Billing: 89 tickets (11%)
- Other: 92 tickets (11%)

NPS SURVEY — 340 respondents
NPS: 31 (industry avg: 40)
Most common negative themes:
- "Reporting is too basic" (mentioned 89 times)
- "Slow to get started" (mentioned 67 times)
- "API limits too restrictive" (mentioned 45 times)

Most common positive themes:
- "Core workflow is intuitive" (mentioned 124 times)
- "Customer support team is responsive" (mentioned 98 times)

CHURN ANALYSIS — Last 2 quarters
Churned accounts cited:
- "Moved to competitor with better reporting" (8 accounts, $1.1M ARR)
- "Couldn't get team adoption" (5 accounts, $0.6M ARR)
- "Technical integration issues" (3 accounts, $0.4M ARR)

SALES CALL NOTES — Lost deals (last quarter)
- Lost to Competitor X (6 deals, $800K ACV): all cited reporting capabilities as deciding factor
- Lost to Competitor Y (4 deals, $520K ACV): cited SSO/enterprise security requirements
- No decision (5 deals, $340K ACV): cited implementation complexity

PRODUCT METRICS
- DAU/MAU: 34% (industry benchmark: 45%)
- Feature adoption — core workflow: 78%, reporting: 31%, API: 19%, integrations: 22%
- Time to first value: 23 days average (target: 7 days)
- Support ticket resolution: 2.4 days average`,
  },
  {
    id: "b2c-growth",
    label: "B2C App — Growth Plateau",
    context: "B2C Consumer App",
    tag: "Growth play",
    tagColor: "#4ade80",
    narrative: "A consumer fitness app that hit a growth wall after strong early traction. Watch the Opportunity Agent identify the social and habit-loop gaps driving D30 retention collapse, and the Strategy Agent recommend the two bets that move the north star metric.",
    input: `USER RESEARCH — FitFlow App (iOS/Android, 340K MAU)

APP STORE REVIEWS — Last 90 days (n=2,847 reviews, avg 3.2 stars)

1-2 star reviews (common themes):
"I was really motivated for the first two weeks but then the workouts started feeling repetitive. I've done the same three routines 15 times. Cancelled my subscription." — 847 reviews mention repetitiveness
"None of my friends use this app so it feels lonely. I want to see what others are doing." — 612 reviews mention social isolation
"The app knows I haven't worked out in 5 days but just sends the same generic push notification. Feels like it doesn't know me." — 534 reviews mention generic notifications
"I completed a 30-day challenge and then had no idea what to do next. No progression path." — 423 reviews mention lack of progression

4-5 star reviews (common themes):
"The workout quality is genuinely excellent. Better than YouTube videos." — 1,247 reviews
"Love the variety of instructors." — 892 reviews
"Easy to use when I actually open it." — 678 reviews

USER INTERVIEWS — 12 churned users, 8 retained users

Churned user patterns:
- All 12 cited loss of novelty after week 3-4
- 9/12 said they had no friends on the platform
- 8/12 said they felt "invisible" — no one knew if they worked out or not
- 7/12 said they wanted a coach/accountability partner

Retained user patterns:
- 7/8 had completed at least one challenge with a friend or partner
- All 8 used the streak feature actively
- 6/8 had set a specific goal (5K run, weight loss target)

PRODUCT METRICS
- D1 retention: 61%
- D7 retention: 38%
- D30 retention: 14% (industry benchmark for fitness apps: 22%)
- D90 retention: 6%
- Average sessions before churn: 11 sessions
- Sessions/week (active users): 3.2
- Social connections per user: 0.3 (most users have zero friends on platform)
- Challenge completion rate: 23%
- Streak >7 days: 18% of users

GROWTH METRICS
- Organic install rate: 34%
- Paid install rate: 66%
- Referral rate: 2.1% (sending referral link)
- Referral conversion: 8.4%
- CAC: $4.20
- LTV (current): $18.40
- LTV/CAC: 4.4x (target: 6x)

FEATURE REQUESTS (in-app feedback, n=1,240)
- "Add friends / see what friends are doing" — 423 requests
- "AI coach that adapts to my progress" — 387 requests
- "More variety / new workouts every week" — 298 requests
- "Challenges with real prizes" — 187 requests
- "Apple Watch / wearable integration" — 156 requests
- "Nutrition tracking" — 134 requests`,
  },
  {
    id: "fintech-backlog",
    label: "Enterprise Fintech — Feature Backlog",
    context: "Enterprise Fintech / B2B",
    tag: "Prioritization challenge",
    tagColor: "#d4a547",
    narrative: "A payments platform with 3 years of feature requests, competing priorities from Sales, Engineering, and Compliance, and a finite team. Watch the Prioritization Agent RICE-score 8 competing features and the Strategy Agent cut through the noise to recommend the quarterly sequence.",
    input: `FEATURE BACKLOG REVIEW — PayStream Enterprise (B2B Payments Platform)
Context: $12M ARR, 180 enterprise customers, 22-person engineering team

SALES-REQUESTED FEATURES (from lost deals and renewals)
1. Multi-currency support — "Lost 8 deals worth $1.4M ACV to competitors who support EUR, GBP, CAD natively. Every enterprise with international operations asks for this on first call." — Head of Sales
2. Real-time fraud scoring API — "3 enterprise banks want this. Combined ACV $2.1M. Currently blocked at security review because we can't prove sub-100ms response time." — Sales Engineer
3. White-label dashboard — "Fintech customers want to embed our reconciliation UI in their own product. 6 prospects asked for this. Estimated $900K ACV." — Sales
4. SSO / SAML support — "Every deal over $200K gets blocked at IT security review without SSO. We've lost 4 deals this quarter." — Sales

ENGINEERING-REQUESTED FEATURES (technical debt and infrastructure)
5. API rate limit increase and new SDK — "Our current rate limits are blocking 3 customers from scaling. Two are threatening to churn. The SDK is 2 years old and doesn't support async/await. Every integration takes twice as long as it should." — Engineering Lead
6. Database migration to distributed architecture — "We're hitting performance limits. P95 latency is 340ms and climbing. This is a 3-month project but without it we can't support any of the above features reliably." — CTO

COMPLIANCE-REQUESTED FEATURES
7. SOC 2 Type II audit trail — "We can't sell to banks or insurance companies without this. It's not optional — it's a compliance requirement for 40% of our TAM." — Head of Compliance
8. PCI DSS Level 1 certification — "Currently Level 2. Level 1 required by 6 existing customers in their contracts. If we don't certify by Q4, we face $2.4M in contract penalties." — Legal

CUSTOMER FEEDBACK (NPS interviews, n=34 enterprise customers)
NPS: 42
"The core payment processing is rock solid. That's why we stay." (mentioned 28 times)
"We're routing around your API limits with workarounds. It's embarrassing to explain to our engineers." (mentioned 12 times)
"We need multi-currency. Our CFO asked me last week why we're still on a single-currency platform." (mentioned 9 times)
"Response times have gotten slower. Our SLA to our customers is 99.9% uptime. Your P95 is making that hard." (mentioned 8 times)

ENGINEERING CAPACITY
- 22 engineers total, 6 dedicated to infrastructure/on-call
- 16 available for product development
- Current velocity: ~8 story points per engineer per sprint
- Estimated capacities: Multi-currency (16 weeks), Fraud API (10 weeks), White-label (14 weeks), SSO (6 weeks), API SDK (8 weeks), DB migration (12 weeks), SOC 2 (20 weeks), PCI Level 1 (24 weeks)`,
  },
];
