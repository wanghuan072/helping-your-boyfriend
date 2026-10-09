import { LegalPage } from "@/components/chrome/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { staticTdk } from "@/seo/tdk.js";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata(staticTdk.contact.title, staticTdk.contact.description, "/contact");

export default function Page() {
  return <LegalPage eyebrow="Site support & feedback" title="Contact Us" path="/contact" description={staticTdk.contact.description}>
    <p className="legal-intro">Use this contact channel for questions about this website, factual corrections, accessibility feedback, privacy requests and rights concerns. We are an independent player-help site, not the game&apos;s official support service.</p>
    <section><h2>Email address</h2>
      <p className="contact-address">{siteConfig.contactEmail}</p>
      <p>The address is displayed as plain text. There is no contact form, message uploader or account registration on this site. Compose a message through your own email service; we do not collect a draft while you read this page.</p>
    </section>
    <section><h2>Choose a useful subject</h2>
      <p>A clear subject helps distinguish the type of request. Suggested subjects are listed below; you do not need to provide more personal information than is necessary to explain the issue.</p>
      <ul><li><strong>Content correction:</strong> a character description, control or route explanation that needs attention.</li><li><strong>Technical issue:</strong> a broken page, game frame, video or navigation link.</li><li><strong>Accessibility:</strong> a reading, keyboard, layout or contrast problem on the site.</li><li><strong>Privacy request:</strong> a question about information related to your visit or correspondence.</li><li><strong>Copyright or attribution:</strong> a concern about a specific image, passage or media item.</li></ul>
    </section>
    <section><h2>For a content correction</h2>
      <p>Include the page URL, section heading and the sentence or instruction concerned. Explain what you expected and what differs in the version you are playing. If a build number or platform is visible, include it without guessing.</p>
      <p>Please distinguish a factual error from a different interpretation of a character or ending. When the issue involves spoilers, mention that in the subject so the message can be read with the appropriate context.</p>
    </section>
    <section><h2>For a technical or accessibility issue</h2>
      <p>Tell us your device type, browser and operating system when relevant. Describe the action you took, what happened and whether the issue repeats. For example, say whether the page loaded but a control failed, or the game frame never appeared.</p>
      <p>A short, redacted screenshot may help explain a visual problem. Remove account names, private conversations and other unrelated information. Do not send executable files, passwords, private game saves or a full device log containing personal data.</p>
    </section>
    <section><h2>For privacy and copyright matters</h2>
      <p>For privacy questions, explain which visit or email exchange your request concerns and the action you are asking about. See our <a href="/privacy">Privacy Policy</a> for the site&apos;s current information-handling scope. A request about a separate game or video provider may need to be sent directly to that provider.</p>
      <p>For a rights concern, identify the original work, exact page and material involved, your connection to the rights holder and the correction or action requested. Our <a href="/copyright">Copyright page</a> provides a more detailed checklist. Do not send unnecessary identity documents in an initial message.</p>
    </section>
    <section><h2>What we can and cannot help with</h2>
      <p>We can consider issues with our writing, page presentation, links and use of media. We may ask for clarification when the issue cannot be identified from the initial message. Reporting an issue does not guarantee a particular correction or technical solution.</p>
      <p>We cannot recover third-party game progress, change a game&apos;s code, issue a creator&apos;s refund, manage a platform account or provide emergency, medical or legal advice. Questions about a purchase or the official downloadable game belong with the creator or the platform that supplied it.</p>
    </section>
    <section><h2>Replies and safe communication</h2>
      <p>No response deadline or continuous support availability is promised. Sending a message does not subscribe you to updates. Email can pass through external providers, so include only the details needed for the request and avoid information you would not want handled by email.</p>
      <p>Do not send payment data, login credentials or sensitive personal records. We do not ask for payment or an account password to consider a site correction. If you are unsure about a message claiming to represent this site, use the address displayed on this page to raise the concern.</p>
    </section>
  </LegalPage>;
}
