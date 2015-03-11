// ==UserScript==
// @name        Automated Unfollow Flickr
// @namespace   stvedt_unfollow_automated
// @include     https://www.flickr.com/people/*/contacts/*
// @version     1
// @grant       none
// ==/UserScript==
// allow pasting

function run(){
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
  console.log('unfollow')

  var $notFollowing = $('.not-following').find('.contact-list-edit a');
  if ( $notFollowing.length <= 2){
    console.log('all following');
    window.location = 'https://'+ document.location.host + $('a.Next').attr('href');
  } else {
    $notFollowing.each(function(i){
      var $this = $(this);
      setTimeout(function(){

        $this.click();
        console.log('click' , i);

      }, (i * 2000) );
    }); 
  }
  
}

setTimeout(unfollow, 1000);

setTimeout(function(){
  window.location.reload();
  //window.location = 'https://'+ document.location.host + $('a.Next').attr('href');
}, 15000);

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
                      if (snapUnames.snapshotItem(j).nodeValue == rsp.person.username._content) {
                        snapUnames.snapshotItem(j).parentNode.style.color = 'red';
                        $(snapUnames.snapshotItem(j)).parents('tr').addClass('not-following');
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