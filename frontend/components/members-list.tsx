import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import InviteForm from '@/components/invite-form';
import { Member, Organization } from 'stytch';
import { getStytchCookie } from '@/lib/cookies';

export default async function MembersList({
    organization
}: { organization: Organization }) {
    const cookie = await getStytchCookie();
    const response = await fetch("http://localhost:5000/api/members", { credentials: 'include', headers: { Cookie: `stytch_session_jwt=${cookie}` } });
    const { members } = await response.json();
    return (
        <Card className="w-full max-w-sm">
        <CardHeader className="pb-4">
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          {members.map((member: Member) => {
            return (
              <div key={member.member_id} className="flex justify-between">
                <span>[{member.is_admin ? 'Admin' : 'Member'}]</span>
                <span>{member.email_address}</span>
                <span>({member.status})</span>
              </div>
            );
          })
          }
          <Separator className="mb-4" />
          <InviteForm organization_slug={organization.organization_slug} />
        </CardContent>

      </Card>
    )
}