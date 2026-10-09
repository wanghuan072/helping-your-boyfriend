// Local regression fixture only: activates Next's real adapter output layout.
// Never uploads, starts a server, or replaces the production Vercel adapter.
const adapter = { name: 'seo-output-regression', async onBuildComplete() {} };
export default adapter;
