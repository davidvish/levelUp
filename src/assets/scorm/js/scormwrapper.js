export const jsCode = `
console.log('[SCORM WRAPPER] Injected script loaded.');
const originalSetValue = window.API?.LMSSetValue || window.API_1484_11?.SetValue;

function wrappedSetValue(param, value) {
  console.log('[SCORM WRAPPER] LMSSetValue called:', param, value);

  if (param === 'cmi.core.lesson_status' || param === 'cmi.completion_status') {
    if (value === 'completed') {
      console.log('[SCORM WRAPPER] Detected course completion.');
      window.parent.postMessage(JSON.stringify({ type: 'COURSE_COMPLETED' }), '*');
    } else {
      console.log('[SCORM WRAPPER] Detected course incomplete or other status.');
      window.parent.postMessage(JSON.stringify({ type: 'COURSE_INCOMPLETE' }), '*');
    }
  }

  return originalSetValue(param, value);
}

if (window.API) {
  console.log('[SCORM WRAPPER] Patching SCORM 1.2 API');
  window.API.LMSSetValue = wrappedSetValue;
}
if (window.API_1484_11) {
  console.log('[SCORM WRAPPER] Patching SCORM 2004 API');
  window.API_1484_11.SetValue = wrappedSetValue;
}
`;


//`
// (function () {
//   const testMessage = {
//     type: 'SCORM_WRAPPER_CONNECTED',
//     data: {
//       timestamp: new Date().toISOString(),
//       message: 'SCORM wrapper successfully loaded and connected.'
//     }
//   };

