import { LegalPage } from "@/components/chrome/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { staticTdk } from "@/seo/tdk.js";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata(staticTdk.terms.title, staticTdk.terms.description, "/terms");

export default function Page() {
  return <LegalPage eyebrow="Use of this website" title="Terms of Service" path="/terms" description={staticTdk.terms.description}>
    <p className="legal-intro">These terms describe the permitted use and limitations of this independent Helping Your Boyfriend website. They apply to our pages and site interface; external games, downloads, videos and hosting services may have separate terms.</p>
    <section><h2>Purpose and independent status</h2>
      <p>We provide player-oriented information about Helping Your Boyfriend, including controls, characters and ending routes, together with a separately hosted browser player where available. We are not the game&apos;s developer, publisher or official support service.</p>
      <p>References to the game, its characters or a creator identify the subject of the page and do not imply an endorsement, partnership or transfer of ownership. Our <a href="/about">About Us</a> page explains the scope of the site.</p>
    </section>
    <section><h2>Permitted use</h2>
      <p>You may browse the public pages and use the provided interface for personal, lawful purposes. You are responsible for using a suitable device, following applicable requirements and deciding whether the game&apos;s content is appropriate for you.</p>
      <p>These terms do not grant a licence to copy game software, redistribute third-party artwork or rehost videos. Permissions for original site text and the distinction between site material and game material are explained on our <a href="/copyright">Copyright</a> page.</p>
    </section>
    <section><h2>Conduct and service protection</h2>
      <p>Do not attempt to gain unauthorised access, introduce malicious code, interfere with other visitors, defeat security controls or impersonate the site or a game creator. Do not use automated requests in a way that disrupts normal access or bypasses access restrictions.</p>
      <p>Reporting a suspected defect does not authorise testing that damages the service or exposes someone else&apos;s information. Contact us with a concise description rather than transmitting credentials, exploiting an account or repeatedly triggering a disruptive action.</p>
    </section>
    <section><h2>Content suitability and spoilers</h2>
      <p>Helping Your Boyfriend contains horror themes, jumpscares, loud sounds, flashing and disturbing images, blood and cartoon gore, violence, drug use and unhealthy relationships. Read the warnings, adjust volume where appropriate and stop if the experience is uncomfortable. Younger visitors should follow applicable age requirements and obtain appropriate guidance from a parent or guardian.</p>
      <p>Characters and Endings discuss later scenes and outcomes. Spoiler notices help you choose when to read, but cannot guarantee that every detail will be considered spoiler-free by every player. The fictional events and relationships depicted are not an endorsement of real-world harmful conduct.</p>
    </section>
    <section><h2>Guidance, versions and accuracy</h2>
      <p>Our pages are intended as practical assistance, not a guarantee of a particular result. Controls, available settings, dialogue and route behaviour can differ between versions or change after an update. The prompt and state in the game you are playing take priority over a general explanation.</p>
      <p>A description of a route does not guarantee that an earlier save contains its prerequisites. Use checkpoints carefully and compare the actual scene before changing a decision. If you notice an error, send the page address and the relevant wording so that the issue can be considered.</p>
    </section>
    <section><h2>External games, video and downloads</h2>
      <p>Starting an embedded game or loading a video connects your browser with a separately operated service. Those providers control their content, technical requirements, privacy practices and availability. A working frame does not establish that the host is the official distributor or that its build matches an official release.</p>
      <p>External providers can change, restrict or remove their content. We cannot guarantee compatibility, uninterrupted playback or the continued availability of any particular build. We do not process purchases made on another website or provide refunds on another provider&apos;s behalf.</p>
    </section>
    <section><h2>Progress, storage and interruptions</h2>
      <p>Game progress may depend on the external player, browser storage or a game&apos;s own save system. We do not operate cloud saves, account recovery or synchronisation between devices. Refreshing, closing a tab, changing devices or clearing browser data can affect a run.</p>
      <p>Before leaving a game, check its available save options. We cannot retrieve a save that is unavailable to us or guarantee that a task can be resumed after a connection failure, browser update or change by the external host.</p>
    </section>
    <section><h2>Availability and limitations</h2>
      <p>The website and its informational content are provided on an as-available basis. To the extent permitted by applicable law, we do not guarantee uninterrupted service, error-free information or fitness for a particular purpose. Access may be interrupted for technical faults, maintenance or security reasons.</p>
      <p>To the extent permitted by applicable law, we are not responsible for losses arising solely from a third-party service, unavailable game progress or reliance on an outdated route description. Nothing in these terms excludes a responsibility or right that cannot lawfully be excluded, or limits a mandatory consumer protection.</p>
    </section>
    <section><h2>Privacy and communications</h2>
      <p>Our <a href="/privacy">Privacy Policy</a> explains technical requests, third-party frames and information sent by email. The site has no account registration, payment checkout, subscription or contact form. Do not provide payment details or login credentials to anyone claiming they are needed to read these pages.</p>
      <p>Questions about these terms can be sent to <span className="legal-email">{siteConfig.contactEmail}</span>. This address is for site matters; it is not an emergency service or the developer&apos;s official support channel.</p>
    </section>
    <section><h2>Changes and applicable requirements</h2>
      <p>We may revise the pages, features and these terms as the site develops. The update month below identifies the published revision. A change does not remove rights that apply to an earlier situation under mandatory law.</p>
      <p>If a provision is unenforceable in a particular situation, the remaining provisions apply only to the extent permitted by law. No clause in these terms requires arbitration or removes a protection that applies under mandatory local law.</p>
    </section>
  </LegalPage>;
}
