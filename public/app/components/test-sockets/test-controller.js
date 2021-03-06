(function() {
    'use strict';

    angular
        .module('meanChat.test')
        .controller('TestController', TestController);

    TestController.$inject = ['DashboardFactory', 'mySocket'];

    function TestController(DashboardFactory, mySocket) {

        this.sendMessage = function() {
            /**
            * Sends a message to the server, as long as it's a good message
            * the server will emit to room_<<roomid>> with the message object to 
            * be displayed to all users active
            */
            mySocket.emit('message/new', {
                _room: '560dbb72f57da9e450191842',
                message: 'I said something.',
                resource_type: 'Text'
            });
        }   

        this.leaveRoom = function() {
            /**
            * Should emit when a user leaves a room for good
            */
            mySocket.emit('room/user/exit', {
                _room: '560dbb72f57da9e450191842'
            });
        }

        this.joinRoom = function() {
            /**
            * Should emit when a user joins a new room  that isn't in his active rooms
            */
            mySocket.emit('room/user/join', {
                _room: '560dbb72f57da9e450191842'
            });
        }

        this.voteUp = function() {
            /**
            * Should Emit when a user clicks to upvote a message
            */
            mySocket.emit('msg_vote', {
                _room: '560dbb72f57da9e450191842',
                _message: '560c334f6fc86bbc2f2e4368',
                vote: 'up'
            });
        }

        this.voteDown = function() {
            /**
            * Should emit when a user clicks to downvote a message
            */
            mySocket.emit('msg_vote', {
                _room: '560dbb72f57da9e450191842',
                _message: '560c334f6fc86bbc2f2e4368',
                vote: 'down'
            });
        }

        this.favoriteRoom = function() {
            /**
            * Mark or unmark a room as a favorite.
            * This emitter will toggle whether the room is a favorite or not
            * and an updated user object will be emitted to user_update
            */
            mySocket.emit('favorite_room', {
                _room: '560dbb72f57da9e450191842'
            });
        }

        this.getRoom = function() {
            /**
            * get_room fires a request for updated room data
            * listen at mySocket.on(room_update_<<roomid>>)
            *
            * Even if emitted, it will only fire back from the server if
            * the user is active in the room
            */
            mySocket.emit('get_room', {
                _room: '560dbb72f57da9e450191842'
            });
        }

        this.getUser = function() {
            /**
            * get_user fires a request to update the logged in
            * users information and sends the updated user object
            * back to mySocket.on('user_update')
            * Most actions will automatically fire to this socket to update
            * the user, but this will also be available for special cases.
            *
            * Note that you don't need to pass a user ID. We will only be sending
            * back the logged in user information.
            */
            mySocket.emit('get_user');
        }

        this.roomCreated = function() {
            /**
            * When a new room is successfully created, emit the roomId
            * to the server so the server can update everyone's room list
            *
            * The server will emit back to new_room if it finds the new room object
            */
            mySocket.emit('room_created', {
                _room: '560dbb72f57da9e450191842'
            });
        }

        this.getProfile = function() {
            mySocket.emit('get_profile', {
                _user: '560b28f4d1d914a81a85c92d'
            });
        }

        this.toggleBlock = function() {
            mySocket.emit('block_user', {
                _user: '560b28f4d1d914a81a85c92d',
                _room: '560dbb72f57da9e450191842'
            })
        }
        /**
        * Dynamic listeners for room messages
        */
        mySocket.on('room/560dbb72f57da9e450191842/message', function(message) {
            console.log('room_<<some id>> message received');
            console.log('---------------------------------');
            console.log(message);
        });

        /**
        * Dynamic listener for room upadtes
        */
        mySocket.on('room_update_560dbb72f57da9e450191842', function(room) {
            console.log('room_update_<<some id>> update received');
            console.log('---------------------------------------');
            console.log(room);
        });

        /**
        * Dynamic listener for user updates for this user
        */
        mySocket.on('user_update', function(user) {
            console.log('user_update has received new user data');
            console.log('---------------------------------------');
            console.log(user);
        });

        /**
        * Response to successfully joining a room
        */
        mySocket.on('room/auth/success', function(room) {
            console.log('You have successfully joined room: ', room);
        });

        /**
        * Recieves a new room object when a new room is created
        */
        mySocket.on('new_room', function(room) {
            console.log('A new room has been created');
            console.log('---------------------------');
            console.log(room);
        });

        /**
        * Recieves a user profile object
        */
        mySocket.on('user_profile', function(user) {
            console.log('User profile received');
            console.log('---------------------');
            console.log(user);
        });


        mySocket.on('room/83942834uodas/get', function() {
            console.log('i saw this');
        })

    }

})();
