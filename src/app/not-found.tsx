import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="narrow notfound">
      <Image className="notfound-mark" src="/burrow-mark.png" alt="" width={190} height={116} />
      <p className="eyebrow muted">404</p>
      <h1>This tunnel goes nowhere.</h1>
      <p>
        The page you dug for is not here. Try the guides, run a search,
        or head back to the surface.
      </p>
      <div className="hero-actions">
        <Link className="cta-button" href="/">Back to the surface</Link>
        <Link className="ghost-button" href="/guides">Browse guides</Link>
      </div>
    </div>
  );
}
