import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from "@/components/ui/button";
import CreateSSOConnection from "@/components/create-sso-connection";
import { Organization, SAMLConnection } from 'stytch';
import Link from "next/link";
import { getStytchCookie } from '@/lib/cookies';

export default async function SSOConnections({
    organization
}: { organization: Organization }) {
    const cookie = await getStytchCookie();
    const response = await fetch("http://localhost:5000/api/sso-connections", { credentials: 'include', headers: { Cookie: `stytch_session_jwt=${cookie}` } });
    const { connections } = await response.json();

    return (
        <Card className="w-full max-w-sm">
        <CardHeader className="pb-4">
          <CardTitle>SAML SSO Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pb-2">
            {connections.map((connection: SAMLConnection) => {
              return (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  key={connection.connection_id}
                  asChild
                >
                  <Link
                    href={`/${organization.organization_slug}/dashboard/${connection.connection_id}/`}
                  >
                    {connection.display_name} ({connection.status})
                  </Link>
                </Button>
              );
            })}
            {connections.length === 0 && (
              <span className="text-gray-500 w-full text-center flex justify-center items-center py-2">
                No connections configured
              </span>
            )}
          </div>
          <Separator className="mb-4" />
            <CreateSSOConnection organization_slug={organization.organization_slug} />
        </CardContent>

      </Card>
    )
}