//   if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
//     window.ReactNativeWebView.postMessage(JSON.stringify(testMessage));
//   } else {
//     console.warn('ReactNativeWebView not available when sending SCORM_WRAPPER_CONNECTED');
//   }
// })();
//          function (LevelUpLMS) {
//                 var Scorm;
//                 !function (Scorm) {
//                     var CommunicationUrl = "/api/scorm/", token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIyMzRiODAzOC1mY2EzLTQzZTctOTEzZi05ODE3YTQxNDU4NTMiLCJyb2xlIjoiVXNlciIsImRldmljZXRva2VuIjoiMTMzOTIxMTM3NzA4NzcwMTYwLTUyOTUyMDk4LWQxZjUtNDAxOS1iMTk4LTZjM2E0N2MzMjgyNCIsIm9pZCI6IiIsImVtYWlsIjoic2lyaS5iaGFuZHlhQGV2b2x2b3VzLmNvbSIsInN1YiI6InNpcmkuYmhhbmR5YUBldm9sdm91cy5jb20iLCJqdGkiOiJlMDc5MWY0ZC02OGM0LTQyNDYtYTIzNS1hNjg1MmQxOWUzMjgiLCJuYmYiOjE3NDc2NDkzMDcsImV4cCI6MTc0NzY4NTMwNywiaWF0IjoxNzQ3NjQ5MzA3LCJpc3MiOiJodHRwczovL2xldmVsdXBsbXMuY29tLyIsImF1ZCI6ImxldmVsdXAtdXNlcnMifQ.rcO10XXVBkaigPghmP0fK6HEGAtNswdgH5SBT4sIHuM", LevelUpLmsApiStates, HttpStatusCodes;
//                     !function (e) {
//                         e[e.NOT_INITIALIZED = 0] = "NOT_INITIALIZED",
//                             e[e.RUNNING = 1] = "RUNNING",
//                             e[e.TERMINATED = 2] = "TERMINATED"
//                     }(LevelUpLmsApiStates = Scorm.LevelUpLmsApiStates || (Scorm.LevelUpLmsApiStates = {})),
//                         function (e) {
//                             e[e.CONTINUE = 100] = "CONTINUE",
//                                 e[e.SWITCHING_PROTOCOLS = 101] = "SWITCHING_PROTOCOLS",
//                                 e[e.OK = 200] = "OK",
//                                 e[e.CREATED = 201] = "CREATED",
//                                 e[e.ACCEPTED = 202] = "ACCEPTED",
//                                 e[e.NON_AUTHORITATIVE_INFORMATION = 203] = "NON_AUTHORITATIVE_INFORMATION",
//                                 e[e.NO_CONTENT = 204] = "NO_CONTENT",
//                                 e[e.RESET_CONTENT = 205] = "RESET_CONTENT",
//                                 e[e.PARTIAL_CONTENT = 206] = "PARTIAL_CONTENT",
//                                 e[e.MULTIPLE_CHOICES = 300] = "MULTIPLE_CHOICES",
//                                 e[e.MOVED_PERMANENTLY = 301] = "MOVED_PERMANENTLY",
//                                 e[e.FOUND = 302] = "FOUND",
//                                 e[e.SEE_OTHER = 303] = "SEE_OTHER",
//                                 e[e.NOT_MODIFIED = 304] = "NOT_MODIFIED",
//                                 e[e.USE_PROXY = 305] = "USE_PROXY",
//                                 e[e.TEMPORARY_REDIRECT = 307] = "TEMPORARY_REDIRECT",
//                                 e[e.BAD_REQUEST = 400] = "BAD_REQUEST",
//                                 e[e.UNAUTHORIZED = 401] = "UNAUTHORIZED",
//                                 e[e.UNAUTHORIZED_TIMEOUT = 401.103] = "UNAUTHORIZED_TIMEOUT",
//                                 e[e.PAYMENT_REQUIRED = 402] = "PAYMENT_REQUIRED",
//                                 e[e.FORBIDDEN = 403] = "FORBIDDEN",
//                                 e[e.SEARCH_TOO_MANY_RESULTS = 403.111] = "SEARCH_TOO_MANY_RESULTS",
//                                 e[e.NOT_FOUND = 404] = "NOT_FOUND",
//                                 e[e.METHOD_NOT_ALLOWED = 405] = "METHOD_NOT_ALLOWED",
//                                 e[e.NOT_ACCEPTABLE = 406] = "NOT_ACCEPTABLE",
//                                 e[e.PROXY_AUTHENTICATION_REQUIRED = 407] = "PROXY_AUTHENTICATION_REQUIRED",
//                                 e[e.REQUEST_TIMEOUT = 408] = "REQUEST_TIMEOUT",
//                                 e[e.CONFLICT = 409] = "CONFLICT",
//                                 e[e.GONE = 410] = "GONE",
//                                 e[e.LENGTH_REQUIRED = 411] = "LENGTH_REQUIRED",
//                                 e[e.PRECONDITION_FAILED = 412] = "PRECONDITION_FAILED",
//                                 e[e.REQUEST_ENTITY_TOO_LARGE = 413] = "REQUEST_ENTITY_TOO_LARGE",
//                                 e[e.REQUEST_URI_TOO_LONG = 414] = "REQUEST_URI_TOO_LONG",
//                                 e[e.UNSUPPORTED_MEDIA_TYPE = 415] = "UNSUPPORTED_MEDIA_TYPE",
//                                 e[e.REQUESTED_RANGE_NOT_SATISFIABLE = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE",
//                                 e[e.EXPECTATION_FAILED = 417] = "EXPECTATION_FAILED",
//                                 e[e.UNPROCESSABLE_ENTITY = 422] = "UNPROCESSABLE_ENTITY",
//                                 e[e.TOO_MANY_REQUESTS = 429] = "TOO_MANY_REQUESTS",
//                                 e[e.INTERNAL_SERVER_ERROR = 500] = "INTERNAL_SERVER_ERROR",
//                                 e[e.NOT_IMPLEMENTED = 501] = "NOT_IMPLEMENTED",
//                                 e[e.BAD_GATEWAY = 502] = "BAD_GATEWAY",
//                                 e[e.SERVICE_UNAVAILABLE = 503] = "SERVICE_UNAVAILABLE",
//                                 e[e.GATEWAY_TIMEOUT = 504] = "GATEWAY_TIMEOUT",
//                                 e[e.HTTP_VERSION_NOT_SUPPORTED = 505] = "HTTP_VERSION_NOT_SUPPORTED"
//                         }(HttpStatusCodes = Scorm.HttpStatusCodes || (Scorm.HttpStatusCodes = {}));
//                     var Mutable = function (e) {
//                         void 0 === e && (e = null),
//                             this.Value = e
//                     }
//                         , ReadOnly = function (e) {
//                             function t(t) {
//                                 return void 0 === t && (t = null),
//                                     e.call(this, t) || this
//                             }
//                             return __extends(t, e),
//                                 t
//                         }(Mutable)
//                         , WriteOnly = function (e) {
//                             function t(t) {
//                                 return void 0 === t && (t = null),
//                                     e.call(this, t) || this
//                             }
//                             return __extends(t, e),
//                                 t
//                         }(Mutable)
//                         , MutableList = function (e) {
//                             function t(t) {
//                                 var i = e.call(this, new Array) || this;
//                                 return i._children = new ReadOnly(t),
//                                     i
//                             }
//                             return __extends(t, e),
//                                 t.prototype._count = function () {
//                                     return this.Value.length
//                                 }
//                                 ,
//                                 t
//                         }(Mutable)
//                         , InteractionObjective = function (e) {
//                             void 0 === e && (e = {}),
//                                 this.id = new Mutable(e.id)
//                         }
//                         , InteractionCorrectResponses = function (e) {
//                             void 0 === e && (e = {}),
//                                 this.pattern = new Mutable(e.pattern)
//                         }
//                         , Interaction = function (e) {
//                             void 0 === e && (e = {}),
//                                 this.id = new Mutable(e.id),
//                                 this.type = new Mutable(e.type),
//                                 this.objectives = new MutableList(e.objectives),
//                                 this.time = new WriteOnly(e.time),
//                                 this.timestamp = new Mutable(e.timestamp),
//                                 this.correct_responses = new MutableList(e.correct_responses),
//                                 this.student_response = new WriteOnly(e.student_response),
//                                 this.weighting = new Mutable(e.weighting),
//                                 this.learner_response = new Mutable(e.learner_response),
//                                 this.result = new Mutable(e.result),
//                                 this.latency = new Mutable(e.latency),
//                                 this.description = new Mutable(e.description),
//                                 this.text = new Mutable(e.text)
//                         }
//                         , Objective = function (e) {
//                             void 0 === e && (e = {}),
//                                 this.id = new Mutable(e.id),
//                                 this.status = new Mutable(e.status),
//                                 this.success_status = new Mutable(e.success_status),
//                                 this.completion_status = new Mutable(e.completion_status),
//                                 this.progress_measure = new Mutable(e.progress_measure),
//                                 this.description = new Mutable(e.description),
//                                 this.score = {
//                                     _children: new ReadOnly("scaled,min,max,raw"),
//                                     scaled: new Mutable,
//                                     raw: new Mutable,
//                                     min: new Mutable,
//                                     max: new Mutable
//                                 }
//                         }
//                         , Comment = function () { }
//                         , activityEvent = new CustomEvent("levelUp:events:scormActivity")
//                         , unauthorizedEvent = new CustomEvent("levelUp:events:scormUnauthorized")
//                         , notFoundEvent = new CustomEvent("levelUp:events:scormNotFound")
//                         , Api = function () {
//                             function Api() {
//                                 this.version = "1.0",
//                                     this.IsCommitting = !1,
//                                     this.isUnauthorized = !1,
//                                     this.lmsInitializationInterval = 2e3,
//                                     this.lmsLastInitializedAt = null,
//                                     this.error = 0,
//                                     this.state = LevelUpLmsApiStates.NOT_INITIALIZED,
//                                     this.useFetchOnCommit = true,
//                                     this.useFetchFallback = true,
//                                     this.useReducedData = true,
//                                     this.cmi = {
//                                         attemptId: "507ae5da-04d1-486c-d91c-08dd96ac92f4",
//                                         _version: new ReadOnly(this.version),
//                                         comments_from_lms: new ReadOnly,
//                                         learner_id: "4f5904e2-a8c7-44c9-38ec-08dc23186aec",
//                                         learner_name: "SIRI BHANDYA",
//                                         assignedDate: "2025-05-14T05:48:57.2285457",
//                                         completion_status: new Mutable("incomplete"),
//                                         completion_threshold: new ReadOnly,
//                                         credit: new ReadOnly("credit"),
//                                         entry: new ReadOnly("ab-initio"),
//                                         exit: new WriteOnly,
//                                         launch_data: new ReadOnly,
//                                         location: new Mutable,
//                                         max_time_allowed: new ReadOnly,
//                                         mode: new ReadOnly("normal"),
//                                         progress_measure: new Mutable,
//                                         scaled_passing_score: new ReadOnly,
//                                         student_data: {
//                                             _children: new ReadOnly("mastery_score"),
//                                             mastery_score: new Mutable
//                                         },
//                                         score: {
//                                             _children: new ReadOnly("scaled,min,max,raw"),
//                                             scaled: new Mutable,
//                                             raw: new Mutable,
//                                             min: new Mutable,
//                                             max: new Mutable
//                                         },
//                                         session_time: new WriteOnly,
//                                         success_status: new Mutable("unknown"),
//                                         suspend_data: new Mutable,
//                                         time_limit_action: new ReadOnly,
//                                         total_time: new ReadOnly,
//                                         comments_from_learner: new MutableList("comment,location,timestamp"),
//                                         interactions: new MutableList("id,type,objectives,timestamp,correct_responses,weighting,student_response,learner_response,result,latency,description,text"),
//                                         objectives: new MutableList("id,status,score,success_status,completion_status,progress_measure,description"),
//                                         student_preference: {
//                                             _children: new ReadOnly("audio,language,speed,text"),
//                                             audio: new Mutable,
//                                             language: new Mutable,
//                                             speed: new Mutable,
//                                             text: new Mutable
//                                         },
//                                         core: {
//                                             _children: new ReadOnly("student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,exit,session_time,launch_data"),
//                                             score: {},
//                                             lesson_mode: new ReadOnly("normal")
//                                         }
//                                     },
//                                     this.adl = {
//                                         nav: {
//                                             request: new Mutable,
//                                             request_valid: {
//                                                 continue: new ReadOnly("true,false,unknown"),
//                                                 previous: new ReadOnly("true,false,unknown")
//                                             }
//                                         }
//                                     },
//                                     this.cmi.core.lesson_location = this.cmi.location,
//                                     this.cmi.core.lesson_status = this.cmi.completion_status,
//                                     this.cmi.core.student_id = this.cmi.learner_id,
//                                     this.cmi.core.student_name = this.cmi.learner_name,
//                                     this.cmi.core.score._children = this.cmi.score._children,
//                                     this.cmi.core.score.scaled = this.cmi.score.scaled,
//                                     this.cmi.core.score.min = this.cmi.score.min,
//                                     this.cmi.core.score.max = this.cmi.score.max,
//                                     this.cmi.core.score.raw = this.cmi.score.raw,
//                                     this.cmi.core.entry = this.cmi.entry,
//                                     this.cmi.core.exit = this.cmi.exit,
//                                     this.cmi.core.total_time = this.cmi.total_time,
//                                     this.cmi.core.session_time = this.cmi.session_time,
//                                     this.cmi.core.suspend_data = this.cmi.suspend_data,
//                                     this.cmi.core.launch_data = this.cmi.launch_data,
//                                     this.cmi.core.credit = this.cmi.credit,
//                                     Api.prototype.Initialize = this.ApiCallHandler(this.Initialize, "Initialize"),
//                                     Api.prototype.Terminate = this.ApiCallHandler(this.Terminate, "Terminate"),
//                                     Api.prototype.GetValue = this.ApiCallHandler(this.GetValue, "GetValue"),
//                                     Api.prototype.SetValue = this.ApiCallHandler(this.SetValue, "SetValue"),
//                                     Api.prototype.Commit = this.ApiCallHandler(this.Commit, "Commit"),
//                                     Api.prototype.GetDiagnostic = this.ApiCallHandler(this.GetDiagnostic, "GetDiagnostic"),
//                                     Api.prototype.GetErrorString = this.ApiCallHandler(this.GetErrorString, "GetErrorString"),
//                                     Api.prototype.GetLastError = this.ApiCallHandler(this.GetLastError, "GetLastError"),
//                                     this.LMSInitialize = this.Initialize,
//                                     this.LMSFinish = this.Terminate,
//                                     this.LMSGetValue = this.GetValue,
//                                     this.LMSSetValue = this.SetValue,
//                                     this.LMSCommit = this.Commit,
//                                     this.LMSGetDiagnostic = this.GetDiagnostic,
//                                     this.LMSGetErrorString = this.GetErrorString,
//                                     this.LMSGetLastError = this.GetLastError
//                             }
//                             return Api.Reset = function () {
//                                 API_1484_11 = new Api
//                             }
//                                 ,
//                                 Api.prototype.Log = function (e, t, i) {
//                                     void 0 === t && (t = null),
//                                         void 0 === i && (i = null)
//                                 }
//                                 ,
//                                 Api.prototype.ApiCallHandler = function (e, t) {
//                                     var i = this;
//                                     return function () {
//                                         try {
//                                             var n = e.apply(i, arguments);
//                                             return i.Log(t, n, arguments),
//                                                 n
//                                         } catch (e) {
//                                             throw i.Log(t, e),
//                                             e
//                                         }
//                                     }
//                                 }
//                                 ,
//                                 Api.prototype.Initialize = function () {
//                                     var e = new Date;
//                                     if (this.lmsLastInitializedAt && e.getTime() - this.lmsLastInitializedAt.getTime() < this.lmsInitializationInterval)
//                                         return "true";
//                                     if (this.lmsLastInitializedAt = new Date,
//                                         this.state === LevelUpLmsApiStates.TERMINATED)
//                                         return this.error = 103,
//                                             "false";
//                                     var t = this.cmi.attemptId.Value;
//                                     var assignDate = this.cmi.assignedDate.Value
//                                         , i = new XMLHttpRequest;
//                                     if (i.open("GET", CommunicationUrl + "Initialize/" + t, !1),
//                                         null != token && "" !== token.trim() && i.setRequestHeader("Authorization", "Bearer " + token),
//                                         i.setRequestHeader("Accept-Language", "en"),
//                                         i.send(null),
//                                         200 === i.status) {
//                                         var n = i.responseText;
//                                         if (n) {
//                                             var r = utils.dotifyObject(JSON.parse(n).data, "cmi");
//                                             for (var a in r)
//                                                 if (r.hasOwnProperty(a)) {
//                                                     var o = this.GetCmiObjectByName(a);
//                                                     o instanceof Mutable && (o instanceof MutableList ? o.Value.push(this.CreateNewArrayObjectFlat(a, r[a])) : o.Value = r[a])
//                                                 }
//                                             null !== r["cmi.exit"] && (this.cmi.entry.Value = "resume"),
//                                                 this.cmi.attemptId.Value = t,
//                                                 this.cmi.assignedDate.Value = assignDate,
//                                                 this.cmi && this.cmi.location && "null" === r["cmi.location"] && (this.cmi.location.Value = null),
//                                                 this.cmi && this.cmi.suspend_data && "null" === r["cmi.suspend_data"] && (this.cmi.suspend_data.Value = null)
//                                         }
//                                         this.state = LevelUpLmsApiStates.RUNNING,
//                                             this.error = 0
//                                     } else
//                                         this.error = 1001;
//                                     return 0 === this.error ? "true" : "false"
//                                 }
//                                 ,
//                                 Api.prototype.Terminate = function () {
//                                     return console.log("Terminating"),
//                                         this.Commit(),
//                                         this.state = LevelUpLmsApiStates.TERMINATED,
//                                         "true"
//                                 }
//                                 ,
//                                 Api.prototype.GetValue = function (e) {
//                                     var t = this.GetCmiObjectByName(e);
//                                     return t instanceof WriteOnly ? (this.error = 405,
//                                         "false") : (this.error = 0,
//                                             t instanceof Mutable ? null === t.Value ? "" : t.Value : null === t ? "" : t)
//                                 }
//                                 ,
//                                 Api.prototype.SetValue = function (e, t) {
//                                     var i = this.GetCmiObjectByName(e);
//                                     return null === i ? (this.error = 351,
//                                         "false") : i instanceof ReadOnly ? (this.error = 404,
//                                             "false") : (i.Value = t,
//                                                 this.onActivity(),
//                                                 this.error = 0,
//                                                 "true")
//                                 }
//                                 ,
//                                 Api.prototype.Commit = function () {
//                                     return "true" === this.useFetchFallback ? this.Commit_5_84_3() : "true" === this.useFetchOnCommit ? this.Commit_5_84_0() : this.Commit_5_83()
//                                 }
//                                 ,
//                                 Api.prototype.Commit_5_83 = function () {
//                                     if (!this.IsCommitting) {
//                                         this.IsCommitting = true;
//                                         var e = this.PrepareCommitData();
//                                         e.attemptId = this.cmi.attemptId.Value;
//                                         e.assignedDate = this.cmi.assignedDate.Value;
//                                         try {
//                                             var t = new XMLHttpRequest();
//                                             t.open("POST", CommunicationUrl + "Commit", true);
//                                             t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//                                             t.setRequestHeader("Authorization", "Bearer " + token);
//                                             t.setRequestHeader("Accept-Language", "en");
//                                             t.send(utils.parameterizeObject(e, this.useReducedData));
//                                             t.onload = function () {
//                                                 if (t.readyState === 4 && t.status === 200) {
//                                                     var res = JSON.parse(t.response);
//                                                     if (res.statusCode === 200) {
//                                                         sendMessageToReactNative('GAMIFICATION_ADDED');
//                                                         sendMessageToReactNative('DATA_EVENT', { res, event: e });
//                                                         if (res.data && res.data.isCourseCompleted === true) {
//                                                             if (
//                                                                 e.completion_status === 'completed' ||
//                                                                 e.completion_status === 'passed' ||
//                                                                 e.completion_status === 'failed'
//                                                             ) {
//                                                                 console.log('Commit_5_83', res);
//                                                                 sendMessageToReactNative('COURSE_COMPLETED');
//                                                             }
//                                                         }
//                                                     }
//                                                 }
//                                             };
//                                         } catch (ex) {
//                                             console.log('Could not commit server.', ex);
//                                             this.IsCommitting = true;
//                                             return 'false';
//                                         }
//                                         this.IsCommitting = false;
//                                     }
//                                     return 'true';
//                                 }
//                                 ,
//                                 Api.prototype.Commit_5_84_0 = function () {
//                                     var e = this;
//                                     if (!this.IsCommitting) {
//                                         this.IsCommitting = !0;
//                                         var t = this.PrepareCommitData();
//                                         t.attemptId = this.cmi.attemptId.Value;
//                                         t.assignedDate = this.cmi.assignedDate.Value;
//                                         try {
//                                             if (window.fetch && "true" === this.useFetchOnCommit)
//                                                 fetch(CommunicationUrl + "Commit", {
//                                                     method: "POST",
//                                                     body: utils.parameterizeObject(t, this.useReducedData),
//                                                     keepalive: !0,
//                                                     headers: {
//                                                         "Content-Type": "application/x-www-form-urlencoded",
//                                                         Authorization: "Bearer " + token,
//                                                         "Accept-Language": "en"
//                                                     }
//                                                 }).then(i => {
//                                                     var res = JSON.parse(i.response);
//                                                     if (res.statusCode == 200) {
//                                                         const eventSendBack = {
//                                                             res: res,
//                                                             event: e
//                                                         }
//                                                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GAMIFICATION_ADDED' }));
//                                                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DATA_EVENT', data: eventSendBack }));
//                                                         //  MarcDialogs.alert('Course completed Successfully!');
//                                                         if (res.data != null) {
//                                                             if (res.data.isCourseCompleted == true) {
//                                                                 if (t.completion_status == 'completed' || t.completion_status == 'passed' || t.completion_status == 'failed') {
//                                                                     // alert("Course completed Successfully!");
//                                                                     console.log("Commit_5_84_0 1", res);
//                                                                     window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'COURSE_COMPLETED' }));
//                                                                 }
//                                                             }
//                                                         }
//                                                     }
//                                                 })
//                                                     .catch((function (t) {
//                                                         console.log("FETCH: Could not commit server.", t),
//                                                             e.IsCommitting = !0
//                                                     }
//                                                     ));
//                                             else {
//                                                 var i = new XMLHttpRequest;
//                                                 i.open("POST", CommunicationUrl + "Commit", 1),
//                                                     i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
//                                                     i.setRequestHeader("Authorization", "Bearer " + token),
//                                                     i.setRequestHeader("Accept-Language", "en"),
//                                                     i.send(utils.parameterizeObject(t, this.useReducedData))
//                                                 i.onload = function () {
//                                                     if (i.readyState == 4 && i.status == 200) {
//                                                         var res = JSON.parse(i.response);
//                                                         const eventSendBack = {
//                                                             res: res,
//                                                             event: e
//                                                         }
//                                                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DATA_EVENT', data: eventSendBack }));
//                                                         if (res.statusCode == 200) {
//                                                             //  MarcDialogs.alert('Course completed Successfully!');
//                                                             if (res.data != null) {
//                                                                 if (res.data.isCourseCompleted == true) {
//                                                                     if (t.completion_status == 'completed' || t.completion_status == 'passed' || t.completion_status == 'failed') {
//                                                                         // alert("Course completed Successfully!");
//                                                                         console.log("Commit_5_84_0 2", res);
//                                                                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'COURSE_COMPLETED' }));
//                                                                     }
//                                                                 }
//                                                             }
//                                                         }
//                                                     }
//                                                 };
//                                             }
//                                         } catch (e) {
//                                             return console.log("Could not commit server.", e),
//                                                 this.IsCommitting = !0,
//                                                 "false"
//                                         }
//                                         this.IsCommitting = !1
//                                     }
//                                     return "true"
//                                 }
//                                 ,
//                                 Api.prototype.Commit_5_84_3 = function () {
//                                     var e = this;
//                                     if (!this.IsCommitting) {
//                                         this.IsCommitting = !0;
//                                         var t = this.PrepareCommitData();
//                                         if (t.attemptId = this.cmi.attemptId.Value,
//                                             t.assignedDate = this.cmi.assignedDate.Value,
//                                             this.isUnauthorized)
//                                             return this.IsCommitting = !1,
//                                                 "false";
//                                         try {
//                                             var i = new XMLHttpRequest;
//                                             i.open("POST", CommunicationUrl + "Commit", 1),
//                                                 i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
//                                                 null != token && "" !== token.trim() && i.setRequestHeader("Authorization", "Bearer " + token),
//                                                 i.setRequestHeader("Accept-Language", "en"),
//                                                 i.send(utils.parameterizeObject(t, this.useReducedData)),
//                                                 i.onload = function () {
//                                                     if (i.readyState == 4 && i.status == 200) {
//                                                         var res = JSON.parse(i.response);
//                                                         const eventSendBack = {
//                                                             res: res,
//                                                             event: t
//                                                         }
//                                                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GAMIFICATION_ADDED' }));
//                                                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DATA_EVENT', data: eventSendBack }));
//                                                         if (res.statusCode == 200) {
//                                                             // MarcDialogs.alert('Course completed Successfully!');
//                                                             if (res.data != null) {
//                                                                 if (res.data.isCourseCompleted == true) {
//                                                                     if (t.completion_status == 'completed' || t.completion_status == 'passed' || t.completion_status == 'failed') {
//                                                                         // alert("Course completed Successfully!");
//                                                                         console.log("Commit_5_84_3", res);
//                                                                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'COURSE_COMPLETED' }));
//                                                                     }
//                                                                 }
//                                                             }
//                                                         }
//                                                     }
//                                                 };
//                                             Math.floor(i.status) === HttpStatusCodes.UNAUTHORIZED && (this.isUnauthorized = !0,
//                                                 window.dispatchEvent(unauthorizedEvent)),
//                                                 Math.floor(i.status) === HttpStatusCodes.NOT_FOUND && (this.isUnauthorized = !0,
//                                                     window.dispatchEvent(notFoundEvent)),
//                                                 this.IsCommitting = !1
//                                         } catch (i) {
//                                             if (!window.fetch || "true" !== this.useFetchFallback)
//                                                 return console.log("Could not commit server.", i),
//                                                     this.IsCommitting = !1,
//                                                     "false";
//                                             console.log("Falling back to FETCH."),
//                                                 fetch(CommunicationUrl + "Commit", {
//                                                     method: "POST",
//                                                     body: utils.parameterizeObject(t, this.useReducedData),
//                                                     keepalive: !0,
//                                                     headers: {
//                                                         "Content-Type": "application/x-www-form-urlencoded",
//                                                         Authorization: "Bearer " + token,
//                                                         "Accept-Language": "en"
//                                                     }
//                                                 }).then((function () {
//                                                     e.IsCommitting = !1
//                                                 }
//                                                 )).catch((function (t) {
//                                                     console.log("FETCH: Could not commit server.", t),
//                                                         e.IsCommitting = !1
//                                                 }
//                                                 ))
//                                         }
//                                     }
//                                     return "true"
//                                 }
//                                 ,
//                                 Api.prototype.GetDiagnostic = function (e) {
//                                     return e ? Api.ErrorStrings[e] || "Uknown errCode." : this.GetLastError()
//                                 }
//                                 ,
//                                 Api.prototype.GetErrorString = function (e) {
//                                     return Api.ErrorStrings[e]
//                                 }
//                                 ,
//                                 Api.prototype.GetLastError = function () {
//                                     return this.error
//                                 }
//                                 ,
//                                 Api.prototype.GetCmiObjectByName = function (name) {
//                                     if (name = name.trim(),
//                                         0 === name.indexOf("cmi.") || 0 === name.indexOf("adl."))
//                                         try {
//                                             this.ReferenceIsArrayType(name) && (name = this.PopulateArrayElement(name));
//                                             var evaluatedObject = eval("this." + name);
//                                             if (utils.isFunction(evaluatedObject) && (evaluatedObject = eval("this." + name + "()")),
//                                                 void 0 === evaluatedObject)
//                                                 throw Error();
//                                             return evaluatedObject
//                                         } catch (e) {
//                                             return null
//                                         }
//                                     return null
//                                 }
//                                 ,
//                                 Api.prototype.ReferenceIsArrayType = function (e) {
//                                     return null !== e.match(/\.[0-9]+\./g) || null !== e.match(/\[[0-9]+\]\./g)
//                                 }
//                                 ,
//                                 Api.prototype.CreateNewArrayObject = function (e, t) {
//                                     if (void 0 === t && (t = null),
//                                         null === t && (t = void 0),
//                                         e.indexOf("interactions") >= 0)
//                                         return new Interaction(t);
//                                     if (e.indexOf("objectives") >= 0)
//                                         return new Objective(t);
//                                     if (e.indexOf("correct_responses") >= 0)
//                                         return new InteractionCorrectResponses(t);
//                                     throw new Error("Unknown array base type for name '" + e + "'")
//                                 }
//                                 ,
//                                 Api.prototype.CreateNewArrayObjectFlat = function (e, t) {
//                                     if (null === t && (t = void 0),
//                                         e.indexOf("correct_responses") >= 0)
//                                         return new InteractionCorrectResponses(t);
//                                     if (e.indexOf("objectives") >= 0)
//                                         return new Objective(t);
//                                     if (e.indexOf("interactions") >= 0)
//                                         return new Interaction(t);
//                                     throw new Error("Unknown array base type for name '" + e + "'")
//                                 }
//                                 ,
//                                 Api.prototype.PopulateArrayElement = function (name, referencePrefix) {
//                                     void 0 === referencePrefix && (referencePrefix = null);
//                                     var arrayMatches = name.match(/(.+?)\.([0-9]+)\.(.+)/);
//                                     null === arrayMatches && (arrayMatches = name.match(/(.+?)\[([0-9]+)\]\.(.+)/));
//                                     var arrayBase = arrayMatches[1] + ".Value", arrayIndex = parseInt(arrayMatches[2]), arrayProperty = arrayMatches[3], evaluatedArray;
//                                     return evaluatedArray = eval("this." + (referencePrefix || "") + arrayBase),
//                                         evaluatedArray[arrayIndex] || (evaluatedArray[arrayIndex] = this.CreateNewArrayObject(arrayBase)),
//                                         this.ReferenceIsArrayType(arrayProperty) && (arrayProperty = this.PopulateArrayElement(arrayProperty, arrayBase + "[" + arrayIndex + "].")),
//                                         arrayBase + "[" + arrayIndex + "]." + arrayProperty
//                                 }
//                                 ,
//                                 Api.prototype.PrepareCommitData = function (e, t, i) {
//                                     if (void 0 === e && (e = this.cmi),
//                                         void 0 === t && (t = null),
//                                         void 0 === i && (i = !1),
//                                         i || (i = {}),
//                                         e instanceof MutableList)
//                                         for (var n = 0; n < e.Value.length; n++)
//                                             void 0 !== e.Value[n] && null !== e.Value[n] && this.PrepareCommitData(e.Value[n], t + "[" + n + "]", i);
//                                     else if (e instanceof Mutable)
//                                         e instanceof ReadOnly || (i[t] = e.Value);
//                                     else if (utils.isObject(e))
//                                         for (var r in e)
//                                             if (e.hasOwnProperty(r)) {
//                                                 var a = t ? t + "." + r : r;
//                                                 this.PrepareCommitData(e[r], a, i)
//                                             }
//                                     return i
//                                 }
//                                 ,
//                                 Api.prototype.onActivity = function () {
//                                     window.dispatchEvent(activityEvent)
//                                 }
//                                 ,
//                                 Api.ErrorStrings = {
//                                     0: "No error",
//                                     101: "General Exception",
//                                     102: "General Initialization Failure",
//                                     103: "Already Initialized",
//                                     104: "Content Instance Terminated",
//                                     111: "General Termination Failure",
//                                     112: "Termination Before Initialization",
//                                     113: "Termination After Termination",
//                                     122: "Retrieve Data Before Initialization",
//                                     123: "Retrieve Data After Termination",
//                                     132: "Store Data Before Initialization",
//                                     133: "Store Data After Termination",
//                                     142: "Commit Before Initialization",
//                                     143: "Commit After Termination",
//                                     201: "General Argument Error",
//                                     301: "General Get Failure",
//                                     351: "General Set Failure",
//                                     391: "General Commit Failure",
//                                     401: "Undefined Data Model Element",
//                                     402: "Unimplemented Data Model Element",
//                                     403: "Data Model Element Value Not Initialized",
//                                     404: "Data Model Element Is Read Only",
//                                     405: "Data Model Element Is Write Only",
//                                     406: "Data Model Element Type Mismatch",
//                                     407: "Data Model Element Value Out Of Range",
//                                     408: "Data Model Dependency Not Established",
//                                     1e3: "General communication failure (Ajax)"
//                                 },
//                                 Api
//                         }();
//                     Scorm.Api = Api
//                 }(Scorm = LevelUpLMS.Scorm || (LevelUpLMS.Scorm = {}))
//             }(LevelUpLMS || (LevelUpLMS = {}));
//         var API_1484_11 = new LevelUpLMS.Scorm.Api
//             , API = API_1484_11;
//         window.API = API;
//         window.API_1484_11 = API;
//     }
// ]);
// `