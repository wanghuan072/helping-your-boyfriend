import { LegalPage } from "@/components/chrome/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { staticTdk } from "@/seo/tdk.js";
import { siteConfig } from "@/config/site";
import mainGame from "@/data/games/main-game.json";

export const metadata = pageMetadata(staticTdk.about.title, staticTdk.about.description, "/about");

export default function Page() {
  return <LegalPage eyebrow="An independent player companion" title="About Us" path="/about" description={staticTdk.about.description}>
    <p className="legal-intro">We focus on one game: Helping Your Boyfriend. Our aim is to make it easier to start a run, understand the people in the story and return to a difficult choice without turning every page into the same long walkthrough.</p>
    <section><h2>What you can find here</h2>
      <p>The <a href="/">Home page</a> places the browser player alongside an introduction to the game&apos;s nightly routine. We keep the main game in one place instead of sending you through a catalogue of unrelated titles.</p>
      <p>The three companion pages answer different questions: who we are dealing with, how we carry out an action and where a choice can lead. You can read them separately according to what you need at that moment.</p>
    </section>
    <section><h2>Endings: choices and consequences</h2>
      <p>The <a href="/endings">Endings page</a> brings the four named outcomes together with their relevant choices and shared investigation steps. Its purpose is to make the relationship between an earlier action and a later outcome easier to follow.</p>
      <p>We keep shared steps together and use checkpoint advice to distinguish replaying an input from revisiting a story decision. The page discusses major spoilers and is best opened when you are ready to compare outcomes rather than discover them blind.</p>
    </section>
    <section><h2>Characters: people beyond a route label</h2>
      <p>The <a href="/characters">Characters page</a> introduces our protagonist, Dr. Adrian Winchester, Ian and Oliver through their roles, first impressions and later involvement. It separates character interpretation from a step-by-step route checklist.</p>
      <p>We look at what changes in a familiar conversation as the story develops. A character profile is not a promise that someone is safe, a numerical affection chart or a claim that every named character has a romance route.</p>
    </section>
    <section><h2>Controls: help at the point of interaction</h2>
      <p>The <a href="/controls">Controls page</a> combines a quick input reference with illustrated dialogue and doll-work instructions, timed-task guidance and recovery checks. We want a player to find the next useful action without searching through a full ending guide.</p>
      <p>Input and difficulty options may differ between builds and devices. The instruction visible in your current game takes priority. Keeping a nearby task checkpoint can make a retry simpler without changing earlier relationship choices.</p>
    </section>
    <section><h2>Reading at your own pace</h2>
      <p>We keep the written material available without requiring you to start the game or play a video. Sections are directly readable, and later character or ending material is introduced with spoiler warnings rather than a click-to-unlock system.</p>
      <p>Our wording is player-focused: we describe what we can notice, choose or try. Interpretations of a scene are not the same as a confirmed hidden rule, and a suggested replay approach is not a guarantee of the same result in every build.</p>
    </section>
    <section><h2>Independent status and creator credit</h2>
      <p>{mainGame.title} was created by {mainGame.credits.creators.join(" and ")}. Visit the <a href={mainGame.credits.officialUrl} rel="noopener noreferrer">official game page on itch.io</a> for creator announcements and the original downloads.</p>
      <p>This site is independently maintained. We are not the developer or publisher of Helping Your Boyfriend and do not claim official support status, endorsement or ownership of the game&apos;s characters, software, music or artwork.</p>
      <p>Game images and embedded media remain associated with their respective rights holders. Questions about original game distribution, purchases or development should be directed to the relevant creator or platform. Our <a href="/copyright">Copyright page</a> explains how to raise a concern about material used here.</p>
    </section>
    <section><h2>Features and limits</h2>
      <p>The site does not offer accounts, public comments, ratings, uploads, purchases, subscriptions, advertisements or a contact form. We do not operate the game&apos;s save system, promise cross-device progress or recover private game data.</p>
      <p>The browser player and gameplay videos are separately operated services. Their availability and privacy practices can differ from those of the written pages. Our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a> explain those boundaries.</p>
    </section>
    <section><h2>Corrections and accessibility</h2>
      <p>If a passage is unclear, a control is difficult to use or a page does not match the scene in your version, you can tell us what you encountered. The page address, relevant wording and a short description of your device are usually more useful than a large attachment.</p>
      <p>Contact <span className="legal-email">{siteConfig.contactEmail}</span> for site-related questions. We welcome specific corrections and accessibility feedback, without promising a particular outcome or response time. The month at the end of each page indicates its latest published revision.</p>
    </section>
  </LegalPage>;
}
