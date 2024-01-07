/**
 * FTQueue – A queue, File uploader Javascript Library. v1.0.0
 * https://github.com/jqrony/ftqueue
 * 
 * @license MIT license
 * @version 1.0.0
 * 
 * @copyright © Copyright 2024 Shahzada Modassir
 * https://github.com/jqrony/ftqueue/blob/main/LICENSE
 * Released under the MIT license
 * 
 * @author Shahzada Modassir
 * date: 02 January 2024 23:48:25 GMT+0530 (India Standard Time)
 */
(function(window) {

/**
 * Inject [use strict] Mode
 * ------------------------
 * Throw ReferenceError when pass undeclare variables
 */
"use strict";

var xhrSupported, encodeURI, decodeURI, formData, each, compile,

	// Instance-specific data
	expando = "ftqueue" + 1 * Date.now(),
	VERSION = "1.0.0",

	// Instance methods
	hasOwn  = ({}).hasOwnProperty,
	arr     = [],
	indexOf = arr.indexOf,
	concat  = arr.concat,
	pop     = arr.pop,
	push    = arr.push,
	slice   = arr.slice,
	flats   = arr.flat,
	unshift = arr.unshift,
	flat    = flatten(flats),

	support      = {},
	transports   = {},
	etag         = {},
	lastModified = {},

	getProto    = Object.getPrototypeOf,
	fnToString  = hasOwn.toString,
	toString    = support.toString,
	ObjFnString = fnToString.call(Object),

	location = window.location,
	isArray  = Array.isArray,
	allTypes = "*/".concat("*"),
	// Anchor tag for parsing the document origin
	originAnchor = document.createElement("a"),

	rqueryparam = /^((\w+=\w+)(&\w+=\w+)*?)+$/,
	rnowhitespace = /[^\x20\t\r\n\f]+/g,
	rprotocol = /^(\/\/)/,
	r20 = /\%20/g,
	rquery = (/\?/),
	rhash = /#.*$/,
	rheaders = /^(.*?):[\t]*([^\r\n]*)$/gm,
	rlocalProtocol = /^(?:about|app|app-storage|.+-extention|file|res|widget):$/,
	xhrSuccessStatusCode = {0: 200, 1223: 204};
	originAnchor.href = location.href;

function flatten(isFlat) {
	return function(array) {
		return isFlat ? flats.call(array) : concat.apply([], array);
	};
}

function isPlainData(data) {
	return isArray(data) || FTQueue.isPlainObject(data)||rqueryparam.test(data);
}

/**
 * 
 */
each=FTQueue.each=Callback(function (_CBFunc, matched, parse) {
	return function (obj, callback) {
		return (isArray(obj) ?
		Callback(_CBFunc, matched, true)
		(Object.create(obj), callback) :
		__fnCall(function (name) {
			for (name in obj) {
				parse && (name = +name);
				matched.push(obj[name]);
				if (__fnCall(callback, obj[name], name, obj[name], obj)===false) {
					pop.call(matched);
					break;
				}
			}
		}), matched);
	};
}, []);

FTQueue.buildParam = function(data) {
	var param = [], prefix,
		add = function(key, valueOrFunc) {
			// If value is a function, invoke it and use its return value
			var value = isFunction(valueOrFunc) ?
				valueOrFunc() :
				valueOrFunc;
			param[param.length] = encodeURI(key) + "=" +
				encodeURI(valueOrFunc==null ? "" : value);
		};

	if (isArray(data)) {
		each(data, function() {
			if (FTQueue.isPlainObject(this) &&
				this.name && hasOwn.call(this, "value")) {
				add(this.name, this.value);
			}
		});
	} else {
		for(prefix in data) add(prefix, data[prefix]);
	}
	return param.join("&").replace(r20, "+");
};

FTQueue.compileAndFilterFileTypes = function(s) {
	var i=0, fileType, accept, base, type;
	s.accept = s.accept.split(/\s*,\s*/);
	if (s.accept[0]===allTypes) {
		s.accept=["*"];
		s.fileTypes["*"]="/*";
	} else {
		for(; i < s.accept.length; i++) {
			if ((fileType = s.accept[i].trim().split("/")) &&
				!hasOwn.call(s.accepts, fileType[0])) {
				delete s.accept[i];
				continue;
			}
			base=fileType[0];
			type=fileType[1];
			if (indexOf.call(s.accept, base)===-1) {
				s.accept[i]=base;
			} else {
				delete s.accept[i];
			}
			if (type==="*") {
				s.fileTypes[base]=s.fileTypes[base]||[];
				push.call(s.fileTypes[base], "*");
			}
			if (indexOf.call(s.fileTypes[base]||[], "*") >= 0) {
				continue;
			}
			if ((accept=s.accepts[base])) {
				if (accept.test(type)) {
					s.fileTypes[base]=s.fileTypes[base]||[];
					push.call(s.fileTypes[base], type);
				} else {
					delete s.accept[i];
				}
			}
		}
	}
	s.accept = flat(s.accept), FTQueue.addQueue(s);
};

// Convert String-formatted options into Object-formatted ones
function createOptions(options) {
	var obj = {};
	each(options.match(rnowhitespace||[]), function(_, flag) {
		obj[flag]=true;
	});
	return obj;
}

/**
 * 
 */
function FTQueue() {
	return !(this instanceof FTQueue) && new FTQueue();
}

FTQueue.ajaxSetup=function(target, setting) {
	setting && FTQueue.extend(target, FTQueue.ajaxSettings);
	return FTQueue.extend(target, setting);
};

FTQueue.prototype.constructor = FTQueue;
FTQueue.prototype.VERSION     = VERSION;

encodeURI=FTQueue.encodeURL=function(uri) {
	return window.encodeURIComponent(uri);
};

decodeURI=FTQueue.decodeURL=function(uri) {
	return window.decodeURIComponent(uri);
};

/**
 * 
 */
FTQueue.extend=FTQueue.prototype.extend=function() {
	var options, name, target = arguments[0] || {},
		i = 1, copy,
		length = arguments.length;

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target!=="object" && !isFunction(target)) {
		target = {};
	}

	// Extend jQrony itself if only one argument is passed
	if (i===length) {
		target=this;
		i--;
	}

	for (; i < length; i++) {
		if ((options = arguments[i]) != null) {
			for(name in options) {
				copy=options[name];

				// Prevent Object.prototype pollution and set continue loop statement
				// Prevent never-ending loop
				if (name==="__proto__" || target===copy) {
					continue;
				}
				
				if (copy!==undefined) {
					target[name]=copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

function Callback(callback, _args) {
	return callback.apply(this, (
		unshift.call(arguments, callback),slice.call(arguments, 1)
	));
}

FTQueue.extend({etag, lastModified, expando});

/**
 * 
 */
FTQueue.memory = function(data) {
	
	var firingIndex=-1, list=[], memory, fired, locked, firing, queue=[],
		options=typeof data==="string" ?
			createOptions(data) : FTQueue.extend({}, data),

		// 
		// TODO:
		fire = function() {
			locked = locked || options.once;
			fired = firing = true;
			for(; queue.length; firingIndex = -1) {
				memory = queue.shift();
				while(++firingIndex < list.length) {
					// Run callback and check for early termination
					if (list[firingIndex].apply(memory[0], memory[1])===false) {
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			firing = false;
			locked && (list = memory ? [] : "");
		},
		add = function(args) {
			each(args, function(_i, arg) {
				isFunction(arg) ? list.push(arg) :
					// Inspect recursively
					(arg && arg.length && typeof arg!=="string" && add(arg));
			});
		},
		controller = {
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function(fn) {
				return fn ?
					indexOf.call(list, fn) > -1 :
					list.length > 0;
			},
			add: function() {
				if (list) {
					memory && !firing && queue.push(memory);
					add(arguments);
					memory && !firing && fire();
				}
				return this;
			},
			// Remove all callbacks from the list
			empty: function() {
				list && (list = []);
				return this;
			},
			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},
			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if (!memory && !firing) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function(context, args) {
				if (!locked) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];
					queue.push(args);
					!firing && fire();
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith(this, arguments);
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return controller;
};

/**
 *
 */
FTQueue.Promise = function(callback) {
	FTQueue.Promise.deffered = FTQueue.Deffered();
	FTQueue.Promise.locked = false;
	
	__fnCall(callback, this,
		function resolve() {
			fireWith("resolve", arguments);
		},
		function reject() {
			fireWith("reject", arguments);
		}
	);

	function fireWith(type, args) {
		if (!FTQueue.Promise.locked) {
			FTQueue.Promise.locked=true;
			setTimeout(function() {
				FTQueue.Promise.deffered[type + "With"](this, args);
			});
		}
	}

	return this;
};

FTQueue.extend(FTQueue.Promise.prototype, {
	then: function(resolver, rejecter) {
		this.done(resolver).catch(rejecter);
		return this;
	},
	"finally": function(callback) {
		this.then(callback, callback);
		return this;
	},
	"catch": function(callback) {
		FTQueue.Promise.deffered.fail(callback);
		return this;
	},
	done: function(callback) {
		FTQueue.Promise.deffered.done(callback);
		return this;
	}
});

/**
 * 
 */
FTQueue.extend({
	Deffered: function(CBFunc) {
		var tupples = [
			["resolve", "done", FTQueue.memory("once memory"), 204, "resolved", 0],
			["notify", "progress", FTQueue.memory("memory"), 303, "running", 2],
			["reject", "fail", FTQueue.memory("once memory"), 408, "rejected", 1]
		],
		state = "pending",
		promise = {
			premise: function(callback) {
				return new FTQueue.Promise(callback);
			},
			state: function() {
				return state;
			},
			always: function() {
				deffered.done(arguments).fail(arguments);
				return this;
			},
			"catch": function(fn) {
				return promise.then(null, fn);
			},
			// Keep pipe for back-compat
			pipe: function(/* funcDone, funcFail, funcProgress */) {
				var funcs = arguments;

				return FTQueue.Deffered(function(newDeffer) {
					each(tupples, function(_i, tupple) {

						var func = __fnCheck(funcs[tupple[5]]);

						// 
						// 
						// 
						deffered[tupple[1]](function() {
							var returned = func && func.apply(this, arguments);
							returned && isFunction(returned.promise) ?
								// 
								returned.promise()
									.progress(newDeffer.notify)
									.done(newDeffer.resolve)
									.fail(newDeffer.reject) :
								newDeffer[tupple[0] + "With"](
									this,
									func ? [returned] : arguments
								);
						});
					});
					funcs=null;
				}).promise();
			},
			then: function(onFulFilled, onRejected, onProgress) {

			},
			promise: function(obj) {
				return obj!==null ? FTQueue.extend(obj, promise) : promise;
			}
		},
		deffered = {};
		// Add list-specific methods
		each(tupples, function(_i, tupple) {
			var list = tupple[2], stateString = tupple[4];
			
			// 
			// 
			// 
			promise[tupple[1]] = list.add;

			// 
			if (stateString) {
				list.add(function() {
					// state = "resolved" (i.e., fulfilled)
					// state = "rejected"
					state = stateString;
				});
			}

			// 
			// 
			// 
			deffered[tupple[0]] = function() {
				deffered[tupple[0] + "With"](this===deffered ? undefined : this, arguments);
				return this;
			};

			// 
			// 
			// 
			deffered[tupple[0] + "With"] = list.fireWith;
		});

		// Make the deffered a promise
		promise.promise(deffered);

		// Call given CBFunc if any
		__fnCall(CBFunc, deffered, deffered);

		return deffered;
	}
});

function attachEvent(event, ajaxEvent, s, fxhr) {
	var compiled = {};
	compile(s, compiled);
	return function handler(e) {
		ajaxEvent=FTQueue.AjaxEvent(e, {
			loads: +((e.loaded / e.total) * 100).toFixed(2),
			file: Object.assign({}, compiled),
			uid: compiled.uid || s.uid,
			config: s,
			percent: parseInt((e.loaded / e.total) * 100) + "%",
			getLoaded: compiled.getLoaded(e.total, e.loaded)
		});
		__fnCall(fxhr.getCache(event), fxhr, ajaxEvent, s);
	};
}

/**
 * TODO:
 */
function configureAndSetupAjaxNeedEvent(upload, s, fxhr) {
	var event, xhrEvent, ajaxEvent,
		propsAndCollapseEvents = {
			progress: "progress",
			loadend: "loadend",
			loaded: "load",
			loadstart: "loadstart"
		};

	for(event in propsAndCollapseEvents) {
		xhrEvent="on" + propsAndCollapseEvents[event];
		upload[xhrEvent]=attachEvent(event, ajaxEvent, s, fxhr);
	}
}

/**
 * TODO:
 */
compile = FTQueue.compile = function(options, comp) {
	var data, file, compile = comp || {}, _total,
		_loaded;

	data = options.forward && flat(Array.from(options.forward));
	data = data || [];
	file = data.pop() || {};
	compile.lastModifiedDate = file.lastModifiedDate;
	compile.postName = data.join("");
	compile.name = file.name;
	compile.type = file.type;
	compile.size = file.size;
	compile.lastModified = file.lastModified;
	compile.webkitRelativePath = file.webkitRelativePath;

	encodeSHA1(compile.name, function(hash) {
		compile.uid = hash;
	});
	
	compile.loads = function(total, loaded) {
		loaded=loaded||_loaded;
		total=total||_total;
		return parseInt((loaded / total) * 100);
	};

	compile.getLoaded = function(total, loaded) {
		_loaded=loaded;
		_total=total;
		return function(e) {
			return compile.loads(total, loaded) + (e ? "%" : 0);
		};
	};

	options.compiled=compile;
	return compile;
};

/**
 * 
 */
FTQueue.addQueue = function(s) {
	var i, filename, allType, typeregex, fileList, file, base, cors, type, fileType,
		fileTypes = s.fileTypes,
		sync = s.sync,
		form = s.formData(),
		files = flat(Object.entries(s.files));

	filename = dashed(files.shift());
	fileList = files.shift();
	s.hasFile = fileList.length > 0;

	if (files.length) {
		window.console.warn("Configure Error: Invalid files data!");
	}

	// Let's validate fileTyes and attach queue with sync/async
	// TODO: Improve more fileTypes and queue handlers for specific version
	for(fileType in fileTypes) {
		cors = fileTypes[fileType];
		cors = !isArray(cors) ? [] : cors;
		for(i=0; i < fileList.length; i++) {
			file=fileList[i];
			type=file.type.split("/");
			allType=cors[0]==="*";
			base=!!file.type && type.shift();
			typeregex = new RegExp("(?:" + cors.join("|").replace(/(\W)/g, "\\$1") + ")");
			if (!type||
				fileType==="*"||allType&&fileType===base||!allType&&typeregex.test(type[0])) {
				sync && (form = s.formData());
				form.append(sync ? filename : filename + "[]", file);
				sync && push.call(files, form);
			}
		}
	}
	!s.sync && s.cors.push(form);
	s.queue = s.sync ? files : [form];
};

function __fnCall(fn, keyword, _args) {
	return __fnApply(fn, keyword, slice.call(arguments, 2));
}

function addTransports(transports) {
	return function(CBFunc) {
		transports[expando]=CBFunc;
	};
}

// Used by dashed as callback to replace()
function fnToLower(char) {
	return ("-" + char).toLowerCase();
}

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function Convert(s, responses, fakeXHR) {
	var json, data;
	try {
		data = JSON.parse(responses.text);
	} catch(e) {
		data = responses.text;
	}

	if (typeof data === "object") {
		json = data;
		s.dataTypes = ["text", "json"];
	}

	fakeXHR.responseJSON = json;

	if (responses.binary) {
		data = responses.binary;
		s.dataTypes = ["text", "binary"];
	}

	if (typeof data==="string") {
		data = data.trim();
	}

	fakeXHR.responseText = data;
	return {state: "success", data};
}

function inspectTransports(transports, s, options, fakeXHR) {
	return __fnCall(transports[expando], s, s, options, fakeXHR);
}

function __fnApply(fn, keyword, args) {
	return isFunction(fn) && fn.apply(keyword, args);
}

function __fnCheck(fn) {
	return isFunction(fn) && fn;
}

function discard(target) {
	return function(prop) {
		return delete target[prop], target;
	};
}

async function encodeSHA1(data, callback) {
	var encoder, buffer, hashBuffer, arrayBuffer, hashText;

	encoder = new TextEncoder();
	buffer = encoder.encode(data);

	hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
	arrayBuffer = Array.from(new Uint8Array(hashBuffer));

	hashText = arrayBuffer.map(function(byte) {
		return byte.toString(16).padStart(2, "0");
	}).join("");
	__fnCall(callback, this, hashText);
}

// * Convert camelCase to dashed used by sender filename
function dashed(string) {
	return (String(string)).replace(/([A-Z])/g, fnToLower);
}

function isFunction(obj) {
	return typeof obj==="function" && typeof obj.nodeType!=="number" &&
		typeof obj.items!=="function";
}

FTQueue.extend({
	// Counter for holding the number of active queries
	active: 0,
	ajaxTransport: addTransports(transports),

	__defaultConfig: {
		fileTypes: true,
		isLocal: true,
		xhr: true,
		accepts: true,
		type: true,
		cors: true,
		formData: true,
		dataTypes: true
	},

	ajaxSettings: {
		url: location.href,
		type: "POST",
		isLocal: rlocalProtocol.test(location.href),
		processData: true,
		cors: [],
		global: true,
		sync: true,
		async: true,
		accept: allTypes,
		fileTypes: {},

		/*
		files: Files {},
		timeout: 0,
		data: null,
		username: null,
		password: null,
		throws: false,
		traditional: false,
		headers: {},

		progress: null,
		success: null,
		loadend: null,
		loaded: null,
		error: null,
		complete: null,
		loadstart: null,
		beforeSend: null,
		*/

		dataTypes: ["text", "html"],

		accepts: {
			text: /^\b(?:plain|html|css|csv|markdown|calendar|nginx|vnd\.wap\.wml|vnd\.zpl|vcard)\b$/,
			video: /^\b(?:mp4|webm|x-msvideo|x-matroska|ogg|vnd\.dlna\.mpeg-tts)\b$/,
			image: /^\b(?:jpeg|png|gif|bmp|svg\+xml|tiff|x-xbitmap|apng)\b$/,
			audio: /^\b(?:mpeg|wav|ogg|midi)\b$/,
			model: /^\bstl\b$/,
			font: /^\b(?:ttf|otf|woff|woff2)\b$/,
			application: /^\b(?:pdf|vnd\.openxmlformats-officedocument\.(?:spreadsheetml\.sheet|wordprocessingml\.document|presentationml\.presentation)|javascript|zip|x-tar|gzip|xml|rss\+xml|json|x-yaml|sla|obj|typescript|manifest\+json|sql|octet-stream|geo\+json|wasm|ecmascript-module|ecmascript|x-ecmascript|dicom|vnd\.google-earth\.kml\+xml|java-archive|x-executable|jsp|ld\+json|wsdl\+xml|xhtml\+xml|oxps|vnd\.mozilla\.xul\+xml|x-shockwave-flash|x-gdscript|x-abiword)\b$/
		}
	}
});

FTQueue.ajaxSettings.formData = function (form, submitter) {
	try {return new FormData(form, submitter)} catch (e) {}
};

formData    = FTQueue.ajaxSettings.formData();
support.FDC = !!formData && ("append" in formData);
support.TFD = formData = !!formData;

FTQueue.isPlainObject = function(obj) {
	var proto, Cofar;

	// Detect obvious negatives
	// Use toString instead of FTQueue.type to catch host objects
	if (!obj || toString.call(obj) !== "[object Object]") {
		return false;
	}

	proto = getProto(obj);

	// Object with not exist prototype and __proto__ data {}
  // ?accept only (e.g., `Object.create( null )`) or plain
	if (!proto) {
		return true;
	}

	Cofar = hasOwn.call(proto, "constructor") && proto.constructor;
	return typeof Cofar==="function" && fnToString.call(Cofar)===ObjFnString;
};

/**
 * 
 */
FTQueue.ajaxEvent = {
	addProp: function(name) {
		Object.defineProperty(FTQueue.AjaxEvent.prototype, name, {
			configurable: true,
			enumerable: true,
			get: function() {
				if (this.originalEvent) {
					return this.originalEvent[name];
				}
			},
			set: function(value) {
				Object.defineProperty(this, name, {
					enumerable: true,
					writable: true,
					value: value,
					configurable: true
				});
			}
		});
	}
};

/**
 * 
 */
FTQueue.AjaxEvent = function(src, props) {

	// Allow instantiation without the 'new' keyword
	if (!(this instanceof FTQueue.AjaxEvent)) {
		return new FTQueue.AjaxEvent(src, props);
	}

	// Assign and Collapse Event object in AjaxEvent
	if (src && src.type) {
		this.originalEvent = src;
		this.type = src.type;
		this.isDefaultPrevented = src.defaultPrevented ||
			src.defaultPrevented===undefined &&
			src.returnValue===false ?
			returnTrue : returnFalse;

		// Create target and srcElement properties
		this.srcElement = src.srcElement;
		this.target = src.target;
		this.currentTarget = src.currentTarget;

	// Add reference Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if (props) {
		FTQueue.extend(this, props);
	}

	// Mark it as fixed
	this[expando] = true;

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timestamp || Date.now();
};

// Add prototype of FTQueue.AjaxEvent
FTQueue.AjaxEvent.prototype = {
	constructor: FTQueue.AjaxEvent,
};

if (typeof Symbol==="function") {
	FTQueue.prototype[Symbol.toStringTag] = "FTQueue";
	FTQueue.AjaxEvent.prototype[Symbol.toStringTag] = "AjaxEvent";
}

// Includes all common event props including xhr event specific props
each({
	defaultPrevented: true,
	isTrusted: true,
	bubbles: true,
	cancelBubble: true,
	cancelable: true,
	composed: true,
	eventPhase: true,
	lengthComputable: true,
	loaded: true,
	total: true,
	returnValue: true,
	lengthComputable: true
}, FTQueue.ajaxEvent.addProp);

FTQueue.prototype.add = function(url, options) {

	// If url is an object, simulate pre-1.5 signature
	if (typeof url==="object") {
		options = options||url;
		url = undefined;
	}

	// Force options to be an object
	options = options || {};

	// Let's discard non-editable options properties
	// TODO: Can be improve more discarding method on specific version
	each(FTQueue.__defaultConfig, discard(options));

	var transport,
		// Request state (becomes false upon send & true upon completion)
		completed,

		// Create the final options object
		s = FTQueue.ajaxSetup({}, options),
		// URL cleanup variable
		urlAnchor,

		// Response headers
		responseHeadersString,
		responseHeaders,

		// URL without anti-cache param
		cacheURL,
		// uncached part of the url
		uncached,

		// Callbacks context
		callbackContext = s.context || s,

		// Deffered
		deffered = FTQueue.Deffered(),
		completeDeffered = FTQueue.memory("once memory"),

		// Status-dependent callbacks
		statusCode = s.statusCode || {},

		timeoutTimerRequest,
		// Loop variable
		i,

		lastModified,
		etag,

		// Default abort message
		strAbort = "canceled",

		// Headers (they are sent all at once)
		requestHeaders = {},
		requestHeadersNames = {},

		// Store transportable/exportable data in cache
		cache = {},

		// Fake XHR async object
		fakeXHR = {
			// Status-dependent callbacks
			statusCode: function(map) {
				var code;
				if (map) {
					if (completed) {
						// Execute the appropriate callbacks
						fakeXHR.always(map[fakeXHR.status]);
					} else {
						// Lazy-add the new callbacks in a way that preserves old ones
						for(code in map) {
							statusCode[code] = [statusCode[code], map[code]];
						}
					}
				}
				return this;
			},
			// Builds headers hashtable if needed
			getResponseHeader: function(key) {
				var match;
				if (completed) {
					if (!responseHeaders) {
						responseHeaders = {};
						while((match = rheaders.exec(responseHeadersString))) {
							responseHeaders[match[1].toLowerCase()]=
							(responseHeaders[match[1].toLowerCase()]||[]).concat(match[2]);
						}
					}
					match = responseHeaders[key.toLowerCase()];
				}
				return match==null ? null : match.join(", ");
			},
			// Cancel the request
			abort: function(statusText) {
				var finalText = statusText || strAbort;
				return transport &&
				transport.abort(finalText), final(0, finalText), this;
			},
			getCache: function(key) {
				return cache[key];
			},
			setCache: function(key, value) {
				cache[key]=value;
			},
			// Raw string
			getAllResponseHeaders: function() {
				return completed ? responseHeadersString : null;
			},
			// SET default readyState is eq 0
			readyState: 0,
			// Caches the header
			setRequestHeader: function(name, value) {
				// if not done xhr
				if (completed==null) {
					name = requestHeadersNames[name.toLowerCase()]=requestHeadersNames[name.toLowerCase()] || name;
					requestHeaders[name] = value;
					return this;
				}
			},
			// Overrides response content-type header
			overrideMimeType: function(type) {
				return completed==null && (s.mimeType=type), this;
			}
		};

		// Attach deffereds
		deffered.promise(fakeXHR);

	// *Allow only plain data like array, object and string param
	if (s.data && s.processData && FTQueue.isPlainData(s.data)) {
		typeof s.data!=="string"&&(s.data=FTQueue.buildParam(s.data));
	}

	// Switch parseable url //example.com/ to http://example.com/
	// Attach with current active origin protocol
	s.url = decodeURI((url || s.url || location.href) + "")
		.trim().replace(rprotocol, location.protocol.concat("$1"));
	
	// * Fix bugs and set type always "POST"
	// Force type method options
	// !Can't change type "permission denied"
	// Change type case or Update type to UpperCase
	s.type = (s.type || "POST").toUpperCase();

	if (s.crossDomain==null) {
		urlAnchor = document.createElement("a"); // create fake anchor
		try {
			urlAnchor.href=s.href;
			urlAnchor.href=urlAnchor.href;
			s.crossDomain = originAnchor.protocol+"//"+originAnchor.host!==
				urlAnchor.protocol + "//" + urlAnchor.host;
		} catch(e) {
			s.crossDomain=true;
		}
	}

	// Save cacheURL in clean If-Modified-Since
  // Remove hash to simplify url manipulation
  cacheURL = s.url.replace(rhash, "");

	if (s.data) {
		// Extract #hash data
    // Remember the hash so we can put it back
		uncached = s.url.slice(cacheURL.length);
		cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
		delete s.data;

		// Put hash and on the URL that will be requested (gh-1732)
		s.url = cacheURL + uncached;
	}

	// Set the If-Modified-Since and/or If-None-Match header
	// if in ifModified mode.
	if (s.ifModified) {
		(lastModified=FTQueue.lastModified[cacheURL]) ?
		fakeXHR.setRequestHeader("If-Modified-Since", lastModified) :
		(etag=FTQueue.etag[cacheURL]) && fakeXHR.setRequestHeader("If-None-Match", etag);
	}

	FTQueue.compileAndFilterFileTypes(s);

	// Check for headers option
	for(i in s.headers) {
		fakeXHR.setRequestHeader(i, s.headers[i]);
	}

	// Allow custom headers/mimetypes and early abort
	if (s.beforeSend &&
		(s.beforeSend.call(callbackContext, fakeXHR, s)===false||completed)) {
		// Abort if not done already and return
		fakeXHR.abort();
	}

	// Aborting is no longer a cancellation
	strAbort = "abort";

	// Install callbacks on deffered and other caches
	s.callbacks=function() {
		fakeXHR.setCache("loadend", s.loadend||s.end);
		completeDeffered.add(s.complete);
		fakeXHR.setCache("progress", s.progress);
		fakeXHR.fail(s.error);
		fakeXHR.progress(s.progress);
		fakeXHR.done(s.success||s.final);
		fakeXHR.setCache("loadstart", s.loadstart||s.start);
		fakeXHR.setCache("loaded", s.loaded);
	};
	s.callbacks();

	// GET: transport
	transport = inspectTransports(transports, s, options, fakeXHR);

	if (!transport) {
		final(-1, "No Transdata");
	} else {
		// Update first readyState
		fakeXHR.readyState = 1;

		// If request was aborted inside a prefilter, stop there
		if (completed) {
			return fakeXHR;
		}

		if (s.async && s.timeout > 0) {
			timeoutTimerRequest = window.setTimeout(function() {
				fakeXHR.abort("timeout");
			}, s.timeout);
		}

		try {
			completed = false;
			transport.send(requestHeaders, final);
		} catch(e) {
			// Rethrow post-completion exceptions
			if (completed) throw e;

			// Propagate others as results of final
			final(-1, e);
		}
	}

	function final(status, nativeStatusText, responses, headers) {
		var isSuccess, success, error, response, modified,
			trans, queueLen, statusText = nativeStatusText;

		// Ignore repeat invocations
    // Fixes maxium call exceed
		if (completed) {
			return;
		}

		s.running && s.callbacks();
		completed = true;

		queueLen = s.queue.length;
		if (s.sync && queueLen > 0 && !s.stop) {
			s.running = true;
			queueLen===0 && (s.stop=true);
			completed = false;
			trans = inspectTransports(transports, s, options, fakeXHR);
		}

		// Clear timeout if it exists
		if (timeoutTimerRequest) {
			window.clearTimeout(timeoutTimerRequest);
		}

		// Dereference transport for early garbage collection
		transport = undefined;

		// Cache response headers
		responseHeadersString = headers || "";

		// SET: readyState in fakeXHR
		fakeXHR.readyState = status > 0 ? 4 : 0;

		// Ajax success condition determine
		if (responses) {
			isSuccess = status >= 200 && status < 300 || status === 304;
		}

		if (responses) {
			response = Convert(s, responses, fakeXHR);
		}

		// If successful, handle type chaining
		if (isSuccess) {
			// Set the If-Modified-Since and/or If-None-Match header,
			// if in ifModified mode.
			if (s.ifModified) {
				modified = fakeXHR.getResponseHeader("Last-Modified");
				modified && (FTQueue.lastModified[cacheURL]=modified);
				modified = fakeXHR.getResponseHeader("etag");
				modified && (FTQueue.etag[cacheURL]=modified);
			}

			// if no content
			if (status===204 || s.type==="HEAD") {
				statusText = "nocontent";
			// if not modified
			} else if (status===304) {
				statusText = "notmodified";
			// Otherwise
			// If we have data, let's convert it
			} else {
				success    = response.data;
				statusText = response.state;
			}
		} else {
			// Extract error from statusText and normalize for non-aborts
			error = statusText;
			if (status || !statusText) {
				statusText = "error";
				// resolve if status will be negative
				status < 0 && (status = 0);
			}
		}

		// Set data for the fake xhr object
		fakeXHR.status = status;
		fakeXHR.statusText = String(nativeStatusText || statusText);

		// Handle: Success/Failure
		isSuccess ?
		deffered.resolveWith(callbackContext, [success, statusText, fakeXHR]) :
			deffered.rejectWith(callbackContext, [fakeXHR, statusText, error]);

		// Handle: queue
		isSuccess && trans && s.sync && trans.send(requestHeaders, final);

		// Status-dependent callbacks
		fakeXHR.statusCode(statusCode);
		statusCode = undefined;

		// Complete
		completeDeffered.fireWith(callbackContext, [fakeXHR, statusText]);
	}

	return fakeXHR;
};

FTQueue.ajaxSettings.xhr = function() {
	try {return new window.XMLHttpRequest()} catch(e) {}
};

xhrSupported = FTQueue.ajaxSettings.xhr();
support.xhru = !!xhrSupported.upload;
support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
support.ajax = xhrSupported = !!xhrSupported;

FTQueue.ajaxTransport(function(options, _, fakeXHR) {
	var callback, errorCallback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if (support.cors || xhrSupported || !options.crossDomain) {
		return {
			abort: function() {callback && callback()},
			send: function(headers, complete) {
				var i, xhr = options.xhr(), xhrUpload;
				xhr.open(
					options.type,      // Always type POST
					options.url,       // custom url
					options.async,     // true/false
					options.username,  // custom username
					options.password   // custom password
				);

				// Apply custom fields if provided or options in xhrFields
				if (options.xhrFields) {
					for(i in options.xhrFields) {
						xhr[i] = options.xhrFields[i];
					}
				}

				// Override mime type if needed or options in mimeType
				if (options.mimeType && xhr.overrideMimeType) {
					xhr.overrideMimeType(options.mimeType);
				}

				// SET: always X-Requested-With header in current headers
				if (!options.crossDomain && !headers["X-Request-With"]) {
					headers["X-Request-With"] = "XMLHttpRequest";
				}

				// SET: headers
				for(i in headers) {
					xhr.setRequestHeader(i, headers[i]);
				}

				xhrUpload = support.xhru && xhr.upload;

				options.forward = options.queue.shift();
				configureAndSetupAjaxNeedEvent(xhrUpload, options, fakeXHR);

				// Callback
				callback = function(type) {
					return function() {
						callback=errorCallback=xhr.onload=xhr.onerror=
							xhr.onabort=xhr.ontimeout=xhr.onreadystatechange=null;
						// Handle "abort"
						if (type==="abort") {
							xhr.abort();
							xhrUpload.abort();
						// Handle "error"
						} else if (type==="error") {
							if (typeof xhr.status!=="number") {
								complete(0, type);
							} else {
								complete(xhr.status, xhr.statusText);
							}
						// Otherwise SET: all complete arguments
						} else {
							complete(
								// Passed 1th argument
								xhrSuccessStatusCode[xhr.status]||xhr.status,
								// Passed 2nd argument
								xhr.statusText,
								// Passed 3rd argument
								(xhr.responseType||"text") !== "text" ||
								typeof xhr.responseText !== "string" ?
								{binary: xhr.response} : {text: xhr.response},
								// Passed last 4th final argument
								xhr.getAllResponseHeaders()
							);
						}
					};
				};

				// Listen-Fire to events
				xhr.onload = callback();

				// Handle errorCallback
				errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
				// Handle upload error
				xhrUpload.ontimeout = xhrUpload.onerror = errorCallback;

				// Handle uncaught aborts force abort function
				if (xhr.onabort!==undefined) {
					xhr.onabort = xhrUpload.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {
						if (xhr.readyState===xhr.DONE||xhr.readyState===4) {
							window.setTimeout(function() {
								callback && errorCallback();
							});
						}
					};
				}

				try {
					xhr.send(options.hasFile && options.forward || null);
					options.hasFile = !!options.queue.length;
				} catch(e) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if (callback) {
						throw e;
					}
				}
			}
		};
	}
});


FTQueue.support=FTQueue.prototype.support=support;
FTQueue.encodeSHA1=encodeSHA1;
FTQueue.isPlainData=isPlainData;
FTQueue.configureAndSetupAjaxNeedEvent=configureAndSetupAjaxNeedEvent;


/**
 * 
 */
// Map over FTQueue in case of overwrite
var _ftqueue = window.FTQueue;

FTQueue.noConflict=function() {
	window.FTQueue===FTQueue && (window.FTQueue=_ftqueue);
};

// Register as named AMD module, since FTQueue can be concatenated with other
// files that may use define
if (typeof define==="function" && define.amd) {
	define("ftqueue", [], function() {
		return FTQueue;
	});

// For CommonJS and CommonJS-like environments
// (such as Node.js) expose a factory as module.exports
} else if (typeof module==="object" && module.exports) {
	module.exports=FTQueue;

// Attach or Extend FTQueue in `window` with Expose FTQueue Identifiers, AMD
// CommonJS for browser emulators (trac-13566)
} else {
	window.FTQueue=FTQueue;
}



return FTQueue;
})(typeof window!=="undefined" ? window : this);