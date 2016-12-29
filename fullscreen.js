'use strict';

// Declare app level module which depends on views, and components
var thisApp = angular.module('thisApp', []);

thisApp.directive('fullscreenBlock', ['$compile', function ($compile) {


    var jqLite = angular.element;


    var link = function (scope, element, attrs) {
        // Compiles DEFAULT icon button for opening the fullscreen mode.
        // fullscreenButton can be overridden by passing html code as a value of `fullscreen-block` attribute.
        var jayanth='<div class="modal-header"style="padding: 15px 20px 30px 20px;">' +
            '<div class="pull-left">' +
            '<div style="font-size:1.6rem"><strong>Question</strong></div>'+
            '</div>'

        var fullscreenButton = function () {
            return jqLite($compile(jayanth)(scope));
        };

        element.prepend((attrs.fullscreenBlock.length > 0) ? attrs.fullscreenBlock : fullscreenButton());
    };

    // Function helps to find the first parent element
    // which contains 'fullscreen-block' attribute.
    // This function can be replaced with JQuery's `closest()` method
    // if JQuery library is in use.
    var closest = function (element) {
        return (jqLite(element).parent().attr('fullscreen-block') !== undefined) ?
            jqLite(element).parent() :
            closest(jqLite(element).parent());
    };

    var controller = function ($scope) {
        // Handles click event
        $scope.fullscreenMode = function (event) {
            var modalWrapper = '<modal-wrapper></modal-wrapper>';
            jqLite(closest(event.target)).wrap(modalWrapper);
            $compile(modalWrapper)($scope);
        };
    };

    return {
        link: link,
        controller: ['$scope', '$timeout', controller]
    }
}]);

thisApp.directive('modalWrapper',["$compile", "$document", function ($compile, $document) {

    var jqLite = angular.element;

    /*
     Modal window template
     */
    var template =
        '<div id="modal-fullscreen" class="my-modal modal-fullscreen" style="background: white;width:50vw;max-height:80vh;border: 2px solid #1b93f3;">' +
        '<div class="modal-header"style="padding: 15px 20px 30px 20px;">' +
            '<div class="pull-left">' +
            '<div style="font-size:1.6rem"><strong>Question</strong></div>'+
        '</div>'+
            '<div class="pull-right">'+
        '<button type="button" class="close" ng-click="close()">&times;</button>' +
        '</div>' +
            '</div>'+
        '<div class="modal-body row" style="margin: 15px; display: flex;"></div>' +
        '</div>';

    var chart;

    /*
     Directive's link function
     */
    var link = function (scope, element) {

        scope.open();

        // Watches whether modal should be opened
        scope.$watch('showModal', function (newVal) {
            var modalEl = jqLite('modal-wrapper');
            var fullscreenIcon = modalEl.find('[name="fullscreen"]');
            // Modal being opened
            if (newVal) {
                // Hide fullscreen icon in modal
                fullscreenIcon.addClass("ng-hide");
                modalEl[0].parentNode.insertBefore(element[0], modalEl[0]);
                var content = modalEl.children();
                element.find(".modal-body").append(content);
                // Remove <modal-wrapper> tag
                modalEl.remove();
                // Make modal visible
                jqLite('#modal-fullscreen').show();
                // changing element's width
                content.addClass('expand');
                // initializing chart variable.
                // Following line is suitable just for this concrete case.

                // Modal being closed
            } else if (!newVal) {
                // Show fullscreen icon after modal's closed
                fullscreenIcon.removeClass("ng-hide");
                var modalBody = modalEl.find(".modal-body").children();
                modalEl[0].parentNode.insertBefore(modalBody[0], modalEl[0]);
                // Remove modal
                modalEl.remove();
                // changing element's width
                modalBody.removeClass('expand');
            }
            // Triggers chart's resizing.
            // Following line is suitable just for this concrete case.
        })
    };

    /*
     Directive's controller function
     */
    var controller = function ($scope) {

        $scope.open = function () {
            $scope.showModal = true;
        };

        $scope.close = function () {
            $scope.showModal = false;
        };

        // Close modal when back button's clicked
        $scope.$on('$locationChangeStart', function(event) {
            if ($scope.showModal) {
                event.preventDefault();
                $scope.close();
            }
        });

    };

    return {
        restrict: 'E',
        scope: {},
        template: template,
        link: link,
        controller: controller
    }

}]);
thisApp.
    directive('draggable', ['$document' , function($document) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                var startX, startY, initialMouseX, initialMouseY;
                elm.css({position: 'absolute'});

                elm.bind('mousedown', function($event) {
                    startX = elm.prop('offsetLeft');
                    startY = elm.prop('offsetTop');
                    initialMouseX = $event.clientX;
                    initialMouseY = $event.clientY;
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                    return false;
                });

                function mousemove($event) {
                    var dx = $event.clientX - initialMouseX;
                    var dy = $event.clientY - initialMouseY;
                    elm.css({
                        top:  startY + dy + 'px',
                        left: startX + dx + 'px'
                    });
                    return false;
                }

                function mouseup() {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    }]);
thisApp.directive('formator',['$compile', function ($compile) {
    return {
        restrict: "E",
        scope: {
            question: "="
        },
        link: function (scope, ele, attr, ctrl) {
            scope.$watch('question', function (newValue, oldValue) {
                if(newValue){
                    var myText = newValue;
                    console.log(myText);
                    var nextText = myText.replace(/<br\s*[\/]?>/gi, "\n");
                    console.log(nextText);
                    var newText = nextText.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "");
                    console.log(newText);
                    if (newText) {
                        var l = $compile(newText)(scope);
                        ele.html("");
                        ele.append(l);
                    }
                }

            })
        }
    }
}]);