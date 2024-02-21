import Authenticated from '@/components/authenticated';

import MembersList from '@/components/members-list';
import SSOConnections from '@/components/sso-connections';
import Posts from '@/components/posts';
import { getStytchCookie } from '@/lib/cookies';
import { redirect } from 'next/navigation';

export default async function DashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  const cookie = await getStytchCookie();
  const response = await fetch("http://localhost:5000/api/organizations", { credentials: 'include', headers: { Cookie: `stytch_session_jwt=${cookie};` } });
  if(response.status === 401) {
    return redirect('/login');
  }
  const { organization, member, success } = await response.json();

  return (
    <Authenticated>
      <div className="flex flex-col text-sm w-full max-w-sm p-2">
        <div>
          <span className="font-semibold">Organization name: </span>
          <span className="font-mono text-gray-700">
            {organization.organization_name}
          </span>
        </div>
        <div>
          <span className="font-semibold">Organization slug: </span>
          <span className="font-mono text-gray-700">
            {organization.organization_slug}
          </span>
        </div>
        <div>
          <span className="font-semibold">User: </span>
          <span className="font-mono text-gray-700">
            {member.email_address} {member.is_admin ? '(admin)' : '(member)'}
          </span>
        </div>
      </div>
      <SSOConnections organization={organization} />
      <MembersList organization={organization} />
      <Posts organization={organization} />
    </Authenticated>
  );
}

