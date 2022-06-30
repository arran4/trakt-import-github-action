var core = require('@actions/core');
var github = require('@actions/github');
var Trakt = require('trakt.tv');
try {
    var traktOauth2Key = core.getInput('trakt-oauth2-refresh-token');
    var netflixFile = core.getInput('netflix-file');
    var deleteFiles = core.getInput('delete');
    var options = {
        client_id: "a7194a79bae514974a729c7c5a474e4b7caf773f445d084a8af87ae033ec3d82"
    };
    var trakt = new Trakt(options);
    trakt._authentication.refresh_token = traktOauth2Key;
    console.log(trakt.calendars.my.shows());
}
catch (error) {
    core.setFailed(error.message);
}
