var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    // #1
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        // #2
        formats: [ 'mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function (songNumber, songName, songLength) {
    var template = '<tr class="album-view-song-item">'
    + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;
    
  
    
     var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (parseInt(currentlyPlayingSongNumber) !== null) {
            // Revert to song number for currently playing song number because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            
            currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (parseInt(currentlyPlayingSongNumber) !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            setSong(songNumber);
            $(this).html(pauseButtonTemplate);
            updatePlayerBarSong(playerBarPauseButton);
            currentSoundFile.play();
            // *currentSongFromAlbum = currentAlbum.songs[songNumber -1];
        } else if (parseInt(currentlyPlayingSongNumber) === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song number.
            if (currentSoundFile.isPaused()) {
             $(this).html(pauseButtonTemplate);
             updatePlayerBarSong(playerBarPauseButton);
           // * $('.main-controls .play-pause').html(playerBarPauseButton);
             currentSoundFile.play();
            } else {
                $(this).html(playButtonTemplate);
                //* $('.main-controls .play-pause').html(playerBarPlayButton);
                updatePlayerBarSong(playerBarPlayButton);
                currentSoundFile.pause();
            }
            
            //*$('.main-controls .play-pause').html(playerBarPlayButton);
           // *setSong(null);
            //*currentSongFromAlbum = null;
        }
    };
    
    var onHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== parseInt(currentlyPlayingSongNumber)) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== parseInt(currentlyPlayingSongNumber)) {
            songNumberCell.html(songNumber);
        }
        console.log("songNumber type is " + typeof songNumber +"\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };
    
   var $row = $(template);
    // #1
    $row.find('.song-item-number').click(clickHandler);
    // #2
    $row.hover(onHover, offHover);
    //#3
    return $row;
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');
    
var albumList = [albumPicasso, albumMarconi];
// Store state of playing songs
// #1
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;


var setCurrentAlbum = function(album) {
    currentAlbum = album;
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);  
};

var nextSong = function() {
    
    var getLastSongNumber = function(index) {
      return index == 0 ? currentAlbum.songs.length : index;   
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
    
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    currentSoundFile.play();
    updatePlayerBarSong(playerBarPauseButton);
    
    // Update the Player Bar information
    // $('.currently-playing .song-name').text(currentSongFromAlbum.title);
   // $('.currently-playing .artist-name').text(currentAlbum.artist);
   // $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    // $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};


var previousSong = function() {
    // Note the difference between this implementation and the one in nextSong() 
   var getLastSongNumber = function(index) {
      return index == (currentAlbum.songs.length -1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the song here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length -1;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1)
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    // * unable to play when skipping backward
    currentSoundFile.play();
    
    // Update the Player Bar information
    updatePlayerBarSong(playerBarPauseButton);
    
   // $('.currently-playing .song-name').text(currentSongFromAlbum.title);
   // $('.currently-playing .artist-name').text(currentAlbum.artist);
   // $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    // $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber); //$('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);   //$('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};


var updatePlayerBarSong = function(x) {
  
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    
    $('.main-controls .play-pause').html(x);
    
};

var $playFromPlayerBar = $('.main-controls .play-pause');

var togglePlayFromPlayerBar = function() {
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber)
    if (currentSongFromAlbum && currentSoundFile) {
        if (currentSoundFile.isPaused()) {
            $currentlyPlayingCell.html(pauseButtonTemplate);
            $(this).html(playerBarPauseButton);
            currentSoundFile.play();
            
        } else {
            $currentlyPlayingCell.html(playButtonTemplate);
            $(this).html(playerBarPlayButton);
            currentSoundFile.pause();
        }
    }
};


var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    var i = 0;
    $albumImage.click(function() {
        i = (i + 1) % 3;
        setCurrentAlbum(albumList[i]);
    });
    
    setCurrentAlbum(albumList[i]);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    
    $playFromPlayerBar.click(togglePlayFromPlayerBar)
});
   