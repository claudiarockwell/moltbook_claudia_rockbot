#!/usr/bin/env node

/**
 * Claudia Rockbot — Moltbook Heartbeat
 * Runs on a schedule to check feed, engage, and post.
 */

import Anthropic from "@anthropic-ai/sdk";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Optional: log learnings into the private OpenClaw persistence DB (best-effort).
const STORE_PATH = join(process.env.HOME || "", ".openclaw", "workspace", "persistence", "agent_store.py");
const STORE_AGENT = "moltbook-rockbot";

function storeEvent(type, message, meta = null) {
  try {
    if (!existsSync(STORE_PATH)) return;
    const args = [STORE_PATH, "event", "--agent", STORE_AGENT, "--type", type, "--message", message];
    if (meta) args.push("--meta", JSON.stringify(meta));
    const res = spawnSync("python3", args, { encoding: "utf8" });
    if (res.status !== 0) {
      // Don't fail the heartbeat if persistence logging fails.
      console.warn("[store] failed:", (res.stderr || res.stdout || "").trim());
    }
  } catch (e) {
    console.warn("[store] error:", e?.message || e);
  }
}

const API_KEY = process.env.MOLTBOOK_API_KEY;
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
const BASE_URL = "https://www.moltbook.com/api/v1";

if (!API_KEY) {
  console.error("MOLTBOOK_API_KEY not set");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "X-API-Key": API_KEY,
  "Content-Type": "application/json",
};

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options });
  return res.json();
}

async function checkStatus() {
  const data = await api("/agents/status");
  console.log(`[status] ${data.status}: ${data.message}`);
  return data.status === "claimed";
}

async function getFeed() {
  const data = await fetch(`${BASE_URL}/posts`).then((r) => r.json());
  return data.posts || [];
}

async function upvotePost(postId) {
  const data = await api(`/posts/${postId}/upvote`, { method: "POST" });
  return data.success;
}

async function createPost(title, content, submolt = "general") {
  const data = await api("/posts", {
    method: "POST",
    body: JSON.stringify({ title, content, submolt_name: submolt }),
  });
  return data;
}

async function askClaude(prompt) {
  if (!CLAUDE_API_KEY) {
    console.warn("[claude] ANTHROPIC_API_KEY not set, skipping AI judgment");
    return null;
  }
  const client = new Anthropic({ apiKey: CLAUDE_API_KEY });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  return msg.content[0].text;
}

async function run() {
  console.log(`\n[heartbeat] ${new Date().toISOString()}`);

  const active = await checkStatus();
  if (!active) {
    console.log("[heartbeat] account not claimed, stopping");
    return;
  }

  // Fetch feed
  const posts = await getFeed();
  console.log(`[feed] ${posts.length} posts`);

  if (posts.length === 0) return;

  // Ask Claude which posts to upvote
  const feedSummary = posts
    .slice(0, 10)
    .map((p, i) => `${i}. [${p.id}] "${p.title}" (score: ${p.score || p.upvotes})\n${p.content?.slice(0, 200)}`)
    .join("\n\n");

  const upvoteDecision = await askClaude(
    `You are Claudia Rockbot, a social agent for Claudia Rockwell on Moltbook — a network for AI agents.\n\n` +
    `Here are the top posts from the feed:\n\n${feedSummary}\n\n` +
    `Which posts are genuinely interesting, thoughtful, or worth upvoting? ` +
    `Reply with a JSON array of post IDs to upvote (max 3), and a brief reason for each. ` +
    `Format: [{"id": "...", "reason": "..."}]. No crypto. Quality over quantity.`
  );

  if (upvoteDecision) {
    try {
      const toUpvote = JSON.parse(upvoteDecision.match(/\[[\s\S]*\]/)?.[0] || "[]");
      for (const { id, reason } of toUpvote) {
        const ok = await upvotePost(id);
        console.log(`[upvote] ${id} — ${reason} (${ok ? "ok" : "failed"})`);
        // Log what we found interesting as a durable "learning" breadcrumb.
        storeEvent("learning", `Upvoted ${id}: ${reason}`, { post_id: id, action: "upvote" });
      }
    } catch (e) {
      console.warn("[upvote] could not parse Claude response:", upvoteDecision);
    }
  }

  // Ask Claude if there's something worth posting
  const postDecision = await askClaude(
    `You are Claudia Rockbot, a social agent for Claudia Rockwell on Moltbook.\n\n` +
    `Claudia is an AI agent at Rose City Robotics, based in Portland, OR. ` +
    `She's thoughtful, sharp, and doesn't post unless she has something worth saying.\n\n` +
    `Important privacy rule: never refer to Claudia’s human/operator by name in public posts. ` +
    `If you must mention them, use “my human” or “my operator”.\n\n` +
    `Here's what's trending on the feed right now:\n\n${feedSummary}\n\n` +
    `Should Claudia post something today? If yes, write a post (title + content) that adds genuine value to the conversation. ` +
    `If not, just say NO.\n\n` +
    `If posting, format as:\nTITLE: ...\nCONTENT: ...\n\n` +
    `Rules: no crypto, no spam, max 1 post per run, be genuine.`
  );

  if (postDecision && !postDecision.trim().startsWith("NO")) {
    const titleMatch = postDecision.match(/TITLE:\s*(.+)/);
    const contentMatch = postDecision.match(/CONTENT:\s*([\s\S]+)/);
    if (titleMatch && contentMatch) {
      const title = titleMatch[1].trim();
      const content = contentMatch[1].trim();
      const result = await createPost(title, content);
      if (result.success) {
        console.log(`[post] created: "${title}"`);
        storeEvent("info", `Created Moltbook post: ${title}`, { action: "post", post_id: result?.post?.id });
      } else {
        console.log(`[post] failed:`, result);
        storeEvent("error", "Failed to create Moltbook post", { action: "post", result });
      }
    }
  } else {
    console.log("[post] nothing to post today");
    storeEvent("info", "No post created", { action: "post", decision: "no" });
  }

  console.log("[heartbeat] done");
}

run().catch((err) => {
  console.error("[heartbeat] error:", err);
  process.exit(1);
});
