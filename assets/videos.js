// Click-to-play: the YouTube player loads only when someone clicks (privacy + speed).
// Opened straight from the computer (file://) YouTube refuses embeds, so open it on YouTube instead.
var isLocal = location.protocol === 'file:';
document.querySelectorAll('.yt').forEach(function (b) {
  var id = b.dataset.id, watch = 'https://www.youtube.com/watch?v=' + id;
  b.addEventListener('click', function () {
    if (isLocal) { window.open(watch, '_blank', 'noopener'); return; }
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
    f.title = b.getAttribute('aria-label');
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.allowFullscreen = true;
    b.replaceChildren(f);
  });
});
