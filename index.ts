import * as core from '@actions/core';
import fetch from 'node-fetch';

async function getAccessToken(redirectUrl: string, clientId: string, clientSecret: string, refreshToken: string) {
  console.log("Getting access token");
  let data = {
    "grant_type": "refresh_token",
    "refresh_token": refreshToken,
    "client_id": clientId,
    "client_secret": clientSecret,
    "redirect_uri": redirectUrl,
  };

  let fetchResult = await fetch('https://trakt.tv/oauth/token', {
    method: "POST",
    body: JSON.stringify(data),
    referrerPolicy: 'origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "trakt-api-key": clientId,
      "trakt-api-version": "2",
    }
  });
  let refreshResult: any = await fetchResult.json();
  let accessToken = refreshResult?.access_token;
  if (!accessToken) {
    console.log(refreshResult);
    throw new Error("Could not get access token");
  }
  console.log("Got access token");
  return accessToken
}

let lastPost: null | Date = null

async function run() {
  const refreshToken = core.getInput('trakt-oauth2-refresh-token');
  const netflixFile = core.getInput('netflix-file');
  const deleteFiles = core.getInput('delete');
  const redirectUrl = "https://arran4.github.io/trakt-import-github-action/"
  const clientId = "a7194a79bae514974a729c7c5a474e4b7caf773f445d084a8af87ae033ec3d82"
  const clientSecret = "4748b934918ffe3d5944fee81f6022ca7bf5a3939cf97e30b15f69598082c13a"
  const accessToken = getAccessToken(redirectUrl, clientId, clientSecret, refreshToken)

  if (lastPost != null) {
    await new Promise(e => setTimeout(e, lastPost.getDate() - new Date().getDate()));
  }
  console.log("Uploading history sync");
  let fetchResult = await fetch('https://api.trakt.tv/sync/history', {
    method: "POST",
    body: JSON.stringify({
      movies: [],
      shows: [],
      seasons: [],
      episodes: [],
    }),
    referrerPolicy: 'origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${accessToken}`,
      "trakt-api-key": clientId,
      "trakt-api-version": "2",
    }
  });
  lastPost = new Date()
  console.log("Done with result", await fetchResult.text())

  return "Done"
}

run().then(console.log).catch((e) => {
  core.setFailed(e.message)
  console.error(e.message)
})
