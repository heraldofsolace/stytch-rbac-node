import Authenticated from '@/components/authenticated';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import SSOConnectionForm from '@/components/sso-connection-form';
import { getStytchCookie } from '@/lib/cookies';
import { SAMLConnection } from 'stytch';

export default async function ConnectionPage({
  params,
}: {
  params: { slug: string; connection_id: string };
}) {
  const cookie = await getStytchCookie();
  const { member } = await fetch("http://localhost:5000/api/organizations", { credentials: 'include', headers: { Cookie: `stytch_session_jwt=${cookie}` } }).then((res) => res.json());
  const { connections } = await fetch("http://localhost:5000/api/sso-connections", { credentials: 'include', headers: { Cookie: `stytch_session_jwt=${cookie}` } }).then((res) => res.json());

  const connection = connections.find(
    (connection: SAMLConnection) => connection.connection_id === params.connection_id,
  );

  if (!connection) {
    return redirect(`/${params.slug}/dashboard`);
  }

  return (
    <Authenticated>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Edit SAML SSO Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <SSOConnectionForm
            canEdit={member.is_admin}
            connection={connection}
            backLink={`/${params.slug}/dashboard`}
          />
        </CardContent>

      </Card>
    </Authenticated>
  );
}
