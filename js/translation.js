/*!
 * translation.js v0.4.0
 * https://github.com/Selection-Translator/translation.js#readme
 * Copyright 2015 Milk Lee <milk.lee@qq.com>
 * Licensed under MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("superagent"));
	else if(typeof define === 'function' && define.amd)
		define(["superagent"], factory);
	else if(typeof exports === 'object')
		exports["tjs"] = factory(require("superagent"));
	else
		root["tjs"] = factory(root["superagent"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// 请求 API 接口时发生了网络错误
	var NETWORK_ERROR = 0

	// 请求 HTTP 接口时产生了服务器错误，例如 4xx 或 5xx 的响应，
	// 详情见 http://visionmedia.github.io/superagent/#error-handling
	var SERVER_ERROR = 1

	function Translation () {
	  this.APIs = {}
	}

	/**
	 * 判断 superAgent 的错误对象的类型
	 * @param {{timeout?:Number,status?:Number}} superAgentErr
	 * @returns {Number}
	 */
	function analyzeErrorType (superAgentErr) {
	  if (!superAgentErr.status) {
	    return NETWORK_ERROR
	  } else {
	    return SERVER_ERROR
	  }
	}

	var p = Translation.prototype

	/**
	 * 添加一个翻译实例
	 * @param {API} apiObject
	 */
	p.add = function (apiObject) {
	  var APIs = this.APIs
	  var type = apiObject.type
	  var instances = APIs[type] || (APIs[type] = [])
	  instances.push(apiObject)
	}

	/**
	 * 翻译方法
	 * @param {Query} queryObj
	 * @returns {Promise}
	 */
	p.translate = function (queryObj) {
	  return this.call('translate', queryObj)
	}

	/**
	 * 返回语音 url 的方法
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.audio = function (queryObj) {
	  return this.call('audio', queryObj)
	}

	/**
	 * 检测语种的方法。注意，此方法返回的语种类型是 API 相关的，可能不会遵守标准。
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.detect = function (queryObj) {
	  return this.call('detect', queryObj)
	}

	/**
	 * 调用实例方法
	 * @param {String} method - 想调用实例的哪个方法
	 * @param {Query} queryObj
	 * @returns {Promise}
	 */
	p.call = function (method, queryObj) {
	  var that = this
	  return new Promise(function (resolve, reject) {
	    var instances = that.APIs[queryObj.api]
	    if (!instances) {
	      return reject('没有注册 ' + queryObj.api + ' API。')
	    }

	    var a = instances.shift()
	    instances.push(a)
	    a[method](queryObj).then(function (resultObj) {
	      if (method === 'translate') {
	        resultObj.api = a
	      }
	      resolve(resultObj)
	    }, function (superAgentError) {
	      if (superAgentError == null) {
	        return reject()
	      }
	      reject(analyzeErrorType(superAgentError))
	    })
	  })
	}

	var tjs = new Translation()

	tjs.NETWORK_ERROR = NETWORK_ERROR
	tjs.SERVER_ERROR = SERVER_ERROR

	// 绑定内置构造函数
	tjs.BaiDu = __webpack_require__(1)
	tjs.YouDao = __webpack_require__(4)
	tjs.Bing = __webpack_require__(5)
	tjs.Google = __webpack_require__(6)
	tjs.GoogleCN = __webpack_require__(7)

	module.exports = tjs


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 因为百度翻译 API 要收费，所以没有使用官方提供的接口，而是直接使用 fanyi.baidu.com 的翻译接口
	 */

	var superagent = __webpack_require__(2)
	var invertObj = __webpack_require__(3)

	// http://api.fanyi.baidu.com/api/trans/product/apidoc#languageList
	var standard2custom = {
	  en: 'en',
	  th: 'th',
	  ru: 'ru',
	  pt: 'pt',
	  el: 'el',
	  nl: 'nl',
	  pl: 'pl',
	  bg: 'bul',
	  et: 'est',
	  da: 'dan',
	  fi: 'fin',
	  cs: 'cs',
	  ro: 'rom',
	  sl: 'slo',
	  sv: 'swe',
	  hu: 'hu',
	  de: 'de',
	  it: 'it',
	  zh: 'zh',
	  'zh-CN': 'zh',
	  'zh-TW': 'cht',
	  'zh-HK': 'yue',
	  ja: 'jp',
	  ko: 'kor',
	  es: 'spa',
	  fr: 'fra',
	  ar: 'ara'
	}

	var custom2standard = invertObj(standard2custom)

	/**
	 * 百度翻译构造函数
	 */
	function BaiDu () {
	  this.name = '百度翻译'
	  this.type = 'BaiDu'
	  this.link = 'http://fanyi.baidu.com/'
	}

	/**
	 * 在自定义语种与标准语种之间转换，默认会将标准语种转换为自定义语种
	 * @param {String} lang
	 * @param {Boolean} [invert] - 但如果 invert 为真值，则会将自定义语种转换为标准语种
	 * @return {String}
	 */
	function langResolve (lang, invert) {
	  return (invert ? custom2standard : standard2custom)[lang] || null
	}

	var p = BaiDu.prototype

	/**
	 * 翻译的方法
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.translate = function (queryObj) {
	  var that = this
	  return new Promise(function (resolve, reject) {
	    superagent
	      .get(that.link + '/v2transapi')
	      .query({
	        from: standard2custom[queryObj.from] || 'auto',
	        to: standard2custom[queryObj.to] || 'zh', // 非标准接口一定要提供目标语种
	        query: queryObj.text,
	        transtype: 'hash',
	        simple_means_flag: 3
	      })
	      .end(function (err, res) {
	        if (err) {
	          reject(err)
	        } else {
	          resolve(that.transform(res.body, queryObj))
	        }
	      })
	  })
	}

	/**
	 * 百度翻译返回的数据结构
	 * @typedef {Object} BaiDuRes
	 * @property {Number} [error_code] - 百度翻译错误码
	 * @property {String} from - 翻译结果的源语种，百度格式的
	 * @property {String} to - 翻译结果的目标语种，百度格式的
	 * @property {{src:String,dst:String}[]} [trans_result] - 翻译结果，偶尔抽风可能没有
	 */

	/**
	 * 将百度接口的数据转换为统一格式
	 * @param {BaiDuRes} rawRes
	 * @param {Query} queryObj
	 * @returns {{}}
	 */
	p.transform = function (rawRes, queryObj) {
	  var obj = {
	    text: queryObj.text,
	    response: rawRes
	  }

	  // 源语种、目标语种与在线翻译地址
	  try {
	    var transResult = rawRes.trans_result || {}
	    obj.from = langResolve(transResult.from, true)
	    obj.to = langResolve(transResult.to, true)
	    obj.linkToResult = this.link + '#auto/' + (transResult.to || 'auto') + '/' + queryObj.text
	  } catch (e) {}

	  // 详细释义
	  try {
	    var detailed = []
	    rawRes.dict_result.simple_means.symbols[0].parts.forEach(function (v) {
	      detailed.push(v.part + ' ' + v.means.join('，'))
	    })
	    obj.detailed = detailed
	  } catch (e) {}

	  // 翻译结果
	  try {
	    obj.result = rawRes.trans_result.data.map(function (v) {
	      return v.dst
	    })
	  } catch (e) {}

	  if (!obj.detailed && !obj.result) {
	    obj.error = this.name + '没有返回有效的翻译结果，请稍后重试。'
	  }

	  return obj
	}

	/**
	 * 检测语种的方法， 返回的语种为百度自己格式的语种。
	 * @param {Query} queryObj
	 * @returns {Promise}
	 */
	p.detect = function (queryObj) {
	  var that = this
	  return new Promise(function (resolve, reject) {
	    var from = queryObj.from

	    if (from) {
	      if (langResolve(from)) {
	        resolve(from)
	      } else {
	        reject(null)
	      }
	      return
	    }

	    superagent
	      .post(that.link + '/langdetect')
	      .send('query=' + queryObj.text.slice(0, 73))
	      .end(function (err, res) {
	        if (err) return reject(err)

	        var body = res.body
	        if (body.error === 0) {
	          var lang = langResolve(body.lan, true)
	          if (lang) return resolve(lang)
	        }

	        reject(null)
	      })
	  })
	}

	/**
	 * 返回语音播放的 url
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.audio = function (queryObj) {
	  return this
	    .detect(queryObj)
	    .then(function (lang) { return 'http://fanyi.baidu.com/gettts?lan=' + langResolve(lang) + '&text=' + queryObj.text + '&spd=2&source=web' })
	}

	module.exports = BaiDu


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * 反转一个对象的键值对
	 * @param obj
	 * @return {Object}
	 */
	module.exports = function (obj) {
	  var result = {}
	  for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
	      result[obj[key]] = key
	    }
	  }
	  return result
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// @see http://fanyi.youdao.com/openapi?path=data-mode#bd

	/**
	 * 有道翻译返回的数据结构
	 * @typedef {Object} YouDaoRes
	 * @property {Number} errorCode - 有道翻译错误码，0 表示正常
	 * @property {{phonetic?:String,explains?:String[]}} [basic] - 翻译结果的源语种，百度格式的
	 * @property {String[]} [translation] - 翻译结果，偶尔抽风可能没有
	 */

	var request = __webpack_require__(2)
	var invertObj = __webpack_require__(3)
	var standard2custom = {
	  en: 'eng',
	  ja: 'jap',
	  ko: 'ko',
	  fr: 'fr',
	  ru: 'ru',
	  es: 'es'
	}
	var custom2standard = invertObj(standard2custom)

	function langTransform (lang, invert) {
	  return (invert ? custom2standard : standard2custom)[lang] || null
	}

	YouDao.resolve = langTransform

	/**
	 * 有道翻译构造函数
	 * @param {Object} config
	 * @param {String} config.apiKey
	 * @param {String} config.keyFrom
	 */
	function YouDao (config) {
	  if (!config || !config.apiKey || !config.keyFrom) {
	    throw new Error('有道翻译必须要有 API Key 及 keyFrom，否则无法使用翻译接口。')
	  }

	  this.apiKey = config.apiKey
	  this.keyFrom = config.keyFrom

	  this.name = '有道翻译'
	  this.link = 'http://fanyi.youdao.com/'
	  this.type = 'YouDao'
	  this.errMsg = {
	    20: '有道翻译服务一次性只能翻译200个字符',
	    30: '有道翻译暂时无法翻译这段文本',
	    40: '有道翻译不支持这种语言',
	    50: 'api key被封禁',
	    60: '无词典结果'
	  }
	}

	var p = YouDao.prototype

	/**
	 * 翻译的方法。有道不支持指定源语种或目标语种。
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.translate = function (queryObj) {
	  var that = this
	  return new Promise(function (resolve, reject) {
	    request
	      .get('https://fanyi.youdao.com/openapi.do')
	      .query({
	        key: that.apiKey,
	        keyfrom: that.keyFrom,
	        type: 'data',
	        doctype: 'json',
	        version: '1.1',
	        q: queryObj.text
	      })
	      .end(function (err, res) {
	        if (err) {
	          reject(err)
	        } else {
	          resolve(that.transform(res.body, queryObj))
	        }
	      })
	  })
	}

	/**
	 * 将有道接口的数据转换为统一格式
	 * @param {YouDaoRes} rawRes
	 * @param {Query} queryObj
	 * @returns {{}}
	 */
	p.transform = function (rawRes, queryObj) {
	  var obj = {
	    text: queryObj.text,
	    response: rawRes,
	    linkToResult: 'http://fanyi.youdao.com/translate?i=' + queryObj.text
	  }

	  // rawRes 偶尔是 null
	  if (rawRes) {
	    // 如果有错误码则直接处理错误
	    if (rawRes.errorCode !== 0) {
	      obj.error = this.errMsg[rawRes.errorCode]
	    } else {
	      // 详细释义
	      try {
	        var basic = rawRes.basic
	        obj.detailed = basic.explains
	        obj.phonetic = basic.phonetic
	      } catch (e) {}

	      // 翻译结果
	      try {
	        obj.result = rawRes.translation
	      } catch (e) {}
	    }
	  }

	  if (!obj.error && !obj.detailed && !obj.result) {
	    obj.error = this.name + '没有返回有效的翻译结果，请稍后重试。'
	  }

	  return obj
	}

	/**
	 * 检测语种的方法，有道没有，所以若没有提供源语种就总是返回 null
	 * @param {Query} queryObj
	 * @returns {Promise}
	 */
	p.detect = function (queryObj) {
	  return new Promise(function (resolve, reject) {
	    var from = queryObj.from

	    if (langTransform(from)) {
	      resolve(from)
	    } else {
	      reject(null)
	    }
	  })
	}

	/**
	 * 返回语音播放的 url
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.audio = function (queryObj) {
	  return this
	    .detect(queryObj)
	    .then(function (lang) {
	      var l = langTransform(lang)
	      return 'http://tts.youdao.com/fanyivoice?keyfrom=fanyi%2Eweb%2Eindex&le=' + l + '&word=' + queryObj.text
	    })
	}

	module.exports = YouDao


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 必应词典的这个接口仅支持中文和英文；
	 * 中文会翻译成英文，反之英文会翻译成中文，
	 * 但其它语种全都不支持；
	 * 若翻译了一个不支持的语种（如日语），
	 * 那么语种会被判断为 EN，
	 * 但不会有任何翻译结果。
	 */

	var superagent = __webpack_require__(2)
	var invertObj = __webpack_require__(3)
	var custom2standard = {
	  cn: 'zh-CN',
	  en: 'en'
	}
	var standard2custom = invertObj(custom2standard)

	/**
	 * 在自定义语种与标准语种之间转换，默认会将标准语种转换为自定义语种
	 * @param {String} lang
	 * @param {Boolean} [invert] - 但如果 invert 为真值，则会将自定义语种转换为标准语种
	 * @return {String}
	 */
	function langTransform (lang, invert) {
	  return (invert ? custom2standard : standard2custom)[lang] || null
	}

	/**
	 * 必应翻译
	 */
	function Bing () {
	  this.name = '必应翻译'
	  this.type = 'Bing'
	  this.link = 'http://cn.bing.com/dict/'
	}

	var p = Bing.prototype

	/**
	 * 翻译的方法
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.translate = function (queryObj) {
	  var that = this
	  return new Promise(function (resolve, reject) {
	    superagent
	      .post('http://dict.bing.com.cn/io.aspx')
	      .type('form')
	      .send({
	        t: 'dict',
	        ut: 'default',
	        q: queryObj.text,
	        ulang: 'AUTO',
	        tlang: 'AUTO'
	      })
	      .timeout(that.timeout)
	      .end(function (err, res) {
	        if (err) {
	          reject(err)
	        } else {
	          resolve(that.transform(res.text, queryObj))
	        }
	      })
	  })
	}

	/**
	 * 将必应翻译的数据转换为统一格式
	 * @param responseText
	 * @param queryObj
	 * @returns {{}}
	 */
	p.transform = function (responseText, queryObj) {
	  var rawRes = JSON.parse(responseText)
	  var ROOT = rawRes.ROOT
	  var obj = {
	    text: queryObj.text,
	    to: queryObj.to || 'auto',
	    response: rawRes,
	    from: langTransform(ROOT.$LANG, true),
	    linkToResult: this.link + 'search?q=' + queryObj.text
	  }

	  // 尝试获取错误消息
	  try {
	    var error = rawRes.ERR.$
	    if (error) {
	      obj.error = error
	      return obj
	    }
	  } catch (e) {}

	  // 尝试获取详细释义
	  try {
	    var d = []
	    ROOT.DEF[0].SENS.forEach(function (v) {
	      var s = v.$POS + '. '
	      if (Array.isArray(v.SEN)) {
	        v.SEN.forEach(function (j) {
	          s += j.D.$ + ' '
	        })
	      } else {
	        s += v.SEN.D.$
	      }
	      d.push(s)
	    })
	    obj.detailed = d
	  } catch (e) {}

	  // 尝试获取翻译结果
	  try {
	    obj.result = [ROOT.SMT.R.$.replace(/\{\d+#|\$\d+\}/g, '')]
	  } catch (e) {}

	  if (!obj.detailed && !obj.result) {
	    obj.error = '必应翻译不支持此语种。'
	    obj.from = '' // 不支持的语种始终会被解析为 en，这是不正确的
	  }
	  return obj
	}

	/**
	 * 使用必应翻译检测文本语种。
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.detect = function (queryObj) {
	  return new Promise(function (resolve, reject) {
	    var from = queryObj.from
	    if (langTransform(from)) {
	      resolve(from)
	    } else {
	      reject(null)
	    }
	  })
	}

	/**
	 * 暂时找不到必应的语音播放的接口。它网页上的语音播放没有规律可循。
	 * @returns {Promise}
	 */
	p.audio = function () {
	  return Promise.reject(null)
	}

	module.exports = Bing


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 谷歌翻译支持几乎所有语种，并且它的语种格式就是标准的。
	 */
	var request = __webpack_require__(2)

	/**
	 * 谷歌翻译
	 */
	function Google () {
	  this.name = '谷歌翻译'
	  this.type = 'Google'
	  this.link = 'https://translate.google.com'
	  this.apiRoot = 'https://translate.googleapis.com'
	}

	var p = Google.prototype

	/**
	 * 翻译的方法
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.translate = function (queryObj) {
	  var that = this
	  return new Promise(function (resolve, reject) {
	    request
	      .get(that.link + '/translate_a/single')
	      .query('client=gtx&sl=' + (queryObj.from || 'auto') + '&tl=' + (queryObj.to || 'auto') + '&dt=t&dt=tl&dt=bd&ie=UTF-8&oe=UTF-8&dj=1&q=' + encodeURI(queryObj.text))
          //http://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&dt=tl&dt=bd&dj=1&q=man
          //http://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=bd&q=
	      // {
	      //   client : 'gtx' ,
	      //   sl : 'auto' , // 源语言
	      //   tl : queryObj.to || 'auto' , // 目标语言
	      //   hl : 'zh-CN' ,
	      //   dt : [ 't' , 'bd' ] , // 这个地方必须写成 &dt=t&dt=tl，所以没有用对象的方式声明
	      //   dj : 1 ,
	      //   source : 'icon' ,
	      //   q : queryObj.text
	      // } )
	      .timeout(that.timeout)
	      .end(function (err, res) {
	        if (err) {
	          reject(err)
	        } else {
	          resolve(that.transform(res.body, queryObj))
	        }
	      })
	  })
	}

	/**
	 * 将谷歌翻译的数据转换为统一格式
	 * @param rawRes
	 * @param queryObj
	 * @returns {{}}
	 */
	p.transform = function (rawRes, queryObj) {
	  var obj = {
	    text: queryObj.text,
	    to: queryObj.to || 'auto',
	    from: rawRes.src,
	    response: rawRes
	  }

	  obj.linkToResult = this.link + '/#auto/' + obj.to + '/' + queryObj.text

	  if (typeof rawRes === 'string') {
	    obj.error = '谷歌翻译发生了一个错误，可能是因为查询文本过长造成的。'
	  } else {
	    // 尝试获取详细释义
	    try {
	      var d = []
	      rawRes.dict.forEach(function (v) {
	        d.push(v.pos + '：' + (v.terms.slice(0, 3) || []).join(','))
	      })
	      obj.detailed = d
	    } catch (e) {}

	    // 尝试取得翻译结果
	    try {
	      var result = []
	      rawRes.sentences.forEach(function (v) {
	        result.push(v.trans)
	      })
	      obj.result = result
	    } catch (e) {}

	    if (!obj.detailed && !obj.result) {
	      obj.error = this.name + '没有返回翻译结果，请稍后重试。'
	    }
	  }
	  return obj
	}

	/**
	 * 使用谷歌翻译检测文本语种。
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.detect = function (queryObj) {
	  var that = this
	  return new Promise(function (resolve, reject) {
	    var from = queryObj.from

	    if (from) {
	      return resolve(from)
	    }

	    console.log('detect', queryObj);
	    that
	      .translate(queryObj)
	      .then(function (result) { return resolve(result.from) }, reject)
	  })
	}

	/**
	 * 返回语音播放的 url
	 * @param queryObj
	 * @returns {Promise}
	 */
	p.audio = function (queryObj) {
	  var that = this
	  return this.detect(queryObj)
	    .then(function (lang) {
	      return encodeURI(that.apiRoot + '/translate_tts?ie=UTF-8&q=' + queryObj.text + '&tl=' + lang + '&client=gtx')
	    })
	}

	module.exports = Google



/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Google = __webpack_require__(6)

	function GoogleCN (config) {
	  var google = new Google(config)
	  google.name = '谷歌翻译（国内）'
	  google.type = 'GoogleCN'
	  google.link = 'https://translate.google.cn'
	  google.apiRoot = 'https://translate.google.cn'
	  return google
	}

	module.exports = GoogleCN


/***/ }
/******/ ])
});
;