angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $http, ApiData) {

	// Everytime we enter the controller, reload the data
	$scope.$on('$ionicView.enter', function(e) {
		$scope.subjects = [];

		$http.get(ApiData.url+'/subjects/').then(function(res){
			$scope.subjects = res.data;
		});
	});
})

.controller('SubjectCtrl', function($scope, $http, ApiData, $state, $ionicPopup, $timeout) {

	var subId = $state.params.subId;

	// Everytime we enter the controller, reload the data
	$scope.$on('$ionicView.enter', function(e) {
		$scope.subject = {};
		$scope.students = [];
		
		$scope.subject = {};
		$http.get(ApiData.url+'/subjects/'+subId).then(function(res){
			$scope.subject = res.data;
			$scope.students = $scope.subject.students;
		});
		
		// Get all students (for the Enroll form)
		$scope.allstudents = [];
		$http.get(ApiData.url+'/students/').then(function(response){
			$scope.allstudents = response.data;
			
			if(typeof $scope.formStudent === 'undefined')
				$scope.formStudent = $scope.allstudents[0];
		});
	});
	
	// Enroll Student
	$scope.enrollStudent = function(){

		if(typeof $scope.formStudent === 'undefined')
		{
			$ionicPopup.alert({
				title: 'Error',
				template: 'Please select a student.',
			});
		}
		else
		{
			$http.post(ApiData.url+'/students/assign/'+$scope.formStudent._id+'/'+$scope.subject._id).then(function successCallback(response) {
				data = response.data;
				
				$scope.subject.students.push(data.student);
				
				$ionicPopup.alert({
					title: 'Success',
					template: data.message,
				});
				
				$state.go('tab.subject',{subId: subId});
				
			}, function errorCallback(response) {
				data = response.data;
				
				$ionicPopup.alert({
					title: 'Error',
					template: data.message,
				});
			});
		}
	};
	
	$scope.selectUpdated = function(newFormStudent) {
		$scope.formStudent = newFormStudent;
	};
})

.controller('StudentsCtrl', function($scope, $http, ApiData, $ionicPopup, $timeout) {
	
	// Everytime we enter the controller, reload the data
	$scope.$on('$ionicView.enter', function(e) {
		$scope.students = [];

		$http.get(ApiData.url+'/students/').then(function(res){
			$scope.students = res.data;
			
			for(var i=0;i<$scope.students.length;i++)
			{
				$scope.students[i].mobile = '';
				$scope.students[i].home = '';
				if($scope.students[i].phones[0] !== null)
				{
					$scope.students[i].mobile = $scope.students[i].phones[Object.keys($scope.students[i].phones)[0]].mobile;
				}
				
				if($scope.students[i].phones[1] !== null)
				{
					$scope.students[i].home = $scope.students[i].phones[Object.keys($scope.students[i].phones)[1]].home;
				}
			}
		});
		
		$scope.student = {};
	});
})

.controller('AddStudentCtrl', function($scope, $http, ApiData, $ionicPopup, $timeout, $state) {
	
	$scope.student = {};
	
	$scope.addStudent = function(){
		
		// Process phone numbers into an array
		$scope.student.phones = [{ 'mobile' : $scope.student.mobileNumber}, {'home' : $scope.student.homeNumber }];
		
		$http.post(ApiData.url+'/students/', $scope.student).then(function successCallback(response) {
			data = response.data;

			$ionicPopup.alert({
				title: 'Success',
				template: data.message,
			});
			
			$state.go('tab.students');
				
		}, function errorCallback(response) {
			data = response.data;
			
			$ionicPopup.alert({
				title: 'Error',
				template: data.message,
			});
		});
	};
})

.controller('ProfileCtrl', function($scope, $http, ApiData, $state, $ionicPopup, $timeout) {

	var studentId = $state.params.studentId;
	
	// Get student data
	$http.get(ApiData.url+'/students/'+studentId).then(function(response){
		data = response.data;
		
		data.mobile = '';
		data.home = '';
		if(data.phones[0] !== null)
		{
			data.mobile = data.phones[Object.keys(data.phones)[0]].mobile;
		}
		
		if(data.phones[1] !== null)
		{
			data.home = data.phones[Object.keys(data.phones)[1]].home;
		}
		
		$scope.profile = data;
	});
});