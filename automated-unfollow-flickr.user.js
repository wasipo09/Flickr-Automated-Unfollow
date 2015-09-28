// ==UserScript==
// @name        Automated Unfollow Flickr 2.0
// @namespace   stvedt_unfollow_automated
// @include     https://www.flickr.com/people/*/contacts/*
// @version     2.0
// @grant       none
// ==UserScript==
// allow pasting

//unfollow can be all or non-follower

var config = {
  "unfollow": "non-reciprocal", // 'all' or 'non-reciprocal'
  "protect": ['friend','family'], // 'friend' or 'family'
  "upload": ['minute','hour','day'] // 'minute', 'hour','day','week', 'month', 'ages'
};

function run(){

  //This injects jquery
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.id = 'jqueryInject';
  s.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js";
  document.head.appendChild(s);

 setTimeout(addEvent, 500)
}

setTimeout(run, 500);

function addEvent(){
  $('.contact-list-edit a').text('Unfollow');
   $('body').on('click', '.contact-list-edit a', function(){
     setTimeout(function(){
       $('#contactChangerContainer #contactChangerCheckContact').click();
     }, 1000);
     setTimeout(function(){
       $('#contactChangerContainer #contactChangerButtonRemove').click();
     }, 1000);
  });

function unfollow(){

  var $notFollowing = $('.not-following').find('.contact-list-edit a');

  if ( $notFollowing.length <= 0 ){
    //console.log('all following');
    window.location = 'https://'+ document.location.host + $('a.Next').attr('href');
  } else {

    $notFollowing.each(function(i){
      var $this = $(this);
      setTimeout(function(){

        $this.click();
        //console.log('click' , i);

      }, (i * 2000) );

      console.log( i, $notFollowing.length -1 );
      if ( i == ($notFollowing.length -1) ){
        setTimeout(function(){
          window.location.reload();
        }, i *2000 + 3000);
      }

    });

  }

}

setTimeout(unfollow, 1000);

   (function() {
      snapIcons = document.evaluate("//td[@class='contact-list-bicon']/a/img[@class='BuddyIconX']",
        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

      if (snapIcons.snapshotLength == 0) {
        snapIcons = document.evaluate("//td[@class='contact-list-bicon contact-list-sorted']/a/img[@class='BuddyIconX']",
          document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      }

      if (snapIcons.snapshotLength == 0) {
        return;
      }
      for (var i = snapIcons.snapshotLength - 1; i >= 0; i--) {
        var thisIcon = snapIcons.snapshotItem(i);
        var matchNSID = /([a-zA-Z0-9]+@[A-Z0-9]+)/;
        var matches = matchNSID.exec(thisIcon.src);
        if (matches[1]) {
          var listener = {
            flickr_people_getInfo_onLoad: function(success, responseXML, responseText, params) {
              if (success) {
                var rsp = responseText.replace(/jsonFlickrApi\(/,'');
                rsp = eval('('+rsp);
                if (rsp.stat == 'ok') {
                  if (
                    rsp.person.revcontact == 0 &&
                    rsp.person.revfriend == 0 && 
                    rsp.person.revfamily == 0
                  ) {
                    snapUnames = document.evaluate("//td[@class='contact-list-name']/a/text()",
                      document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

                    if (snapUnames.snapshotLength == 0) {
                      snapUnames = document.evaluate("//td[@class='contact-list-name contact-list-sorted']/a/text()",
                        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    }
                    for (j = 0; j < snapUnames.snapshotLength; j++) {
                      if(config.unfollow ==='all'){

                      } else {

                      }
                      if (snapUnames.snapshotItem(j).nodeValue == rsp.person.username._content || config.unfollow =='all') {

                        var contactType = $(snapUnames.snapshotItem(j)).parents('tr').find('.contact-list-youthem span').eq(0).text();
                        contactType=contactType.toLowerCase();
                        var lastUpload = $(snapUnames.snapshotItem(j)).parents('tr').find('.contact-list-last').text();

                        //console.log(lastUpload);

                        var protect = false;
                        for(i=0; i<config.protect.length; i++){
                          if ( contactType.contains(config.protect[i]) ){
                            protect = true;
                            break;
                          }
                        }//end loop to check contact type

                        if (!protect){
                          for(i=0; i<config.upload.length; i++){
                            if ( lastUpload.contains(config.upload[i]) ){
                              // mark to unfollow and red if active recently
                              snapUnames.snapshotItem(j).parentNode.style.color = 'red';
                              $(snapUnames.snapshotItem(j)).parents('tr').addClass('not-following');
                              break;
                            } else {
                              // mark to unfollow and orange if not active
                              snapUnames.snapshotItem(j).parentNode.style.color = 'orange';
                              //$(snapUnames.snapshotItem(j)).parents('tr').addClass('not-following');
                            }
                          }
                        }//end if !protect
                      }
                    }
                  }
                }
              }
            }
          };
          var f = function() {
            try {
              unsafeWindow.F.API.callMethod(
                'flickr.people.getInfo',
                {
                  user_id: matches[1],
                  format: 'json'
                },
                listener
              );
            }
            catch (err) {
              setTimeout(f, 1000);
            }
          };
          f();
        }
      }
    })()
}