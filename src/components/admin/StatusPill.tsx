import type { Status } from '@/features/posts/types';

// Status pill with a dot indicator, shared by the dashboard, the
// post list and the editor rail. Class suffix matches the status so
// admin.css can colour each state.
export default function StatusPill({ status }: { status: Status }) {
  return <span className={`adm-pill ${status}`}>{status}</span>;
}
