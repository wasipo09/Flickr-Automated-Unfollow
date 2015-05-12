### Installation

Intended for use with Greasemonkey.

[https://addons.mozilla.org/en-uS/firefox/addon/greasemonkey/](https://addons.mozilla.org/en-uS/firefox/addon/greasemonkey/s)


Sometimes jQuery or the plugin will fail to run on the page. To refresh the page and continue automation I use the ReloadEvery Extension set to 1 minute.

[http://reloadevery.mozdev.org/](http://reloadevery.mozdev.org/)


### Usage

This plugin will work on the contacts page. I usually use it on my contacts based on when I added them oldest first: [https://www.flickr.com/people/stvedt/contacts/by-added-desc/?page=1109](https://www.flickr.com/people/stvedt/contacts/by-added-desc/?page=500)

I added some visual feedback to show how active users are. If they have been active in the past month and are not following they will be highlighted in red. If they haven't been active in the past month they will be highlighted in orange.

Regardless of activity they will still be unfollowed. To change this remove the follow as desired:

    $(snapUnames.snapshotItem(j)).parents('tr').addClass('not-following');