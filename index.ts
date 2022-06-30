const core = require('@actions/core');
const github = require('@actions/github');
const Trakt = require('trakt.tv');

try {
  const traktOauth2Key = core.getInput('trakt-oauth2-refresh-token');
  const netflixFile = core.getInput('netflix-file');
  const deleteFiles = core.getInput('delete');

  let options = {
    client_id: "a7194a79bae514974a729c7c5a474e4b7caf773f445d084a8af87ae033ec3d82",
    // client_secret: <the_client_secret>
  };
  const trakt = new Trakt(options);
  trakt._authentication.refresh_token = traktOauth2Key
  console.log(trakt.calendars.my.shows())
} catch (error) {
  core.setFailed(error.message);
}
