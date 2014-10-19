import DS from 'ember-data';

export default DS.Adapter.extend({
    defaultSerializer: "DS/djangoREST",
    baseUrl: "api.tumblr.com/v2",
    baseHostName: "benbeecher.tumblr.com",
    postTypes: ["text", "photo", "quote", "link", "chat", "audio",
                "video", "answer", "queue", "draft", "submissions", "edit",
                "reblog", "delete"],
    pathForType: function(type){
        var postTypes = this.get("postTypes");
        if ( postTypes.indexOf(type) > -1){
            return "/posts/" + type
        } else {
            return "/" + type
        }
    },
    buildURL: function(type, id, record) {
        var url = [],
            host = get(this, 'baseUrl'),
            blog = "blog",
            baseHostName = get(this, "baseHostName")

        url.push(host)
        url.push(blog)
        url.push(baseHostName)

        if (type) { url.push(this.pathForType(type)); }

        // //We might get passed in an array of ids from findMany
        // //in which case we don't want to modify the url, as the
        // //ids will be passed in through a query param
        // if (id && !Ember.isArray(id)) { url.push(encodeURIComponent(id)); }


        url = url.join('/');
        if (!host && url) { url = '/' + url; }

        return url;
    },

    ajaxSuccess: function(jqXHR, jsonPayload) {
        return jsonPayload;
    },



    ajaxOptions: function(url, type, options) {
        var hash = options || {};
        hash.url = url;
        hash.type = type;
        hash.dataType = 'jsonp';
        hash.context = this;

        if (hash.data && type !== 'GET') {
            hash.contentType = 'application/json; charset=utf-8';
            hash.data = JSON.stringify(hash.data);
        }

        var headers = get(this, 'headers');
        if (headers !== undefined) {
            hash.beforeSend = function (xhr) {
                forEach.call(Ember.keys(headers), function(key) {
                    xhr.setRequestHeader(key, headers[key]);
                });
            };
        }

        return hash;
    },
    ajax: function(){
        adapter = this
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var hash = adapter.ajaxOptions(url, type, options);
            hash.success = function(json, textStatus, jqXHR) {
                json = adapter.ajaxSuccess(jqXHR, json);
                if (json instanceof InvalidError) {
                    Ember.run(null, reject, json);
                } else {
                    Ember.run(null, resolve, json);
                }
            };
            hash.error = function(jqXHR, textStatus, errorThrown) {
                Ember.run(null, reject, adapter.ajaxError(jqXHR, jqXHR.responseText));
            };
            Ember.$.ajax(hash);
        })
    }}
);


// find()
// createRecord()
// updateRecord()
// deleteRecord()
// findAll()
// findQuery()
// To improve the network performance of your application, you can optimize your adapter by overriding these lower-level methods:

// findMany()



  //   return new

  //     hash.error = function(jqXHR, textStatus, errorThrown) {
  //       Ember.run(null, reject, adapter.ajaxError(jqXHR, jqXHR.responseText));
  //     };

  //     Ember.$.ajax(hash);
  //   }, "DS: RESTAdapter#ajax " + type + " to " + url);
  // },
