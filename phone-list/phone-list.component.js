'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('phoneList').
  component('phoneList', {
    templateUrl: 'phone-list/phone-list.template.html',
    controller: function PhoneListController($http) {
      var self = this;
      self.orderProp = 'age';

      var promises = []
	  
	  promises.push($http.get('players/players.json').then(function(response) {
        self.players = response.data;
      }));
     
      promises.push($http.get('medals/medals.json').then(function(response) {
        self.medals = response.data;
      }));

      Promise.all(promises).then(values => {  
		// Fill in meta data
		self.players.forEach(player => {
			// search medals for each 
			fillPlayerMedalData(player, self.medals.medals);
			player.total = calculateTotal(player)
		})
		
		
      });
  }
});

function fillPlayerMedalData(player, medals) {
	player.teams.forEach(team => {
		var metaData = medals.find(medal => medal.name == team.name);
		
		if(metaData) {
			team.total = team.tier == "C" ? metaData.total * 5 : metaData.total;
			team.metaData = metaData;
		} else {
			var x = team;
		}
	})
}

function calculateTotal(player) {
	var total = 0;
	player.teams.forEach(team => total+=team.total)
	return total;
}


// 1: Name
// 2: total
// 3: 4 A teams
// 4: 3 B teams
// 5: 1 c team
  