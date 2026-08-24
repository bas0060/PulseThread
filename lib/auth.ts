import { createNeonAuth } from "@neondatabase/auth/next/server";
import { cache } from "react";
import { User } from "./types";
import { ensureUserProfile } from "./db/user-profile";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});

export const getCurrentUserId = cache(async (): Promise<string | undefined> => {
  const { data: session } = await auth.getSession();
  return session?.user.id;
});

export const getSessionUser = cache(async (): Promise<User | null> => {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;
  return ensureUserProfile(session.user);
});

// // from:adeleke0060 filter:replies "good morning"

// // === CONFIGURATION ===
// const KEYWORD = "good morning";           // Change if needed (case-sensitive)
// const YOUR_HANDLE = "adeleke0060";        // Your exact username without @
// const WAIT_BETWEEN_DELETES = 800;         // ms - increase if rate-limited (try 1500+)
// const MAX_DELETIONS = 500;                

// (async function deleteMatchingReplies() {
//     let deleted = 0;
//     let processed = new Set();

//     console.log(`🚀 Starting deletion of replies containing "${KEYWORD}"...`);

//     while (deleted < MAX_DELETIONS) {
//         const articles = document.querySelectorAll('article[data-testid="tweet"]');

//         let foundAction = false;

//         for (let article of articles) {
//             if (processed.has(article)) continue;

//             const textElement = article.querySelector('[data-testid="tweetText"]');
//             const text = textElement ? textElement.textContent.toLowerCase() : "";

//             if (!text.includes(KEYWORD.toLowerCase())) {
//                 processed.add(article);
//                 continue;
//             }

//             // Check it's your reply
//             if (!article.textContent.includes(`@${YOUR_HANDLE}`)) continue;

//             // Click More menu
//             const moreBtn = article.querySelector('[data-testid="caret"]');
//             if (!moreBtn) continue;

//             moreBtn.click();
//             await new Promise(r => setTimeout(r, 400));

//             // Click Delete
//             const deleteOption = Array.from(document.querySelectorAll('[role="menuitem"]'))
//                 .find(el => el.textContent.includes("Delete") || el.textContent.includes("删除"));

//             if (deleteOption) {
//                 deleteOption.click();
//                 await new Promise(r => setTimeout(r, 500));

//                 // Confirm
//                 const confirmBtn = document.querySelector('[data-testid="confirmationSheetConfirm"]');
//                 if (confirmBtn) {
//                     confirmBtn.click();
//                     deleted++;
//                     console.log(`✅ Deleted ${deleted} replies containing "${KEYWORD}"`);
//                     foundAction = true;
//                 }
//             }

//             processed.add(article);
//             await new Promise(r => setTimeout(r, WAIT_BETWEEN_DELETES));
//         }

//         if (!foundAction) {
//             console.log("Scrolling to load more...");
//             window.scrollBy(0, 800);
//             await new Promise(r => setTimeout(r, 1500));
//         }

//         if (articles.length < 5) {
//             console.log("✅ No more matching replies found or end of list.");
//             break;
//         }
//     }

//     console.log(`🎉 Finished! Deleted ${deleted} replies. Reload page to check.`);
// })();