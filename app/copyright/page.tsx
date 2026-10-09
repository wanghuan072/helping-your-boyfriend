import { LegalPage } from "@/components/chrome/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { staticTdk } from "@/seo/tdk.js";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata(staticTdk.copyright.title, staticTdk.copyright.description, "/copyright");

export default function Page() {
  return <LegalPage eyebrow="Ownership & rights requests" title="Copyright" path="/copyright" description={staticTdk.copyright.description}>
    <p className="legal-intro">This page distinguishes original website material from the game and third-party media, and explains how to raise an attribution, permission or removal concern. Displaying a work here does not transfer its ownership.</p>
    <section><h2>Original website material</h2>
      <p>Original writing, layout and interface material belong to their respective authors or rights holders to the extent protected by applicable law. The site does not claim ownership of elements for which it has no rights, including third-party software, fonts and game artwork.</p>
      <p>You may link to our public pages. Any quotation, adaptation or reuse of original text must respect applicable law, relevant permission and attribution. These pages do not offer a blanket licence to republish entire articles or present another author&apos;s work as your own.</p>
    </section>
    <section><h2>Game identity and creator rights</h2>
      <p>Helping Your Boyfriend, its characters, story, dialogue, music, visual assets and software remain associated with their respective creators and rights holders. We refer to the game by name so that players can identify the subject of the information.</p>
      <p>This is an independent player-help website, not an official product, authorised distributor or statement from the creators. A game name, logo or character appearing in an article should not be read as evidence of a partnership or permission to use that material elsewhere.</p>
    </section>
    <section><h2>Screenshots, character images and excerpts</h2>
      <p>Game screenshots and character images are used in context to identify a character or explain a visible scene or interaction. The relevant rights do not become ours because an image is displayed locally or included with commentary.</p>
      <p>An editorial purpose or attribution does not automatically establish permission, a legal exception or a licence for every use. The legal position depends on the particular material, permission and applicable law. Do not assume that downloading an image from this site authorises its republication.</p>
    </section>
    <section><h2>Embedded players and videos</h2>
      <p>A game frame loads content from an external service. Videos remain on the video provider&apos;s infrastructure and are subject to the video&apos;s ownership and the provider&apos;s rules. Embedding does not grant us the ability to license those works to visitors.</p>
      <p>For a licence to reuse gameplay footage, music, dialogue or visual assets, contact the relevant rights holder. We cannot grant rights on behalf of a game creator, artist, performer or video publisher.</p>
    </section>
    <section><h2>Attribution and corrections</h2>
      <p>If a credit is missing or inaccurate, identify the exact page, the material concerned and the correct attribution. Include a reliable reference or explanation of your connection to the work so that we can understand the request.</p>
      <p>We may correct a caption, credit or presentation without treating the correction as a transfer of rights. Attribution information is not a substitute for permission where permission is required.</p>
    </section>
    <section><h2>Submitting a rights concern</h2>
      <p>Send a clear request to <span className="legal-email">{siteConfig.contactEmail}</span>. A useful request identifies the work, the disputed use and whether you are the rights holder or authorised to act for them.</p>
      <ol><li>Give your name or organisation and a reliable reply address.</li><li>Identify the original work and its rights holder, with an original publication link where available.</li><li>Provide the exact page URL and identify the image, passage or media item concerned.</li><li>Explain the rights issue or the attribution correction requested.</li><li>State the action requested, such as a corrected credit, replacement or removal.</li><li>If acting for someone else, explain your authority to represent them.</li></ol>
      <p>Do not send passwords, unnecessary identity documents or unrelated confidential material. A representative can describe their authority first rather than including private contractual records in an initial message.</p>
    </section>
    <section><h2>Review and response</h2>
      <p>A request may require clarification of the material, ownership or scope of the concern. Depending on the circumstances, the site may correct, replace, restrict or remove the disputed material while the issue is considered. We do not promise an automatic result or a fixed response time.</p>
      <p>This is a general rights-contact channel, not a substitute for a statutory notice procedure that applies to a particular provider. Nothing on this page limits a rights holder&apos;s legal remedies or grants permission to use a work without the necessary rights.</p>
    </section>
    <section><h2>Further permissions and policy updates</h2>
      <p>For permission concerning original site writing, describe the passage, proposed use, distribution and attribution in your message. Permission from us, if granted, would cover only rights we are entitled to grant—not the game or third-party assets embedded alongside it.</p>
      <p>This page may be updated as presentation or rights information changes. The revision month is shown below. Consult a qualified adviser if you need a legal determination about a particular use; this page explains our contact process rather than providing legal advice.</p>
    </section>
  </LegalPage>;
}
