import * as core from '@actions/core';
import fetch from 'node-fetch';
import * as path from "path";
import * as fs from "fs";
import {parse} from "csv-parse";

async function getAccessToken(redirectUrl: string, clientId: string, clientSecret: string, refreshToken: string) {
  if (!refreshToken) {
    throw new Error("Empty refresh token")
  }

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

function buildHeaders(accessToken: any, clientId: string) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    "Authorization": `Bearer ${accessToken}`,
    "trakt-api-key": clientId,
    "trakt-api-version": "2",
  };
}

async function post(url: string, clientId: string, accessToken: any, data: object) {
  if (lastPost != null) {
    await new Promise(e => setTimeout(e, lastPost.getDate() - new Date().getDate()));
  }
  let fetchResult = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: buildHeaders(accessToken, clientId)
  });
  lastPost = new Date()
  return fetchResult;
}

async function SyncHistory(accessToken: any, clientId: string, episodes: any[] = [], seasons: any[] = [], shows: any[] = [], movies: any[] = []) {
  console.log("Uploading history sync");
  let data = {
    movies: movies,
    shows: shows,
    seasons: seasons,
    episodes: episodes,
  }
  let fetchResult = await post(undefined, clientId, accessToken, data);
  console.log("Done with result", await fetchResult.text())
}

interface TitleDate {
  Title: string
  Date: string
}

async function run() {
  const refreshToken = core.getInput('trakt-oauth2-refresh-token');
  const netflixFile = core.getInput('netflix-file');
  const deleteFiles = core.getInput('delete');
  const redirectUrl = "https://arran4.github.io/trakt-import-github-action/"
  const clientId = "a7194a79bae514974a729c7c5a474e4b7caf773f445d084a8af87ae033ec3d82"
  const clientSecret = "4748b934918ffe3d5944fee81f6022ca7bf5a3939cf97e30b15f69598082c13a"
  const accessToken = await getAccessToken(redirectUrl, clientId, clientSecret, refreshToken)

  const netflixFilePath = path.resolve(__dirname, netflixFile);
  const headers = ['Title', 'Date'];
  const fileContent = fs.readFileSync(netflixFilePath, { encoding: 'utf-8' });

  let watchList : Array<TitleDate> = await new Promise((ret, err) => parse(fileContent, {
    delimiter: ',',
    columns: headers,
  }, (ca, cb) => {
    if (ca) {
      err(ca)
    }
    return (cb)
  })) as Array<TitleDate>;

  console.log("Parsed", watchList)

  await SyncHistory(accessToken, clientId);

  return "Done"
}

run().then(console.log).catch((e) => {
  core.setFailed(e.message)
  console.error(e.message)
})
