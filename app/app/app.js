
var regexDataApp = angular.module('regexDataApp', ['ngRoute']);

regexDataApp.config(function($routeProvider) {
        $routeProvider
            .when(
                '/', {
                    templateUrl: 'app/templates/main.html',
                    controller: 'mainCtrl'
                }
            ).otherwise({
                redirectTo: '/'
            });
    }

);

regexDataApp.controller('mainCtrl', function($scope) {
    var emptyTextObj = {
        id: 0,
        text: ''
    };

    var defaultInput = angular.copy(emptyTextObj);
    defaultInput.id = 1;

    var defaultOutput = angular.copy(emptyTextObj);
    defaultOutput.id = 2;

    $scope.textObjs = [];
    $scope.textObjs.push(defaultInput);
    $scope.textObjs.push(defaultOutput);

    $scope.addTextArea = function() {
        var newTextObj = angular.copy(emptyTextObj);
        newTextObj.id = $scope.textObjs.reduce(
            function(p, v) {
                return (p.id > v.id ? p.id : v.id);
            }) + 1; //get max index and increment
        $scope.textObjs.push(newTextObj);
    }

    $scope.removeTextArea = function(id) {
        for (var i = 0; i < $scope.textObjs.length; i++) {
            if ($scope.textObjs[i].id === id) {
                $scope.textObjs.splice(i, 1);
                break;
            }
        }
    }

    ////
    $scope.filterTypes = ['Highlight', 'Replace', 'Extract'];

    var emptyFilterObj = {
        id : 1,
        inputId: 1,
        type: $scope.filterTypes[0],
        filter: '',
        highlightColor: '#fe0000',
        replaceWith: '',
        extractTemplate: '',
        outputId : 2

        ///TODO 'negative' regex
        // TODO replace each group
        // TODO add options: ignore case & multiline
        // TODO extract per line (preserve lines) / per text
    };

    var defaultFilter = angular.copy(emptyFilterObj);

    $scope.filters = [];
    $scope.filters.push(defaultFilter);

    $scope.addFilter = function() {
        var newFilterObj = angular.copy(emptyFilterObj);
        if ($scope.filters.length === 0) {
            newFilterObj.id = 1;
        } else {
            newFilterObj.id = $scope.filters.reduce(
                function(p, v) {
                    return (p.id > v.id ? p.id : v.id);
                }) + 1; //get max index and increment
        }
        $scope.filters.push(newFilterObj);
    }

    $scope.removeFilter = function(id) {
        for (var i = 0; i < $scope.filters.length; i++) {
            if ($scope.filters[i].id === id) {
                $scope.filters.splice(i, 1);
                break;
            }
        }
    }

    /////

    $scope.getTextAreaById = function(id) {
        for (var i = 0; i < $scope.textObjs.length; i++) {
            if ($scope.textObjs[i].id === parseInt(id)) {
                return $scope.textObjs[i];
            }
        }
    }

    $scope.applyFilters = function () {
        $scope.filters.forEach(function (filter) {
            if (filter.type === 'Highlight') {
                var re = new RegExp(filter.filter, 'gi');
                var input = $scope.getTextAreaById(filter.inputId);
                var inputText = input.text;

                var result = inputText.match(re);
                var output = $scope.getTextAreaById(filter.outputId);
                var tmpOutputText = inputText;

                tmpOutputText = tmpOutputText.replace(re, function(str) {return '<b>'+str+'</b>'})

                output.text = tmpOutputText;
            } else if (filter.type === 'Replace') {
                var re = new RegExp(filter.filter, 'gi');
                var input = $scope.getTextAreaById(filter.inputId);
                var inputText = input.text;

                var result = inputText.match(re);
                var output = $scope.getTextAreaById(filter.outputId);
                var tmpOutputText = inputText;

                tmpOutputText = tmpOutputText.replace(re, filter.replaceWith)

                output.text = tmpOutputText;
            } else if (filter.type === 'Extract') {
                var re = new RegExp(filter.filter, 'gi');
                var input = $scope.getTextAreaById(filter.inputId);
                var inputText = input.text;

                var output = $scope.getTextAreaById(filter.outputId);
                var tmpOutputText = '';
                var result;

                while ((result = re.exec(inputText)) !== null) {
                    tmpOutputText = tmpOutputText + ' ' + result;
                }

                output.text = tmpOutputText;
            }
        });
    };
});
