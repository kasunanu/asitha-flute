jQuery(function ($) {
  'use strict';

  var mediaPath = 'audio/';
  
  // Example tracks per player (you can customize per slide)
  var playersData = {
    "1": [
      { "track": 1, "name": "All This Is", "duration": "2:46", "file": "sample" },
      { "track": 2, "name": "The Forsaken", "duration": "8:30", "file": "BS_TF" },
      { "track": 3, "name": "All The King's Men", "duration": "5:01", "file": "BS_ATKM" },
      { "track": 4, "name": "The Forsaken (Mix1)", "duration": "8:31", "file": "BSFM_TF" },
      { "track": 5, "name": "The Forsaken (Take 2)", "duration": "8:36", "file": "SSB___11_03_TFTake_2" }
    ],
    "2": [
      { "track": 1, "name": "Track A", "duration": "3:00", "file": "JLS_ATI" },
      { "track": 2, "name": "Track B", "duration": "4:20", "file": "BS_TF" },
      { "track": 3, "name": "Track C", "duration": "5:10", "file": "BS_ATKM" },
      { "track": 4, "name": "Track D", "duration": "6:00", "file": "BSFM_TF" },
      { "track": 5, "name": "Track E", "duration": "7:15", "file": "SSB___11_03_TFTake_2" }
    ],
    "3": [
      { "track": 1, "name": "Track A", "duration": "3:00", "file": "JLS_ATI" },
      { "track": 2, "name": "Track B", "duration": "4:20", "file": "BS_TF" },
      { "track": 3, "name": "Track C", "duration": "5:10", "file": "BS_ATKM" },
      { "track": 4, "name": "Track D", "duration": "6:00", "file": "BSFM_TF" },
      { "track": 5, "name": "Track E", "duration": "7:15", "file": "SSB___11_03_TFTake_2" }
    ],
    "4": [
      { "track": 1, "name": "Track A", "duration": "3:00", "file": "JLS_ATI" },
      { "track": 2, "name": "Track B", "duration": "4:20", "file": "BS_TF" },
      { "track": 3, "name": "Track C", "duration": "5:10", "file": "BS_ATKM" },
      { "track": 4, "name": "Track D", "duration": "6:00", "file": "BSFM_TF" },
      { "track": 5, "name": "Track E", "duration": "7:15", "file": "SSB___11_03_TFTake_2" }
    ],
    "5": [
      { "track": 1, "name": "Track A", "duration": "3:00", "file": "JLS_ATI" },
      { "track": 2, "name": "Track B", "duration": "4:20", "file": "BS_TF" },
      { "track": 3, "name": "Track C", "duration": "5:10", "file": "BS_ATKM" },
      { "track": 4, "name": "Track D", "duration": "6:00", "file": "BSFM_TF" },
      { "track": 5, "name": "Track E", "duration": "7:15", "file": "SSB___11_03_TFTake_2" }
    ],
    "6": [
      { "track": 1, "name": "Track A", "duration": "3:00", "file": "JLS_ATI" },
      { "track": 2, "name": "Track B", "duration": "4:20", "file": "BS_TF" },
      { "track": 3, "name": "Track C", "duration": "5:10", "file": "BS_ATKM" },
      { "track": 4, "name": "Track D", "duration": "6:00", "file": "BSFM_TF" },
      { "track": 5, "name": "Track E", "duration": "7:15", "file": "SSB___11_03_TFTake_2" }
    ]
};

  $('.music-player').each(function () {
    var $player = $(this);
    var playerId = $player.data('player');
    var tracks = playersData[playerId];
    var index = 0, playing = false, extension = '';
    var npAction = $player.find('.npAction');
    var npTitle = $player.find('.npTitle');
    var audio = $player.find('audio').get(0);
    var plList = $player.find('.plList');

    // Initialize Plyr
    var plyrPlayer = new Plyr(audio, {
      controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'download']
    });

    // Build playlist
    $.each(tracks, function (key, value) {
      var trackNumber = value.track.toString().padStart(2, '0');
      plList.append('<li ><div class="plItem"><span class="plNum">' + trackNumber +
        '.</span><span class="plTitle">' + value.name +
        '</span><span class="plLength">' + value.duration + '</span></div></li>');
    });

    var loadTrack = function (id) {
      plList.find('li').removeClass('plSel').eq(id).addClass('plSel');
      npTitle.text(tracks[id].name);
      index = id;
      audio.src = mediaPath + tracks[id].file + extension;
      plyrPlayer.on('loadedmetadata', function () {
        $player.find('a[data-plyr="download"]').attr('href', audio.src);
      });
    };

    var playTrack = function (id) {
      loadTrack(id);
      audio.play();
    };

    // Events
    $(audio).on('play', function () {
      playing = true; npAction.text('Now Playing...');
    }).on('pause', function () {
      playing = false; npAction.text('Paused...');
    }).on('ended', function () {
      if ((index + 1) < tracks.length) playTrack(++index);
      else { loadTrack(0); audio.pause(); }
    });

    $player.find('.btnPrev').on('click', function () {
      if ((index - 1) > -1) playTrack(--index); else { loadTrack(0); audio.pause(); }
    });

    $player.find('.btnNext').on('click', function () {
      if ((index + 1) < tracks.length) playTrack(++index); else { loadTrack(0); audio.pause(); }
    });

    plList.find('li').on('click', function () {
      var id = $(this).index();
      if (id !== index) playTrack(id);
    });

    extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
    loadTrack(index);
  });
});
