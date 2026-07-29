(function(){
  var F = window.__mediaFallback = {
    add: function(cdn, local) {
      if (!this._map) this._map = {};
      this._map[cdn] = local;
      return this;
    },
    init: function() {
      var map = this._map || {};
      document.querySelectorAll("img[data-fallback]").forEach(function(img){
        var fallback = img.getAttribute("data-fallback");
        img.addEventListener("error", function onErr(){
          if (this.src !== fallback) { this.src = fallback; }
        });
      });
      document.querySelectorAll("video[data-fallback]").forEach(function(v){
        var fallback = v.getAttribute("data-fallback");
        v.addEventListener("error", function onErr(){
          if (this.src !== fallback) { this.src = fallback; this.load(); }
        });
      });
      document.querySelectorAll("[data-bg-cdn]").forEach(function(el){
        var cdn = el.getAttribute("data-bg-cdn");
        var local = el.getAttribute("data-bg-local");
        var img = new Image();
        img.onerror = function(){ el.style.backgroundImage = "url('" + local + "')"; };
        img.src = cdn;
      });
      Object.keys(map).forEach(function(cdn){
        var local = map[cdn];
        document.querySelectorAll("img[src='" + cdn + "']").forEach(function(img){
          img.addEventListener("error", function(){
            if (this.src !== local) this.src = local;
          });
        });
        document.querySelectorAll("video[src='" + cdn + "']").forEach(function(v){
          v.addEventListener("error", function(){
            if (this.src !== local) { this.src = local; this.load(); }
          });
        });
      });
      return this;
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){ F.init(); });
  } else {
    F.init();
  }
})();
