!function(n){var r={};function i(t){if(r[t])return r[t].exports;var e=r[t]={i:t,l:!1,exports:{}};return n[t].call(e.exports,e,e.exports,i),e.l=!0,e.exports}i.m=n,i.c=r,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,n){"use strict";n.r(e);var r=n(1);e.default=r.default},function(t,e,n){"use strict";n.r(e);var r=n(2),i=n(3),u=n(4);function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.state={},this.observer=new r.default,this.initialized=!1,this.dispatch=this.dispatch.bind(this),this.runThroughReducers=Object(u.default)(t)}return function(t,e,n){e&&s(t.prototype,e),n&&s(t,n)}(e,[{key:"getState",value:function(){return this.state}},{key:"initState",value:function(t){return this.initialized||(this.state=t),this.initialized=!0}},{key:"dispatch",value:function(t){this.state=this.runThroughReducers(this.state,t),this.observer.publish(this.state)}},{key:"subscribe",value:function(t){this.observer.subscribe(t)}},{key:"wait",value:function(t,e){Object(i.default)(t,e,this.dispatch)}}]),e}();e.default=o},function(t,e,n){"use strict";function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}n.r(e);var i=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.subscribers=[]}return function(t,e,n){e&&r(t.prototype,e),n&&r(t,n)}(t,[{key:"subscribe",value:function(t){return this.subscribers.includes(t)||this.subscribers.push(t),t}},{key:"unsubscribe",value:function(t){return this.subscribers.includes(t)&&this.subscribers.splice(this.subscribers.indexOf(t),1),t}},{key:"publish",value:function(e){this.subscribers.forEach(function(t){return t(e)})}}]),t}();e.default=i},function(t,e,n){"use strict";n.r(e);e.default=function(t,e,n){return t.then(function(t){n({type:e,payload:t})})}},function(t,e,n){"use strict";n.r(e);e.default=function(i){var u=Object.keys(i);return function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},e=1<arguments.length?arguments[1]:void 0,n=t,r={};return u.forEach(function(t){r=i[t](n,e),n=r}),r}}}]);