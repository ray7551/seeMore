var Url = (function () {

  function getHost(url) {
    if (url.match(/^chrome/)) {
      return 'chrome';
    }

    var match = url.match(/^https?:\/\/([^\/]+)\/?/);
    if (!match) {
      throw Error('Not a valid url: ' + url);
    } else {
      return match[1].toLowerCase();
    }
  }
  /**
   * A regular expression for identifying favicon URLs.
   * @const {!RegExp}
   */
  var Url = function (urlStr) {
    this.url = urlStr;
    Object.defineProperties(this, {
      /**
       * host of url
       * eg: host part of 'https://www.se.com/g?q=3#t' is 'www.se.com'
       * @member {String} host
       * @memberOf Url#
       */
      host: {
        get: function () {
          //noinspection JSPotentiallyInvalidUsageOfThis,JSUnresolvedVariable
          return getHost(this.url);
        },
        enumerable: true
      },
      /**
       * origin of url
       * eg: origin part of 'https://se.com/g?q=3#t' is 'https://se.com'
       * */
      origin: {
        get: function () {
          var match = this.url.match(/^((http|https|chrome|chrome\-extension):\/\/[^\/]+)\/?/);
          if (!match) {
            throw Error('Not a valid url: ' + this.url);
          } else {
            return match[1].toLowerCase();
          }
        },
        enumerable: true
      },
      /**
       * Creates a favicon url depend on given url.
       * @param {number=} size Optional preferred size of the favicon.
       * @param {string=} type Optional type of favicon to request. Valid values
       *     are 'favicon' and 'touch-icon'. Default is 'favicon'.
       * @return {string} url for the favicon.
       */
      faviconUrl: {
        get: function (size, type) {
          size = size || 16;
          type = type || 'favicon';

          return 'chrome://' + type + '/size/' + size + '@1x/' +
            // Note: Literal 'iconurl' must match FAVICON_URL_REGEX
            (Url.FAVICON_URL_REGEX.test(this.url) ? 'iconurl/' + this.url : this.origin);
        },
        enumerable: true
      },
      searchKey: {
        get: function () {
          var match = this.url.match(/([^#?&]+)=%s/i);
          return !match ? '' : match[1];
        },
        enumerable: true
      },
      queryPairs: {
        get: function () {
          var pairs = this.url.match(/([^#?&]+)=([^&]*)/g);
          return pairs ? pairs.map(function (pair) {
            var group = pair.split('=');
            return {
              key: group[0],
              val: decodeURIComponent(group[1])
            }
          }) : [];
        },
        enumerable: true
      },
      isNormal: {
        get: function () {
          return Url.NORMAL_REGEX.test(this.url);
        },
        enumerable: true
      },
      isGoogleFail: {
        get: function () {
          return Url.GOOGLE_FAILED_REGEX.test(this.url);
        },
        enumerable: true
      }
    });
  };
  Url.NORMAL_REGEX = /^https?:\/\//i;
  Url.FAVICON_URL_REGEX = /\.ico$/i;
  Url.GOOGLE_FAILED_REGEX = /^https?:\/\/ipv[46]\.google\.[^/]*\/sorry/i;
  Url.prototype = {
    includes: function (search) {
      return this.url.includeString(search);
    },

    getQueryVal: function (key) {
      var val = this.url.match(new RegExp(key + "=([^\&]*)(\&?)", 'i'));
      return val ? val[1].replace(/\+/g, ' ') : null;
    }
  };
  return Url;
})();

export default Url;