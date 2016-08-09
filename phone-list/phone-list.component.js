'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('phoneList').
  component('phoneList', {
    templateUrl: 'phone-list/phone-list.template.html',
    controller: function PhoneListController($scope, $q, $http) {
      var self = this;
	  self.lastUpdated = "loading..";
      //self.orderProp = 'total';

      var promises = []
	  
	  promises.push($http.get('players/players.json').then(function(response) {
        self.players = response.data; //self.players = response.data;
		return self.players
      }));
     
      promises.push($http.get('medals/medals.json').then(function(response) {
        return response.data; //self.medals = response.data;
      }));

      Promise.all(promises).then(values => {  
		var players = values[0];
		var medals = values[1];
		
		var date = new Date(medals.lastUpdated);
		self.lastUpdated = date.toLocaleTimeString();
		
		// Fill in meta data
		players.forEach(player => {
			// search medals for each 
			fillPlayerMedalData(player, medals.medals);
			player.total = calculateTotal(player)
		})
		
		self.players = createViewModel(players).sort((a,b) => a.total < b.total);
		$scope.$apply();
      });
  }
});

function fillPlayerMedalData(player, medals) {
	player.teams.forEach(team => {
		var metaData = medals.find(medal => medal.name == team.name);
		
		if(metaData) {
			team.total = metaData.total;
			team.metaData = metaData;
		}
	})
}

function calculateTotal(player) {
	var total = 0;
	player.teams.forEach(team => total+= team.tier == "C" ? team.total * 5 : team.total)
	return total;
}

// playerVm
// Name
// image
// total
// Tier A
// Tier B
// Tier C

// Tier 
// Name
// Medals

function createViewModel(players){
	var a = [];
	
	players.forEach(player => {
		var x = {
			name: player.name,
			total: player.total,
			tierA: filterTiers("A", player.teams),
			tierB: filterTiers("B", player.teams),
			tierC: filterTiers("C", player.teams)
		}
		
		a.push(x)
	})
	
	return a;
}

function filterTiers(tier, teams) {
	return teams.filter(team => team.tier == tier)
}


// 1: Name
// 2: total
// 3: 4 A teams
// 4: 3 B teams
// 5: 1 c team
  