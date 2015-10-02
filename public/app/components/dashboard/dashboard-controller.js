(function () {
    'use strict';

    angular
        .module('meanChat.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'ChatFactory', 'UserAuthFactory', '$state', 'mySocket', 'MainFactory'];

    /* @ngInject */
    function DashboardController(DashboardFactory, ChatFactory, UserAuthFactory, $state, mySocket, MainFactory) {
        // console.log('DashboardController loaded');

        var _this = this;
        _this.MF = MainFactory;
        _this.displayForm = false;

        /**
         * Creates a new chat room. Handler for form submission
         *
         * Socket event: Notifies server room was created
         */
        this.createRoom = function(formData) {
            var roomInfo = {
                name: formData.name,
                topic: formData.topic,
                _owner: UserAuthFactory.getUser()._id
            }

            var newRoom = new ChatFactory(roomInfo);

            newRoom.$save()
                .then( function(response) { 
                    console.log(response);
                    mySocket.emit('room/new', { _room: response.content._id }); 
                    _this.userInfo.created_rooms.unshift(response.content);
                    _clearNewRoomForm();
                })
                .catch( function(err) { 
                    console.log('DashboardController:createRoom(error) - ', err); 
                });
        }

        _this.showRoomForm = function() {
            _this.displayForm = true;
        }

        _this.hideRoomForm = function() {
            _this.displayForm = false;
        }

        /**
         * Clears New Room Form upon submission
         */
        function _clearNewRoomForm() {
            _this.newRoomForm.$setPristine();
            _this.newRoomForm.$setUntouched();
            _this.newRoomForm.formData = '';
        }

        /**
         * Retrieves current user's info to populate dashboard
         */
        var _getUserInfo = function() {
            DashboardFactory.fetchUserInfo( function(response) {
                if(response.state == 'success') {
                    // console.log('DashboardController:getUserInfo(success)- ', response.user);
                    _this.userInfo = response.user;

                    console.log(response.user.favorite_rooms);
                    console.log(response.user.active_rooms);


                     var _isRoomInList = function(room) {
                        return function(el) { return el._id === room._id; }
                    };

                    var addFavoriteProp = function(roomObj) {
                        if( _this.userInfo.favorite_rooms.some(_isRoomInList(roomObj._id))) {
                            roomObj.favorite = true;
                        } else {
                            roomObj.favorite = false;
                        }
                    }
                    
                    _this.userInfo.active_rooms.map(addFavoriteProp);
                    
                    response.user.active_rooms.forEach( function(active_room) {
                        if( ! _this.MF.active_rooms.some(_isRoomInList(active_room)) ) {
                            _this.MF.active_rooms.push(active_room);
                        }
                    });
                }
            })
        }

        this.favoriteToggle = function(room) {
            console.log(room._id);
            mySocket.emit('room/favorite', {_room: room._id});

            room.favorite = !room.favorite;
        }

        mySocket.on('room/created', function(data) {
            _this.roomsList.push(data);
        });

        var _getChatRoomsList = function() {
            ChatFactory.get().$promise.then(function(response) {
                _this.roomsList = response.content;
            })
            .catch( function(err) {
                console.log('DashboardController:_getChatRoomsList(error) -  ', err);
            });
        }
        
        var _init = (function() {
            _getChatRoomsList();
            _getUserInfo();
            ChatFactory.setOpenRoomId(null);
        })();
    }
})();