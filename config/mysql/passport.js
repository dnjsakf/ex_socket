module.exports = function(app){
  var conn = require('./db')();
  var passport = require('passport');

  var pbkdf2Password = require('pbkdf2-password');
  var hasher = pbkdf2Password();

  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;

  // passport - default
  app.use(passport.initialize());
  app.use(passport.session());

  // done(null, user.id); // id: 식별자(기본키)
  // 처음 로그인 할 때, session에 저장
  passport.serializeUser(function(user, done){
    console.log('serializeUser :', user.username);
    return done(null, user.authId);
  });
  // 다시 접근하면 session에 저장된 id 값으로 탐색.
  passport.deserializeUser(function(authId, done){
    console.log('deserializeUser', authId);
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [authId], function(err, results){
      if(err){
        console.log(err);
        done('There is no user.2');
      } else {
        done(null, results[0]);
      }
    });
  });
  // 구체적인 Strategy 작성
  passport.use(new LocalStrategy(
    // done는 함수
    // done(err, 성공여부, {message; ' sdfsdf'})
    // done() => serializeUser()
    function(username, password, done){
      var uname = username;
      var pwd = password;
      var sql = 'SELECT * FROM users WHERE authId = ?';
      conn.query(sql, ['local:'+uname], function(err, results){
        if(err){
          console.log(err);
          return done('There is no user.');
        }
        var user = results[0];
        return hasher({password:pwd, salt:user.salt},
          function(err, pass, salt, hash){
            if(hash === user.password){
              console.log('LocalStrategy', user);
              return done(null, user); //성공 -> serializeUser(user, done);
            } else {
              return done(null, false);
            }
          }
        );
      });
    }
  ));
  passport.use(new FacebookStrategy({
      clientID: '1905196089750902',
      clientSecret: '4f7aad86aaf1244414aa6302a778bb6f',
      callbackURL: "/auth/facebook/callback",
      profileFields:['id','email','gender','link','locale','name','timezone','updated_time','verified','displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      var authId = 'facebook:'+profile.id;
      var sql = "SELECT * FROM users WHERE authId = ?";
      conn.query(sql, [authId], function(err, results){
        if(results.length>0){
          done(null, results[0]);
        } else {
          var newUser = {
            'authId':authId,
            'displayName':profile.displayName,
            'email':profile.emails[0].value
          };
          var sql = "INSERT INTO users SET ?";
          conn.query(sql, newUser, function(err, results){
            if(err){
              console.log(err);
              done('Error');
            } else {
              done(null, newUser);
            }
          });
        }
      });
    }
  ));

  return passport;
}
