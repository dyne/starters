# Organizations

## User requests membership

- `UI` - User sends membership request
- `POST` to `api/collections/orgJoinRequests` `CREATE`
- `hook` `onRecordAfterCreateRequest` on `orgJoinRequests` sends an email to the admins.

- Admins, from the email, are redirected to `/my/organizations/[id]/members`
- Here, in the UI, two options are possible

  - Accept invite: send `POST` to `api/collections/orgJoinRequests` `UPDATE` with body `{status: "accepted"}`
  - Decline invite: send `POST` to `api/collections/orgJoinRequests` `UPDATE` with body `{status: "declined"}`

- `hook` `onRecordAfterUpdateRequest` on `orgJoinRequests` sends an email to the user, to be notified.

## Admin invites user

- `UI` - `🧑‍💼 admin` sends `POST` to `organizations/invite` with body `{organizationId: string, emails: string[]}`
- Route handler sends email to user with an url with params:
  - organizationId
  - inviteId
  - user_email
  - userId? (in case the user exists)
- The user, clicks on the link
  - Case A, the user is already logged on the pl
