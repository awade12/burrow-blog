import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="narrow" style={{ textAlign: 'center', padding: '70px 20px' }}>
      <Image src="/burrow-mark.png" alt="" width={190} height={116} />
      <h1 style={{ fontSize: 34, margin: '16px 0 8px' }}>This tunnel goes nowhere.</h1>
      <p style={{ color: 'var(--muted)' }}>
        The page you dug for is not here. Try the <Link href="/guides">guides</Link>,
        the <Link href="/search">search</Link>, or head back to the <Link href="/">surface</Link>.
      </p>
    </div>
  );
}
