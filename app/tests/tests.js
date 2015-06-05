

describe('misc tests', function(){

    var mainCtrl, $scope;

    beforeEach(module('regexDataApp'));

    beforeEach(inject(function ($controller, $rootScope) {
        $scope = $rootScope.$new();
        $controller('mainCtrl', {
            $scope: $scope
        });
    }));

    describe('text area tests', function () {
        it('should be 2 text areas', function () {
            expect($scope.textObjs.length).toEqual(2);
        });

        it('should add one text area', function () {
            $scope.addTextArea();
            expect($scope.textObjs.length).toEqual(3);
        });

        it('should remove one text area', function () {
            $scope.removeTextArea();
            expect($scope.textObjs.length).toEqual(2);
        });
    });

    describe('filter tests', function () {
        it('should be 1 filter', function () {
            expect($scope.filters.length).toEqual(1);
        });

        it('should add one filter', function () {
            $scope.addFilter();
            expect($scope.filters.length).toEqual(2);
        });

        it('should remove one text area', function () {
            $scope.removeFilter();
            expect($scope.filters.length).toEqual(1);
        });
    });

    describe('apply replace filters', function () {

        it('the output text should be replaced', function () {
            $scope.textObjs[0].text =

            'Sample text for testing:\n' +
            'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ\n' +
            '0123456789 +-.,!@#$%^&*();\/|<>"\'\n' +
            '12345 -98.7 3.141 .6180 9,000 +42\n' +
            '555.123.4567 +1-(800)-555-2468\n' +
            'foo@demo.net bar.ba@test.co.uk\n' +
            'www.demo.com http://foo.co.uk/\n' +
            'http://regexr.com/foo.html?q=bar';

            $scope.textObjs[1].text = '';

            $scope.filters[0].filter = '[A-ZA-z][A-Za-z\.\-_]*@[A-ZA-z][A-Za-z0-9\.\-\_]*';
            $scope.filters[0].replaceWith = 'e-mail';
            $scope.filters[0].type = $scope.filterTypes[0];

            $scope.applyFilters();

            expect($scope.textObjs[1].text).toEqual('Sample text for testing:\n' +
            'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ\n' +
            '0123456789 +-.,!@#$%^&*();\/|<>"\'\n' +
            '12345 -98.7 3.141 .6180 9,000 +42\n' +
            '555.123.4567 +1-(800)-555-2468\n' +
            'e-mail e-mail\n' +
            'www.demo.com http://foo.co.uk/\n' +
            'http://regexr.com/foo.html?q=bar');
        });

        it('replace text ignore case', function () {
            $scope.textObjs[0].text = 'LoRem ipsum';
            $scope.textObjs[1].text = '';

            $scope.filters[0].filter = 're';
            $scope.filters[0].replaceWith = 'ww';
            $scope.filters[0].type = $scope.filterTypes[0];

            $scope.applyFilters();

            expect($scope.textObjs[1].text).toEqual('Lowwm ipsum');
        });

        it('replace text case sensitive', function () {
            $scope.textObjs[0].text = 'LoRem ipsum';
            $scope.textObjs[1].text = '';

            $scope.filters[0].filter = 're';
            $scope.filters[0].replaceWith = 'ww';
            $scope.filters[0].ignoreCase = false;
            $scope.filters[0].type = $scope.filterTypes[0];

            $scope.applyFilters();

            expect($scope.textObjs[1].text).toEqual('LoRem ipsum');
        });
    });

    describe('apply extract filters', function () {

        it('the output text should be replaced', function () {
            $scope.textObjs[0].text =

            'Sample text for testing:\n' +
            'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ\n' +
            '0123456789 +-.,!@#$%^&*();\/|<>"\'\n' +
            '12345 -98.7 3.141 .6180 9,000 +42\n' +
            '555.123.4567 +1-(800)-555-2468\n' +
            'foo@demo.net bar.ba@test.co.uk\n' +
            'www.demo.com http://foo.co.uk/\n' +
            'http://regexr.com/foo.html?q=bar';

            $scope.textObjs[1].text = '';

            $scope.filters[0].filter = '(http://|www\.)[A-Za-z0-9][A-Za-z0-9\.\-_/?=%]*';
            $scope.filters[0].extractTemplate = '$0\\n';
            $scope.filters[0].type = $scope.filterTypes[1];

            $scope.applyFilters();

            expect($scope.textObjs[1].text).toEqual('www.demo.com\n' +
            'http://foo.co.uk/\n' +
            'http://regexr.com/foo.html?q=bar\n');
        });

        // it('replace text', function () {
        //     $scope.textObjs[0].text = 'LoRem ipsum';
        //     $scope.textObjs[1].text = '';
        //
        //     $scope.filters[0].filter = 're';
        //     $scope.filters[0].replaceWith = 'ww';
        //     $scope.filters[0].type = $scope.filterTypes[0];
        //
        //     $scope.applyFilters();
        //
        //     expect($scope.textObjs[1].text).toEqual('Lowwm ipsum');
        // });
    });


});
