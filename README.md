# trakt-import-github-action

*Work in progress*

A github script for importing netflix and other exported files into trakt.

The basic idea is that you create a private repo then perodically commit your latest netflix etc watch files to it, the action below will automatically push it up.

## Inputs

## `trakt-oauth2-refresh-token`

**Required** The oauth2 refresh token, generated using github pages. See https://arran4.github.io/trakt-import-github-action/

## `netflix-file`

**Required** The netflix csv file. From https://www.netflix.com/settings/viewed/ (Profile URLs might differ)

## `delete`

**Required** Delete the file with a commit.

## Example usage

Create a private repo. Create an action which triggers on push with the action:

Generate an refresh token using: https://arran4.github.io/trakt-import-github-action/

Upload access token to the github repo's secrets as: TRAKT_REFRESH_TOKEN

```
uses: arran4/trakt-import-github-action@v1.0
with:
  trakt-oauth2-refresh-token: ${{ secrets.TRAKT_REFRESH_TOKEN }}
  netflix-file: 'NetflixViewingHistory.csv'
  delete: false
```

Then upload `NetflixViewingHistory.csv` to it and watch the action run.