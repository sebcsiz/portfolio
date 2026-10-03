import type { CoverKind } from "../components/covers/Cover";

export type ResearchItem = {
  title: string;
  kind: "Paper" | "Poster" | "Notes";
  status: "Unpublished" | "In progress" | "Published";
  role: "Sole author" | "Co-author";
  date: string;
  context: string; // course, lab or venue
  summary: string;
  findings: [value: string, label: string][];
  tags: string[];
  links: { label: string; url: string }[];
  cover: CoverKind;
};

// Add entries here; the Research room picks them up automatically.
export const research: ResearchItem[] = [
  {
    title: "Estimating Expected Returns in Options Derivatives Trading Using Likelihood and Bayesian Inference",
    kind: "Paper",
    status: "Unpublished",
    role: "Sole author",
    date: "April 2026",
    context: "STAT 401 · Probability and Statistical Inference, UBC Okanagan",
    summary:
      "Can the expected return of an options strategy be reliably estimated? Using 61,539 cleaned trades from the bendgame Options Market dataset (2017–2019), I estimate the mean Signed Moneyness return with maximum likelihood, bootstrap resampling and Bayesian inference, compare calls vs. puts and in- vs. out-of-the-money contracts, and measure tail risk with bootstrap VaR and CVaR.",
    findings: [
      ["−4.841%", "mean return, 95% CI [−4.902%, −4.780%]"],
      ["p = 0.175", "no call vs. put difference"],
      ["+3.04% / −6.42%", "ITM vs. OTM contracts (p < 0.001)"],
      ["28.8%", "95% CVaR: substantial tail risk"],
    ],
    tags: ["Statistical inference", "MLE", "Bootstrap", "Bayesian", "VaR / CVaR", "Python"],
    links: [
      { label: "Read the paper (PDF)", url: "https://github.com/sebcsiz/Options-Market-Return-Analysis/blob/main/Options%20Paper.pdf" },
      { label: "Code", url: "https://github.com/sebcsiz/Options-Market-Return-Analysis" },
    ],
    cover: "bootstrap",
  },
  {
    title: "Jersey Number Recognition with Vision-Language Models and Collage-Based Aggregation",
    kind: "Paper",
    status: "Unpublished",
    role: "Co-author",
    date: "Spring 2026",
    context: "COSC 419B · Deep Learning, UBC Okanagan",
    summary:
      "Reading a player's jersey number (0–99, or −1 when it never shows) from SoccerNet video tracklets. Building on Koshkina & Elder's jersey recognition framework (CVPR 2024 Workshops), our pipeline upscales crops with Real-ESRGAN, finds the number with OWLv2, tiles up to 25 crops into a single collage, and has a LoRA fine-tuned Qwen3-VL vision-language model read it, aggregating predictions per tracklet.",
    findings: [
      ["49.8% → 76.4%", "Qwen3-VL accuracy, before vs. after LoRA fine-tuning"],
      ["≤ 25", "crops per tracklet collage"],
      ["4-bit", "quantized 2B model, LoRA rank 8"],
    ],
    tags: ["Computer vision", "Vision-language models", "LoRA", "PyTorch", "SoccerNet"],
    links: [{ label: "Code", url: "https://github.com/sebcsiz/jersey-number-recognition-team8" }],
    cover: "jersey",
  },
];
