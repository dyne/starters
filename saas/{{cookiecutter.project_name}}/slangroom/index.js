import { Slangroom } from '@slangroom/core'
import { httpPlugins } from '@slangroom/http'

import dotenv from "dotenv";
dotenv.config();

const PB = process.env.PB || "http://localhost:8090";
const IDENTITY = process.env.IDENTITY;
const PASSWORD = process.env.PASSWORD;

const slangroom = new Slangroom(httpPlugins);

const authWithPassword = async (username, password) => {
  const script = `
Rule caller restroom-mw

Given I have a 'string' named 'pb'
Given I have a 'string dictionary' named 'auth'
When I write string '/api/collections/users/auth-with-password' in 'path'
When I append 'path' to 'pb'
Then print data
Then I connect to 'pb' and send object 'auth' and do post and output into 'auth_token'
`;
  const res = await slangroom.execute(script, {
    data: {
      pb: PB,
      auth: {identity: username, password}
    },
  });
  return res.result.auth_token
}

const orgAuthorizations = async (token, id) => {
  const script = `
Rule caller restroom-mw

Given I have a 'string' named 'pb'
Given I have a 'string' named 'id'
Given I have a 'string dictionary' named 'headers'
When I write string '/api/collections/orgAuthorizations/records?filter=(user="' in 'path'
When I write string '")' in 'end_filter'
When I append 'path' to 'pb'
When I append 'id' to 'pb'
When I append 'end_filter' to 'pb'
Then print data
Then I connect to 'pb' and send headers 'headers' and do get and output into 'orgAuths'
`;
  const res = await slangroom.execute(script, {
    data: {
      pb: PB,
      headers: {
        authorization: "Bearer " + token,
      },
      id: id,
    },
  });
  return res.result.orgAuths.result.items
}

const organization = async (token, id) => {
  const script = `
Rule caller restroom-mw

Given I have a 'string' named 'pb'
Given I have a 'string' named 'id'
Given I have a 'string dictionary' named 'headers'
When I write string '/api/collections/organizations/records/' in 'path'
When I append 'path' to 'pb'
When I append 'id' to 'pb'
Then print data
Then I connect to 'pb' and send headers 'headers' and do get and output into 'get_result'
`;
  const res = await slangroom.execute(script, {
    data: {
      pb: PB,
      headers: {
        authorization: "Bearer " + token,
      },
      id: id,
    },
  });
  return res.result.get_result
}

const main = async () => {
  const tokenData = await authWithPassword(IDENTITY, PASSWORD);
  const orgAuths = await orgAuthorizations(tokenData.result.token, tokenData.result.record.id);
  console.log("Organizations you are part of:");
  for(let auth of orgAuths) {
    const org = await organization(tokenData.result.token, auth.organization);
    console.log("-", org.result.name);
  }

}
main()
