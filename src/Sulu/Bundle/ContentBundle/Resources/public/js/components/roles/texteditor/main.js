/*
 * This file is part of Sulu.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

define([
    'underscore',
    'jquery',
    'config',
    'services/sulusecurity/role-router',
    'text!./skeleton.html'
], function(_, $, Config, RoleRouter, skeletonTemplate) {

    'use strict';

    return {

        defaults: {
            options: {},
            translations: {
                title: 'sulu-content.ckeditor.roles-title',
                all: 'security.roles.all',
                none: 'security.roles.none',
                type: 'sulu-content.ckeditor.roles-type',
                horizontal: 'sulu-content.ckeditor.roles-horizontal',
                info: 'sulu-content.ckeditor.roles-info',
                warning: 'security.warning'
            },
            templates: {
                skeleton: skeletonTemplate
            }
        },

        initialize: function() {
            this.toolbar = this.sandbox.ckeditor.getAvailableToolbarSections();

            this.render();

            this.bindDOMEvents();
            this.bindCustomEvents();
        },

        bindDOMEvents: function() {
            this.sandbox.dom.on('#select-all', 'click', function() {
                this.sandbox.emit('husky.matrix.set-all');
            }.bind(this));
        },

        bindCustomEvents: function() {
            this.sandbox.on('sulu.header.back', RoleRouter.toList);
            this.sandbox.on('husky.matrix.changed', this.changeData.bind(this));
            this.sandbox.on('husky.matrix.changed', function() {
                this.sandbox.emit('sulu.header.toolbar.item.enable', 'save', false);
            }.bind(this));
            this.sandbox.on('sulu.toolbar.save', this.save.bind(this));
            this.sandbox.on('sulu.toolbar.delete', this.delete.bind(this));
        },

        render: function() {
            var values = this.prepareMatrixValues();
            var data = this.prepareMatrixData();

            this.$el.html(this.templates.skeleton({translations: this.translations, content: this.data.roleModel.toJSON()}));

            this.sandbox.start([
                {
                    name: 'matrix@husky',
                    options: {
                        el: '#matrix-container',
                        captions: {
                            all: this.translations.all,
                            none: this.translations.none,
                            type: this.translations.type,
                            horizontal: this.translations.horizontal,
                            vertical: values.vertical
                        },
                        values: values,
                        data: data
                    }
                }
            ]);
        },

        prepareMatrixValues: function() {
            var vertical = [],
                horizontal = [];

            for (var key in this.toolbar) {
                if (!this.toolbar.hasOwnProperty(key)) {
                    continue;
                }

                vertical.push(key);
                horizontal.push(_.map(this.toolbar[key], function(button) {
                    return {value: button, icon: this.sandbox.ckeditor.getIcon(button), title: button};
                }.bind(this)));
            }

            return {vertical: vertical, horizontal: horizontal};
        },

        prepareMatrixData: function() {
            var data = [];
            for (var section in this.toolbar) {
                data.push(
                    _.map(this.toolbar[section], function(item) {
                        return _.contains(this.data.toolbarRights[section], item);
                    }.bind(this))
                );
            }

            return data;
        },

        /**
         * Changes the data for given data for a row or for a single element.
         *
         * @param {Object} data The data of a row or a single element
         */
        changeData: function(data) {
            if (typeof(data.value) !== 'string') {
                this.sandbox.dom.each(data.value, function(key, elementValue) {
                    this.changeDataForElement({section: data.section, value: elementValue.value, activated: data.activated});
                }.bind(this));
            } else {
                this.changeDataForElement(data);
            }
        },

        /**
         * Changes the data for a single element.
         *
         * @param {Object} elementValue The value of a single element.
         */
        changeDataForElement: function(elementValue) {
            if (!!elementValue.activated) {
                if (_.contains(this.data.toolbarRights[elementValue.section], elementValue.value)) {
                    return;
                }
                if (!this.data.toolbarRights[elementValue.section]) {
                    this.data.toolbarRights[elementValue.section] = [];
                }
                this.data.toolbarRights[elementValue.section].push(elementValue.value);

            } else {

                var index = this.data.toolbarRights[elementValue.section].indexOf(elementValue.value);
                if (index > -1) {
                    this.data.toolbarRights[elementValue.section].splice(index, 1);
                }
            }
        },

        delete: function() {
            this.sandbox.sulu.showDeleteDialog(function(wasConfirmed) {
                if (wasConfirmed) {
                    this.data.roleModel.destroy();
                }
            }.bind(this));
        },

        save: function(action) {
            this.sandbox.emit('sulu.header.toolbar.item.loading', 'save');

            $.ajax('/admin/api/roles/' + this.data.roleModel.get('id') + '/settings/texteditor-toolbar', {
                method: 'PUT',
                data: {value: this.data.toolbarRights}
            }).then(function() {
                this.sandbox.emit('sulu.header.toolbar.item.disable', 'save', true);
                this.sandbox.emit('sulu.labels.warning.show', this.translations.warning);

                if (action === 'back') {
                    RoleRouter.toList();
                } else if (action === 'new') {
                    RoleRouter.toAdd();
                }
            }.bind(this)).fail(function() {
                this.sandbox.emit('sulu.header.toolbar.item.enable', 'save', false);
            }.bind(this));
        },

        loadComponentData: function() {
            var roleModel = this.options.data();
            var def = $.Deferred();

            $.getJSON('/admin/api/roles/' + roleModel.get('id') + '/settings/texteditor-toolbar').then(function(toolbar) {
                // default all selected
                var toolbarRights = toolbar || this.sandbox.ckeditor.getAvailableToolbarSections();

                // The server may return an array instead of an object as it can't distinguish between a "normal"
                // array and an associative one.
                if ($.isArray(toolbarRights) && toolbarRights.length === 0) {
                    toolbarRights = {};
                }

                def.resolve({
                    roleModel: roleModel,
                    toolbarRights: toolbarRights
                });
            }.bind(this));

            return def.promise();
        }
    };
});
