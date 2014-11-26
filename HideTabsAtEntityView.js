/*globals tau*/
tau
    .mashups
    .addDependency('tau/configurator')
    .addMashup(function(configurator) {
        'use strict';

        var tabsToHide = {
            'userstory': ['History', 'relations'],
            'feature': ['implementationHistory'],
            'testplan': ['testCases']
        };

        var reg = configurator.getBusRegistry();

        var addBusListener = function(busName, eventName, listener) {

            reg.on('create', function(e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.on(eventName, listener);
                }
            });

            reg.on('destroy', function(e, data) {

                var bus = data.bus;
                if (bus.name === busName) {
                    bus.removeListener(eventName, listener);
                }
            });
        };

        var hideTab = function($el, label) {

            $el.find('.i-role-tabheader[data-label=' + label + ']').hide();
        };

        var hideTabs = function(e, renderData) {

            var entityData = renderData.view.config.entity;
            var $el = renderData.element;
            var tabs = tabsToHide[entityData.type ? entityData.type.toLowerCase() : entityData.toLowerCase()];

            if (tabs) {
                tabs.forEach(function(tabLabel) {
                    hideTab($el, tabLabel);
                });
            }
        };

        addBusListener('entity_page', 'afterRender', hideTabs);
        addBusListener('entity component', 'afterRender', hideTabs);
        addBusListener('tau/components/component.page.entity', 'afterRender', hideTabs);

    });
