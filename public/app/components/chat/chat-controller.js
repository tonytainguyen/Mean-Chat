(function() {
    'use strict';

  angular
    .module('meanChat.chat')
    .controller('ChatController', ChatController);

    ChatController.$inject = ['ChatFactory', 'mySocket', 'MessageFactory', 'UserAuthFactory', '$state', '$q'];


    /* @ngInject */
    function ChatController(ChatFactory, mySocket, MessageFactory, UserAuthFactory, $state, $q) {
        console.log('ChatController loaded');

        var _this = this;
        _this.chatQuestions = [];
        /**
         * When user submits message, emit to server
         */
        this.sendMessage = function(message) {
            console.log('Emitting message from room ', ChatFactory.getOpenRoomId() );
            mySocket.emit('message/new', {
                _room: ChatFactory.getOpenRoomId(),
                message: message,
                resource_type: 'Text'
            });
            _clearMessage();
        }

        //Adds a question to our dummy data for questions
        this.addToQuestions = function(message) {
            for (var key in this.chatQuestions) {
                if (message._id === _this.chatQuestions[key]._id) {
                    console.log('Message already exists in questions');
                    return;
                }
            }
            mySocket.emit('message/resource', {_message: message._id});
            _this.chatQuestions.push(message);
        }

        //Removes a question if the delete is clicked
        this.removeQuestion = function(message, index) {
            mySocket.emit('message/resource', {_message: message._id});
            _this.chatQuestions.splice(index, 1);
        }

        //Shows the class bubble if the message if of response type 'Text'
        this.showBubble = function(message) {
            if (message == 'Text') {
                return 'bubble me';
            } else {
                return false;
            }
        }

        /**
         * Initialize socket listners for active room
         */
        var _initializeListeners = function() {
            var listenerBase = 'room/' + ChatFactory.getOpenRoomId();
            console.log('Initialized Chat Socket listeners. Base: ', listenerBase);
            
            // listens for messages & updates
            mySocket.on(listenerBase + '/message', function(data) {
                console.log('Socket: /message', data);;
                _this.messages.push(data);
            });

            // listens for user joins & updates
            mySocket.on(listenerBase + '/user/joined', function(userData) {
                console.log('Socket: user/joined', userData);
                _this._usersList.push(userData);
            });

            // listens for user exit & removes from list
            mySocket.on(listenerBase + '/user/exited', function(userData) {

            });
        }


        /**
         * Clears message form upon submit
         */
        var _clearMessage = function() {
            _this.messageForm.$setPristine();
            _this.userMessage = '';
        }


        var _init = (function() {
            // console.log('CHAT init ', ChatFactory.getOpenRoomId());
            // _this.sidebarTitle = $state.current.data.sidebarTitle;
            // Promises
            var getRoomInfo = ChatFactory.get({ _id: ChatFactory.getOpenRoomId() }).$promise;
            var getMessages = MessageFactory.query({ _room: ChatFactory.getOpenRoomId() }).$promise;
            var getChatRoomsList = ChatFactory.get().$promise;
            var getResources = UserAuthFactory.getResources({ _id: UserAuthFactory.getUser()._id, room: ChatFactory.getOpenRoomId() }).$promise;
            
            $q.all([getRoomInfo, getMessages, getChatRoomsList, getResources])
                .then(function(response) {
                    // Room Info
                    _this._usersList = response[0].content._users;
                    _this._roomInfo = response[0].content;
                    // console.log('Users List: ', _this._usersList);
                    // Messages
                    _this.messages = response[1].content;
                    // console.log('Messages: ', response[1].content);
                    // Roomslist
                    _this.roomsList = response[2].content;
                    // console.log('Roomslist: ', response[2].content);
                    _this.chatQuestions = response[3].content;
                    _initializeListeners();
                    console.log('ChatQuestions in promiseland: ', _this.chatQuestions);
                    console.log(_this.messages);

                    // notify server user has joined the room
                    mySocket.emit('room/user/join', { _room: ChatFactory.getOpenRoomId() })
                })
                .catch(function(err) {
                    console.log('Chat room initialization failed: ', err);
                    $state.go('dashboard');
                });
        })();
    }





})();
