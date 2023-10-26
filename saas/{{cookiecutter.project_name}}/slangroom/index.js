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


// WARNING: not safe against injection
const apiById = async (before, after, token, rest) => {
  const script = `
Rule caller restroom-mw

Given I have a 'string' named 'pb'
Given I have a 'string' named 'id'
Given I have a 'string dictionary' named 'headers'
When I write string '${before}' in 'path'
When I write string '${after}' in 'end_filter'
When I append 'path' to 'pb'
When I append 'id' to 'pb'
When I append 'end_filter' to 'pb'
Then print data
Then I connect to 'pb' and send headers 'headers' and do get and output into 'http_result'
`;
  const res = await slangroom.execute(script, {
    data: {
      pb: PB,
      headers: {
        authorization: "Bearer " + token,
      },
      ...rest
    },
  });
  // TODO: check errors
  return res.result.http_result.result;
}

// List of services of my org
// TODO: manage pagination
const organizationServices = async (token, id) => {
  return apiById('/api/collections/services/records?filters=(organization="', '")', token, {id: id})
}

// List of the orgs I'm part of
// TODO: manage pagination
const orgAuthorizations = async (token, id) => {
  return apiById('/api/collections/orgAuthorizations/records?filter=(user="', '")&&expand=organization&&fields=expand.organization.name,expand.organization.id', token, {id: id})
}

// List of WebAuthn sessions/devices
// TODO: manage pagination
const webauthnCreds = async (token, id) => {
  return apiById('/api/collections/webauthnCredentials/records?filter=(user="', '")', token, {id: id})
}
const webauthnSessions = async (token, id) => {
  return apiById('/api/collections/sessionDataWebauthn/records?filter=(user="', '")', token, {id: id})
}

// My profile info
const myProfile = async (token, id) => {
  return apiById('/api/collections/users/records/', '', token, {id: id})
}
const updateProfile = async (token, id, data) => {
  const script = `
Rule caller restroom-mw

Given I have a 'string' named 'pb'
Given I have a 'string' named 'id'
Given I have a 'string dictionary' named 'headers'
Given I have a 'string dictionary' named 'user_data'
When I write string '/api/collections/users/records/' in 'path'
When I append 'path' to 'pb'
When I append 'id' to 'pb'
Then print data
Then I connect to 'pb' and send headers 'headers' and send object 'user_data' and do post and output into 'http_result'
`;
  const res = await slangroom.execute(script, {
    data: {
      pb: PB,
      headers: {
        authorization: "Bearer " + token,
      },
      id: id,
      user_data: data,
    },
  });
  // TODO: check errors
  return res.result;
}

const main = async () => {
  const tokenData = await authWithPassword(IDENTITY, PASSWORD);
  console.log(tokenData)
  const orgs = await orgAuthorizations(tokenData.result.token, tokenData.result.record.id);
  console.log(JSON.stringify(orgs));
  //const services = await organizationServices(tokenData.result.token, orgs.items[0].expand.organization.id);
  //console.log(JSON.stringify(services));
  const webCred = await webauthnCreds(tokenData.result.token, tokenData.result.record.id);
  console.log(JSON.stringify(webCred));
  const webSessions = await webauthnSessions(tokenData.result.token, tokenData.result.record.id);
  console.log(JSON.stringify(webSessions));
  const myProfileRes = await myProfile(tokenData.result.token, tokenData.result.record.id);
  console.log(JSON.stringify(myProfileRes));
  const updated = await updateProfile(tokenData.result.token, tokenData.result.record.id, {name: "New name"})
  console.log(updated)
}
main()
