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

        var hideTabs = function($el, entityType) {
            var tabs = tabsToHide[entityType.toLowerCase()];

            if (tabs) {
                tabs.forEach(function(tabLabel) {
                    hideTab($el, tabLabel);
                });
            }
        };

        var listener = function(e, renderData) {
            var entityData = renderData.view.config.entity;
            var $el = renderData.element;
            var type = entityData.type ? entityData.type.toLowerCase() : entityData.toLowerCase();

            hideTabs($el, type);
        };

        addBusListener('entity_page', 'afterRender', listener);
        addBusListener('entity component', 'afterRender', listener);
        addBusListener('tau/components/component.page.entity', 'afterRender', listener);
        addBusListener('entity container', 'afterRenderAll', function(e, data) {
            var type = data.view.config.context.entity.entityType.name;
            var $el = data.element;

            hideTabs($el, type);
        });

    });
