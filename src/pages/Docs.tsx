import { useEffect, type ReactNode } from 'react';
import { BRAND } from '../config/brand';

function Doc({ no, title, children }: { no: string; title: string; children: ReactNode }) {
  return (
    <div className="pn">
      <div className="ph">
        <h3>
          <span className="no">{no}</span> · {title}
        </h3>
      </div>
      <div className="prose">{children}</div>
    </div>
  );
}

const SCALE: [string, string, string, string][] = [
  ['REAL', 'up', '75-92', 'The core product was seen doing what it says, or it is proven on chain or in the code, and nothing core turned out false.'],
  ['LIKELY REAL', 'up', '58-74', 'The core is proven; only side claims could not be seen.'],
  ['PARTLY REAL', '', '38-57', 'Some of the core works, some is false, faked or not live yet.'],
  ['UNCLEAR', '', '15-35', 'Nothing core could be tested either way: a dead link, a login wall, an empty page.'],
  ['LIKELY LARP', 'down', '18-37', 'Nothing core is proven although it was tried, and a core claim is false or its proof is missing where it has to exist.'],
  ['LARP', 'down', '6-20', 'Core claims shown false, an impersonation, or a site that belongs to another project.'],
  ['SCAM', 'down', '0-10', 'Made to take from the visitor: a draining transaction, a seed-phrase form, signature prompts on load, a fake claim page.'],
];

