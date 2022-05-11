# trakt-import-github-action

*Work in progress*

A github script for importing netflix and other exported files into trakt.

The basic idea is that you create a private repo then perodically commit your latest netflix etc watch files to it, the action below will automatically push it up.

## Inputs

## `trakt-oauth2-key`

**Required** The oauth2 key, generated using github pages.

## `netflix-file`

**Required** The netflix csv file.

## `delete`

**Required** Delete the file with a commit.

## Example usage

Create a private repo. Create an action which triggers on push with the action:

Generate an access token using: https://arran4.github.io/trakt-import-github-action/

Upload access token to the github repo's secrets as: TRACKT_ACCESS_KEY

```
uses: arran4/trakt-import-github-action@v1.0
with:
  trakt-oauth2-key: ${{ secrets.TRACKT_ACCESS_KEY }}
  netflix-file: 'netflix.csv'
  delete: false
```

Then upload `netflix.csv` to it and watch the action run.