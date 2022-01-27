$(document).ready(function(){
  // video

  $("#jplayer_1").jPlayer({
    ready: function () {
      $(this).jPlayer("setMedia", {
        type: "youtube",
        title: "test",
        m4v: "https://www.youtube.com/watch?v=WrHDquZ-tj0"
      });
    },
    swfPath: "js",
    supplied: "webmv, ogv, m4v",
    size: {
      width: "100%",
      height: "360px",
      cssClass: "jp-video-360p"
    },
    globalVolume: true,
    smoothPlayBar: true,
    keyEnabled: true
  });

  $(function() {
    /* Youtube Integration Setup */
    var setupYoutube = function(whereDivTo, width, height) {
        $("<div>").attr("id", "ytplayer").appendTo(whereDivTo);

        onYouTubeIframeAPIReady = function() {
            youtubeApi = new YT.Player("ytplayer", {
                width: width,
                height: height,
                videoId: "WrHDquZ-tj0",
                playerVars: {
                    "autoplay": 1,
                    "color": "white",
                    "modestbranding": 1,
                    "rel": 0,
                    "showinfo": 0,
                    "theme": "light"
                },
                events: {
                    "onReady": function() {
                        $(document).trigger("ready.Youtube");
                    },
                    "onStateChange": "youtubeStateChange"
                }
            });
        }

        $.getScript("//www.youtube.com/player_api");
    },
    loadYoutubeListeners = function(player, jplayer, id) {
        var container = $(player.options.cssSelector.gui, player.options.cssSelectorAncestor);

        youtubeStateChange = function(ytEvent) {
            switch(ytEvent.data) {
                case -1:
                    $(ytEvent.target.getIframe()).show();
                    $(jplayer).find('video').hide();
                    container.css({ 'opacity' : 0, 'z-index': -1, 'position' : 'relative' });
                    container.find('.jp-interface').slideUp("slow");
                break;

                case YT.PlayerState.ENDED:
                    $(jplayer).trigger($.jPlayer.event.ended);
                break;

                case YT.PlayerState.CUED:
                    $(jplayer).find('video').show();
                    $(ytEvent.target.getIframe()).hide();
                    container.css({ 'opacity' : 1, 'z-index': 0 });
                    container.find('.jp-interface').slideDown("slow");

            }
        };

        youtubeApi.loadVideoById(id);
    }

    $(document).on($.jPlayer.event.setmedia, function(jpEvent) {
        var player = jpEvent.jPlayer,
            url = player.status.src;

        if(!player.html.video.available) return;
        if(typeof player.status.media.type === "undefined" || player.status.media.type != 'youtube') {
            if(window['youtubeApi'])
                if(youtubeApi.getPlayerState() != YT.PlayerState.CUED && youtubeApi.getPlayerState() != YT.PlayerState.ENDED)
                    return youtubeApi.stopVideo();

            return;
        }

        var youtubeId = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)[1]

        if(window['youtubeApi'])
            loadYoutubeListeners(player, jpEvent.target, youtubeId);
        else {
            setupYoutube(jpEvent.target, player.status.width, player.status.height);

            $(document).on("ready.Youtube", function() {
                loadYoutubeListeners(player, jpEvent.target, youtubeId);
            });
        }
    });

  });

});