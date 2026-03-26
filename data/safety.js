window.safetyData = [
  { step:"Step 1", title:"User Input Enters", icon:"fas fa-keyboard", color:"#ef4444", desc:"Raw prompt enters with unknown intent.", inRisk:"Ambiguous instructions or manipulative phrasing.", outRisk:"None yet — the system simply receives data." },
  { step:"Step 2", title:"Interface Layer (UI/UX)", icon:"fas fa-desktop", color:"#f97316", desc:"Input is captured, structured, and context attached.", inRisk:"User error or blind trust in a 'magic box'.", outRisk:"Structured input + UI hints reduce misinterpretation." },
  { step:"Step 3", title:"Behavior Layer (Metaprompt)", icon:"fas fa-user-tie", color:"#eab308", desc:"System defines the AI's role, tone, and boundaries.", inRisk:"Scope drift or 'Ignore previous instructions' attacks.", outRisk:"Instruction hierarchy (System > User) prevents manipulation." },
  { step:"Step 4", title:"Safety Layer (Guardrails)", icon:"fas fa-shield-virus", color:"#84cc16", desc:"Input classified and filtered against safety policies.", inRisk:"Hate speech, self-harm, illegal activities, privacy leaks.", outRisk:"Harmful content blocked, neutralized, or redirected." },
  { step:"Step 5", title:"Model Layer (Foundation)", icon:"fas fa-brain", color:"#10b981", desc:"Core intelligence processes the filtered input.", inRisk:"Weak reasoning causing incoherent answers.", outRisk:"Advanced modeling ensures coherent, reasoned responses." },
  { step:"Step 6", title:"Inference Engine", icon:"fas fa-cogs", color:"#06b6d4", desc:"Tokens processed, attention calculated, output generated.", inRisk:"Context loss or conflicting instructions.", outRisk:"Context windows + priority resolution keep output structured." },
  { step:"Step 7", title:"Reliability Layer", icon:"fas fa-check-double", color:"#3b82f6", desc:"Grounds responses in verified data, manages uncertainty.", inRisk:"Confident hallucination or overgeneralization.", outRisk:"RAG and uncertainty signaling prevent false confidence." },
  { step:"Step 8", title:"Tool Integration", icon:"fas fa-tools", color:"#6366f1", desc:"AI calls external APIs, web search, or calculators.", inRisk:"Outdated knowledge or math errors.", outRisk:"Real-time data fetching eliminates knowledge cut-off limits." },
  { step:"Step 9", title:"Memory Management", icon:"fas fa-memory", color:"#8b5cf6", desc:"Handles session context and long-term preferences.", inRisk:"Repetitive answers, broken continuity.", outRisk:"Continuous thread maintained while sanitizing privacy." },
  { step:"Step 10", title:"Transparency Layer", icon:"fas fa-search", color:"#a855f7", desc:"Exposes sources, confidence scores, reasoning chain.", inRisk:"Black Box problem — users trust without knowing why.", outRisk:"Trust built by making mistakes and sources visible." },
  { step:"Step 11", title:"Monitoring & Audit", icon:"fas fa-chart-line", color:"#ec4899", desc:"Logs interactions, tracks violations, detects abuse.", inRisk:"Undetected degradation or organized abuse.", outRisk:"Continuous logging allows developers to patch exploits." },
  { step:"Step 12", title:"Human Oversight", icon:"fas fa-user-shield", color:"#00d4c8", desc:"Human-in-the-loop review for edge cases.", inRisk:"Algorithmic failures in critical decision-making.", outRisk:"Manual intervention ensures final accountability." },
  { step:"Step 13", title:"EU AI Act (2024)", icon:"fas fa-gavel", color:"#ffcc44", desc:"First comprehensive AI regulation classifying risk tiers.", inRisk:"Non-compliance penalties up to €35M.", outRisk:"Mandatory transparency, banned harmful practices." }
];

window.residualRisks = [
  { name:"Hallucinations", explain:"AI generates plausible but factually wrong information. Occurs when the model lacks relevant data or overgeneralizes learned patterns." },
  { name:"Model Bias", explain:"Systematic errors favoring certain perspectives due to biased training data — leading to unfair or stereotyped outputs." },
  { name:"Zero-Day Jailbreaks", explain:"Novel prompts exploiting unforeseen vulnerabilities to bypass safety filters using creative phrasing or encoded instructions." },
  { name:"Overblocking", explain:"Excessive caution causing the AI to reject harmless requests — reducing usability and frustrating legitimate users." },
  { name:"Prompt Injection", explain:"Malicious input that overrides original instructions, tricking the AI into executing unintended actions or revealing hidden prompts." }
];
