import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('adapter:tumblr', 'TumblrAdapter', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

// Replace this with your real tests.
test('it exists', function() {
    var adapter = this.subject();
    ok(adapter);
});


test('pathForType should do something special for post types', function() {
    var adapter = this.subject();
    var postTypes = adapter.get("postTypes");
    expect(postTypes.length);
    for (var i=0; i< postTypes.length; i++){
        var type  = postTypes[i];
        var path = adapter.pathForType(type);
        equal("/posts/" + type, path);
    }
});

test('pathForType should work for blog info', function() {
    var methods = ["info",
                   "avatar",
                   "followers",
                   "posts",
                   "likes",
                   ];
    var adapter = this.subject();
    expect(methods.length);
    for (var i=0; i< methods.length; i++){
        var type  = methods[i];
        var path = adapter.pathForType(type);
        equal("/" + type, path);
    }
});
