jQuery(function ($) {
  "use strict";

  // --- CONFIGURATION ---
  var mediaPath = "audio/";
  var playersData = {
    1: [
      { track: 1, name: "All This Is", duration: "2:46", file: "sample" },
      { track: 2, name: "The Forsaken", duration: "8:30", file: "BS_TF" },
      {
        track: 3,
        name: "All The King's Men",
        duration: "5:01",
        file: "BS_ATKM",
      },
      {
        track: 4,
        name: "The Forsaken (Mix1)",
        duration: "8:31",
        file: "BSFM_TF",
      },
      {
        track: 5,
        name: "The Forsaken (Take 2)",
        duration: "8:36",
        file: "SSB___11_03_TFTake_2",
      },
    ],
    2: [
      { track: 1, name: "Track A", duration: "3:00", file: "JLS_ATI" },
      { track: 2, name: "Track B", duration: "4:20", file: "BS_TF" },
    ],
    3: [
      { track: 1, name: "Track A", duration: "3:00", file: "JLS_ATI" },
      { track: 2, name: "Track B", duration: "4:20", file: "BS_TF" },
    ],
    4: [
      { track: 1, name: "Track A", duration: "3:00", file: "JLS_ATI" },
      { track: 2, name: "Track B", duration: "4:20", file: "BS_TF" },
    ],
    5: [
      { track: 1, name: "Track A", duration: "3:00", file: "JLS_ATI" },
      { track: 2, name: "Track B", duration: "4:20", file: "BS_TF" },
    ],
    6: [
      { track: 1, name: "Track A", duration: "3:00", file: "JLS_ATI" },
      { track: 2, name: "Track B", duration: "4:20", file: "BS_TF" },
    ],
  };

  $(".music-player").each(function () {
    var $player = $(this);
    var playerId = $player.data("player");
    var tracks = playersData[playerId];
    var index = 0,
      extension = "";
    var npAction = $player.find(".npAction");
    var npTitle = $player.find(".npTitle");
    var audio = $player.find("audio").get(0);
    var plList = $player.find(".plList");

    if (!audio || !tracks) return;

    // Initialize Plyr
    var plyrPlayer = new Plyr(audio, {
      controls: [
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "download",
      ],
    });

    // Build Playlist Items
    $.each(tracks, function (key, value) {
      var trackNumber = value.track.toString().padStart(2, "0");
      plList.append(
        '<li><div class="plItem"><span class="plNum">' +
          trackNumber +
          '.</span><span class="plTitle">' +
          value.name +
          '</span><span class="plLength">' +
          value.duration +
          "</span></div></li>"
      );
    });

    var loadTrack = function (id) {
      plList.find("li").removeClass("plSel").eq(id).addClass("plSel");
      npTitle.text(tracks[id].name);
      index = id;
      audio.src = mediaPath + tracks[id].file + extension;
    };

    var playTrack = function (id) {
      loadTrack(id);
      audio.play();
    };

    // UI Updates
    $(audio)
      .on("play", () => npAction.text("Now Playing..."))
      .on("pause", () => npAction.text("Paused..."))
      .on("ended", () => {
        if (index + 1 < tracks.length) playTrack(++index);
        else {
          loadTrack(0);
          audio.pause();
        }
      });

    // --- STOP ON SCROLL FIX ---
    // Uses the global ScrollTrigger instance to stop music when section leaves
    ScrollTrigger.create({
      trigger: $player,
      start: "top bottom",
      end: "bottom top",
      onLeave: () => audio.pause(),
      onLeaveBack: () => audio.pause(),
    });

    // Button Controls
    $player
      .find(".btnPrev")
      .on("click", () => (index - 1 > -1 ? playTrack(--index) : loadTrack(0)));
    $player
      .find(".btnNext")
      .on("click", () =>
        index + 1 < tracks.length ? playTrack(++index) : loadTrack(0)
      );

    // Click on Playlist item
    plList.find("li").on("click", function () {
      var id = $(this).index();
      if (id !== index) playTrack(id);
    });

    // Detect extension and load first track
    extension = audio.canPlayType("audio/mpeg") ? ".mp3" : ".ogg";
    loadTrack(index);
  });
});