export default function Docs() {
  useEffect(() => {
    document.title = `Docs · ${BRAND.name}`;
  }, []);
  const tag = BRAND.x ? `@${BRAND.x}` : 'the bot';
  return (
    <main className="wide">
      <section className="ckhero">
        <div className="eyebrow">docs · how it works</div>
        <h2 className="px">How it works</h2>
        <p className="cksub">
          What happens after you paste a project or tag the bot: the read, the wallet run, the two investigators, the verdict.
        </p>
      </section>
      <section className="blk docs" style={{ paddingTop: 30 }}>
        <Doc no="01" title="What it is">
          <p>
            {BRAND.name} tests whether a crypto project is what it says it is. Paste an X post, a website, a contract address, a wallet,
            an @handle or a GitHub repo, or tag the bot under the project's post on X. It uses the product, reads the code and the
            chain, goes through every claim the project makes, and answers with a verdict, a score and the proof behind each point.
          </p>
          <p>
            The examiner does not judge from the post alone. It opens the site in a real browser, connects a sandbox wallet, presses
            the buttons and watches what happens. That is the dry run.
          </p>
        </Doc>
        <Doc no="02" title="How a run goes">
          <ol className="dl">
            <li>
              <b>Read, 0-7 s.</b> The post, its author, the site, the domain records, the repo and the coin on chain are read in
              parallel. Every link inside them is followed: a site found in a bio or in the coin's metadata is tested too.
            </li>
            <li>
              <b>First verdict, about 10 s.</b> The examiner lists the project's claims, most important first, and gives a first call
              from what is already known. It shows on the page right away and is the bot's first reply on X.
            </li>
            <li>
              <b>The wallet run, from the start.</b> A real browser on a separate machine opens the site with the sandbox wallet
              (below).
            </li>
            <li>
              <b>Two investigators in parallel.</b> One searches the open web: docs, explorers, dashboards, audits, the team's earlier
              projects, scam reports. The other uses the product: it reads the wallet run, makes its own visits for the claims still
              open, calls the site's API, reads the code and the chain. Each claim is closed as soon as it is proven.
            </li>
            <li>
              <b>The coin, if there is one.</b> Holders, locked supply, the dev wallet and who funded it, linked wallets, launch
              bundles, where the creator fees go, and every team wallet with what it bought and sold.
            </li>
            <li>
              <b>Final verdict, about 1-2 minutes.</b> Everything is weighed together: the settled claims, the wallet requests and
              what they would do, the code, the chain. Then the project is taken apart piece by piece: claims, website, wallet flow,
              code, token, fees, team wallets, reach.
            </li>
          </ol>
        </Doc>
        <Doc no="03" title="The wallet run">
          <p>
            This is where projects get caught. The sandbox browser carries a wallet that looks like a normal Phantom (and MetaMask on
            EVM sites) to the page. It:
          </p>
          <ul className="dl">
            <li>
              <b>connects</b> through the site's own wallet picker, like you would: it presses Connect, picks the wallet and accepts
              the terms screen;
            </li>
            <li>
              <b>does the one thing the site is for</b>: enters a small amount and presses swap, buy, stake, mint, claim or launch, plus
              any confirm screen that follows;
            </li>
            <li>
              <b>catches every signature request</b>: transactions, messages, sign-in, approvals. <b>Nothing is ever signed</b>: the
              wallet shows a real funded address whose key nobody here holds;
            </li>
            <li>
              <b>dry-runs each Solana transaction on mainnet</b> against that funded address, so the report shows what signing would
              really do: what leaves the wallet, what comes in, who receives it, which programs run, and red flags such as a stranger
              getting the right to move your tokens, your token account being handed over, or a transaction that never expires.
            </li>
          </ul>
          <p>
            If a site wants a signed login message before it lets a wallet in, it gets a second pass with a throwaway key made for
            that single visit: it signs the login message only, holds nothing, and still refuses every transaction.
          </p>
          <p>
            A signature prompt on page load before anything was pressed, a transaction that takes more than the action needs, or a
            "claim" that sends your tokens away: that is what a SCAM verdict rests on.
          </p>
        </Doc>
        <Doc no="04" title="The verdict">
          <table className="dt">
            <tbody>
              {SCALE.map(([v, c, r, t]) => (
                <tr key={v}>
                  <td className={c || undefined}>{v}</td>
                  <td>{r}</td>
                  <td>{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            The verdict is about whether the project is what it claims. It is never a price call. A test that the site's own bot
            protection blocked counts neither for nor against the project: the claim is then settled from other proof (its API, its
            programs on chain, its public record). For a coin, the holder side (bundles, dev holdings, insiders, rug records) is shown
            next to the story score.
          </p>
        </Doc>
        <Doc no="05" title="On X">
          <p>
            Tag {tag} under any project's post, or put a CA, a site or an @handle in the tag. Within seconds it replies with the quick
            read: the verdict word, the score and one line. When the full run is done, the deep dive lands under it in the same
            thread with the share card: the verdict, the claims, the piece-by-piece breakdown and the catch, if there is one.
          </p>
          <p>
            An X account without a coin still gets a run: its profile and age, its bio and website (the site gets the full wallet
            test), its GitHub, the coins it posted before, and what the web says about it. Without a coin the verdict covers the
            project alone.
          </p>
        </Doc>
        <Doc no="06" title="Many runs at once">
          <p>
            Runs go in parallel: up to 16 at the same time, with more waiting in line that start the moment a slot frees up. The
            browser visits of every running job go to the sandbox machine together and run side by side.
          </p>
          <p>
            A project that was run once is remembered: asking again about the same coin, site, repo, post or account within 24 hours
            returns the finished report instantly, with no new scan. After that, the next ask starts a fresh run. If the sandbox
            browser was down during a run, the project can be run again after 20 minutes.
          </p>
        </Doc>
        <Doc no="07" title="What it does not do">
          <ul className="dl">
            <li>
              It never signs a transaction, never sends one and never holds your keys. You never connect your own wallet to {BRAND.name}.
            </li>
            <li>It cannot get past every site's bot protection; when a site blocks the sandbox browser, the report says so and the claim is judged on other proof.</li>
            <li>It reads what is public. A verdict is evidence about the project today, not advice to buy or sell.</li>
          </ul>
        </Doc>
      </section>
    </main>
  );
}
