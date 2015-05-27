var regexDataApp = angular.module('regexDataApp', ['ngRoute']); //, 'angularHighlightTextarea']);

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

regexDataApp.controller('mainCtrl', function($scope, $timeout) {
    $scope.colors = ['#FAD23C', '#B2CE3B', '#3BB2E2', '#1200D8', '#8B46BA', '#2B8638', '#E6582A'];

    var emptyTextObj = {
        id: 0,
        text: '',
        color: '',
        state: 1 // 1 = maximized, 0 = minimized
    };

    var defaultInput = angular.copy(emptyTextObj);
    defaultInput.id = 1;
    // defaultInput.color = '#'+Math.floor(Math.random()*16777215).toString(16);
    defaultInput.color = $scope.colors[0];

    var defaultOutput = angular.copy(emptyTextObj);
    defaultOutput.id = 2;
    defaultOutput.color = $scope.colors[1];

    $scope.textObjs = [];
    $scope.textObjs.push(defaultInput);
    $scope.textObjs.push(defaultOutput);

    $scope.addTextArea = function() {
        var newTextObj = angular.copy(emptyTextObj);
        var nextIndex = 0;

        for (var i = 0; i < $scope.textObjs.length; i++) {
            if ($scope.textObjs[i].id > nextIndex) {
                nextIndex = $scope.textObjs[i].id;
            }
        }

        newTextObj.id = nextIndex + 1;

        newTextObj.color = $scope.colors[newTextObj.id % $scope.colors.length];
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

    $scope.getMinMaxText = function(id) {
        var ta = $scope.getTextAreaById(id);
        if (ta.state === 1) {
            return 'minus';
        }
        if (ta.state === 0) {
            return 'plus';
        }
    }

    $scope.getMinMaxClass = function(id) {
        var ta = $scope.getTextAreaById(id);
        if (ta.state === 1) {
            return 'maximized';
        }
        if (ta.state === 0) {
            return 'minimized';
        }
    }

    $scope.getMinMaxStyle = function(id) {
        var ta = $scope.getTextAreaById(id);
        if (ta.state === 1) {
            return '';
        }
        if (ta.state === 0) {
            return 'background-color: ' + ta.color + '; color: white;';
        }
    }

    $scope.setMinMax = function(id) {
        var ta = $scope.getTextAreaById(id);
        if (ta.state === 1) {
            ta.state = 0;
        } else if (ta.state === 0) {
            ta.state = 1;
        }
    }

    ////
    $scope.filterTypes = ['Replace', 'Extract'];

    var emptyFilterObj = {
        id: 1,
        inputId: 1,
        ignoreCase: true,
        multiLine: true,
        type: $scope.filterTypes[0],
        filter: '',
        replaceWith: '',
        extractTemplate: '',
        outputId: 2

        ///TODO 'negative' regex
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

    $scope.getTAInputColorByFilterId = function(id) {
        for (var i = 0; i < $scope.filters.length; i++) {
            if ($scope.filters[i].id === id) {
                var tmpTA = $scope.getTextAreaById($scope.filters[i].inputId);
                if (tmpTA === null || tmpTA === undefined) {
                    return '#FFFFFF';
                }
                return tmpTA.color;
            }
        }
    }

    $scope.getTAOutputColorByFilterId = function(id) {
        for (var i = 0; i < $scope.filters.length; i++) {
            if ($scope.filters[i].id === id) {
                var tmpTA = $scope.getTextAreaById($scope.filters[i].outputId);
                if (tmpTA === null || tmpTA === undefined) {
                    return '#FFFFFF';
                }
                return tmpTA.color;
            }
        }
    }

    $scope.applyFilters = function() {
        $scope.filters.forEach(function(filter) {
            if (filter.type === 'Replace') {
                if (filter.filter.trim() === '') {
                    return;
                }

                var re = new RegExp(filter.filter, 'g' + (filter.ignoreCase ? 'i' : '') + (filter.multiLine ? 'm' : ''));
                var input = $scope.getTextAreaById(filter.inputId);
                var inputText = input.text;

                var result = inputText.match(re);
                var output = $scope.getTextAreaById(filter.outputId);
                var tmpOutputText = inputText;

                tmpOutputText = tmpOutputText.replace(re, filter.replaceWith)

                output.text = tmpOutputText;
            } else if (filter.type === 'Extract') {
                if (filter.filter.trim() === '') {
                    return;
                }

                var re = new RegExp(filter.filter, 'g' + (filter.ignoreCase ? 'i' : '') + (filter.multiLine ? 'm' : ''));
                var input = $scope.getTextAreaById(filter.inputId);
                var inputText = input.text;

                var output = $scope.getTextAreaById(filter.outputId);
                var tmpOutputText = '';
                var result;

                var newExtractTemplate = '\'' + filter.extractTemplate.replace(/\$([0-9]+)/gi, '\'+result[$1]+\'') + '\'';

                while ((result = re.exec(inputText)) !== null) {
                    tmpOutputText += eval(newExtractTemplate);
                }

                output.text = tmpOutputText;
            }
        });
    };
});
