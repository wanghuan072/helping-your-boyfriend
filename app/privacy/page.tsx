import { LegalPage } from "@/components/chrome/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { staticTdk } from "@/seo/tdk.js";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata(staticTdk.privacy.title, staticTdk.privacy.description, "/privacy");

export default function Page() {
  return <LegalPage eyebrow="Privacy & personal information" title="Privacy Policy" path="/privacy" description={staticTdk.privacy.description}>
    <p className="legal-intro">This policy explains how this independent Helping Your Boyfriend website handles information when you read our pages, activate external media or contact us. It applies to this website, not to services operated by game hosts, video providers or other third parties.</p>
    <section><h2>Scope and contact</h2>
      <p>The site provides game information, a browser player and the Endings, Characters and Controls pages. It does not offer user accounts, public comments, payment processing, subscriptions or a contact form. You can read the written pages without starting the game.</p>
      <p>For a question about this policy or information connected with a message you sent us, contact <span className="legal-email">{siteConfig.contactEmail}</span>. Please identify the relevant page or correspondence without including unnecessary personal details.</p>
    </section>
    <section><h2>Information involved in a visit</h2>
      <p>Delivering a web page can involve technical information such as an IP address, browser and device details, the requested URL, request time and error information. The hosting infrastructure may record these details in access or security logs to deliver pages, investigate faults and protect the service.</p>
      <p>The written pages do not ask you to provide a name, profile, payment details or game save. We do not operate an account database or a public upload system. A game embedded from another service may process additional information under that service&apos;s own practices.</p>
    </section>
    <section><h2>Cookies, browser storage and measurement</h2>
      <p>The current site application does not intentionally set first-party tracking cookies, create persistent visitor profiles or include advertising or audience-analytics integrations. This statement concerns our application; it does not guarantee that a hosting provider or an external service uses no cookies or similar technology.</p>
      <p>External games may use browser storage for preferences or progress. Browser settings, private browsing, clearing site data or switching devices can affect that information. We do not receive a copy of a game&apos;s save merely because its player appears on our page.</p>
    </section>
    <section><h2>External game player</h2>
      <p>The game frame is requested after you activate Play Now. Until then, the page displays local player artwork and controls rather than loading the game frame. Once activated, the external host may receive connection information and may use cookies, local storage or other technologies required by its service.</p>
      <p>The browser build is separately hosted. We do not control its internal data processing, save format or availability, and it should not be assumed to be the same build as an official download. Review the provider&apos;s information before using its service; choosing not to start the player avoids that frame request.</p>
    </section>
    <section><h2>YouTube videos and external links</h2>
      <p>Gameplay videos use YouTube&apos;s privacy-enhanced embed domain and are configured not to autoplay. Their frames are lazy-loaded, which means a browser can request a video when it approaches the visible part of the page, before you press the video&apos;s play button.</p>
      <p>Loading or playing a video may disclose technical connection information and viewing interactions to YouTube. Privacy-enhanced embedding is not a promise of anonymous use or zero data processing. Following an external link likewise takes you to a service with its own privacy information and terms.</p>
    </section>
    <section><h2>Information you send by email</h2>
      <p>If you contact us, your email provider and ours handle delivery. We may receive your address, the name shown in your message, its contents and any information you choose to attach. We use relevant correspondence to answer your request, correct a page, address an accessibility problem or consider a privacy or rights concern.</p>
      <p>Sending a message does not enrol you in a newsletter. Do not send passwords, payment information, identification documents, private save files or sensitive personal records. Where a screenshot helps explain an issue, remove account names, private messages and other unrelated information first.</p>
    </section>
    <section><h2>Purposes, access and disclosure</h2>
      <p>Information relevant to site operation or a request may be handled to maintain the service, prevent abuse and respond to the issue raised. Where a lawful basis is required, handling must be supported by an applicable basis, such as legitimate interests in maintaining a secure service or meeting a legal obligation, subject to the relevant safeguards.</p>
      <p>Technical hosting and email providers may process information necessary to provide their services. Information may also need to be disclosed where legally required or necessary to address a rights claim or security incident. We do not offer a service for selling visitor information or making email correspondence public.</p>
    </section>
    <section><h2>Retention, security and international services</h2>
      <p>Relevant correspondence should be retained only for as long as needed to handle the request, maintain a necessary record or meet applicable obligations. Hosting logs and email records can have separate provider-controlled retention and backup settings; this notice does not promise a fixed deletion period or immediate removal from every backup.</p>
      <p>No website or email service can guarantee absolute security. Providers may operate infrastructure in more than one country, and the location and safeguards for their processing depend on the service used. Avoid including confidential information that is not necessary for your request.</p>
    </section>
    <section><h2>Your choices and privacy requests</h2>
      <p>You can choose not to activate the game, avoid video sections, adjust browser storage and third-party cookie settings, or use content blockers. These choices can also affect media playback and progress saving. Clearing browser data is not the same as asking an email provider or external game service to erase its records.</p>
      <p>Depending on the law that applies, you may have rights to request access, correction, deletion, restriction or other handling of information about you, and to raise a concern with a relevant supervisory authority. Send a request to the email address above. We may need proportionate information to identify the correspondence concerned; do not send identity documents unless a suitable verification method has been agreed. Requests relating solely to an external provider should be directed to that provider.</p>
    </section>
    <section><h2>Younger visitors and policy changes</h2>
      <p>The game contains mature and potentially disturbing themes. We do not invite children to submit personal information or use an account system to profile them. A parent or guardian concerned about information sent to this site can contact us so that the relevant correspondence can be identified.</p>
      <p>This policy may be revised if the site&apos;s features or information-handling practices change. The month shown at the end indicates the latest published revision. Materially different features, such as accounts or analytics, would require an updated explanation before their introduction.</p>
    </section>
  </LegalPage>;
}
