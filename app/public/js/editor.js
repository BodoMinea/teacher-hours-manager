var socket = io(), // server communication
    scope;
	
socket.on('start', function (data) { // initial 
	scope = angular.element($("#identify")).scope(); // get scope
    var array = data;
    scope.$apply(function() {
    	scope.xdata = array;
    }); 
  document.getElementById('title').innerHTML = array[0]['title']; // nav and page title
  document.getElementById('pagetitle').innerHTML = array[0]['title'];
}); 

function save(){ // save 
    socket.emit('save',JSON.stringify(scope.xdata));
    var currentdate = new Date(); 
    document.getElementById('saved').innerHTML = "Last saved: " + currentdate.getDate() + "/" // log last saved
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
}

$('body').change(function() { // save on input action
    save();
}).click(function() {
    save();
});

setInterval(function(){save()},5000); // periodic save

var nApp = angular.module('editor', ["xeditable", "ui.bootstrap"]); // angular module and dependencies
		
        nApp.controller('EditArea', ['$scope', function ($scope) { // angular controller

        	$scope.addclass = function(id){
        		var blankobj = {"id":"","count":0}; // set default details
        		$scope.xdata[id]['classes'].push(blankobj); // insert for specified teacher
        	}

            $scope.addsubject = function(){
                $scope.xdata[0]['subjects'].push(document.getElementById('subj').value); // get name value from input and insert
                document.getElementById('subj').value = ''; // reset input box
            }

        	$scope.removeclass = function(teacher,xclass){ // delete class and its hours from teachers
        		$scope.xdata[teacher]['classes'].splice(xclass, 1);
        	}

            $scope.removesubject = function(subj){ // remove subject reference (and nothing else)
                $scope.xdata[0]['subjects'].splice(subj, 1);
            }

        	$scope.addteacher = function(id){ // add teacher element and a blank class
        		var blankobj = {"id":"","count":0};
        		$scope.xdata.push({
                    "name" : "",
                    "room" : "",
                    "classes" : [ {"count":0} ]
                    });
        	}

        	$scope.removeteacher = function(teacher){ // remove teacher and all referenced classes
        		$scope.xdata.splice(teacher, 1);
        	}

          $scope.move = function(otindex, oclassindex, ntindex){ // move class element to another teacher
            $scope.xdata[ntindex]['classes'].push($scope.xdata[otindex]['classes'][oclassindex]);
            $scope.xdata[otindex]['classes'].splice(oclassindex, 1);
          }

        	$scope.getCount = function(id){ // count total class hours
    			var total = 0;
    			for(var i = 0; i < $scope.xdata[id]['classes'].length; i++){
        			var amount = $scope.xdata[id]['classes'][i];
        			total += amount.count;
    			}
    		return total;
			   }

          $scope.getPrep = function(id){ // count class hours marked as suplimentary preparation
              var total = 0;
              for(var i = 0; i < $scope.xdata[id]['classes'].length; i++){
                var amount = $scope.xdata[id]['classes'][i];
                if (amount.prep){total += amount.count}
            }
            return total;
          }

}]);

nApp.run(function(editableOptions) { // on click edit theme
  editableOptions.theme = 'bs3';
});
