require.config({paths:{sulumedia:"../../sulumedia/dist",sulumediacss:"../../sulumedia/css","extensions/masonry":"../../sulumedia/dist/extensions/masonry","extensions/sulu-buttons-mediabundle":"../../sulumedia/dist/extensions/sulu-buttons","services/sulumedia/media-router":"../../sulumedia/dist/services/media-router","services/sulumedia/overlay-manager":"../../sulumedia/dist/services/overlay-manager","services/sulumedia/collection-manager":"../../sulumedia/dist/services/collection-manager","services/sulumedia/media-manager":"../../sulumedia/dist/services/media-manager","services/sulumedia/user-settings-manager":"../../sulumedia/dist/services/user-settings-manager","services/sulumedia/file-icons":"../../sulumedia/dist/services/file-icons","type/media-selection":"../../sulumedia/dist/validation/types/media-selection","datagrid/decorators/masonry-view":"../../sulumedia/dist/components/collections/masonry-decorator/masonry-view"}}),define(["services/sulumedia/media-router","services/sulumedia/user-settings-manager","services/sulumedia/overlay-manager","extensions/masonry","extensions/sulu-buttons-mediabundle","sulumedia/ckeditor/media-link","css!sulumediacss/main"],function(a,b,c,d,e,f){"use strict";return{name:"SuluMediaBundle",initialize:function(c){var g=c.sandbox;c.components.addSource("sulumedia","/bundles/sulumedia/dist/components"),d.initialize(c),e.initialize(c),g.urlManager.setUrl("media","media/collections/edit:<%= collectionId %>/files/edit:<%= mediaId %>",function(a){return{mediaId:a.properties.media_id,collectionId:a.properties.collection_id}}),g.mvc.routes.push({route:"media/collections/:locale",callback:function(a){return'<div data-aura-component="collections/edit@sulumedia" data-aura-locale="'+a+'"/>'}}),g.mvc.routes.push({route:"media/collections",callback:function(){b.getLastVisitedCollection()?a.toCollection(b.getLastVisitedCollection(),b.getMediaLocale()):a.toRootCollection(b.getMediaLocale())}}),g.mvc.routes.push({route:"media/collections/:locale/edit::id/:content",callback:function(a,b){return'<div data-aura-component="collections/edit@sulumedia" data-aura-id="'+b+'" data-aura-locale="'+a+'"/>'}}),g.mvc.routes.push({route:"media/collections/:locale/edit::id/:content/edit::mediaId",callback:function(a,b,c,d){return'<div data-aura-component="collections/edit@sulumedia" data-aura-id="'+b+'" data-aura-locale="'+a+'" data-aura-edit-id="'+d+'"/>'}}),g.mvc.routes.push({route:"media/collections/edit::id/:content/edit::mediaId",callback:function(c,d,e){a.toCollection(c,b.getMediaLocale(),e)}}),g.ckeditor.addPlugin("mediaLink",new f(c.sandboxes.create("plugin-media-link"))),g.ckeditor.addToolbarButton("links","MediaLink","image"),c.components.before("initialize",function(){"Sulu App"===this.name&&(this.sandbox.on("husky.dropzone.error",function(a,b){var c=this.sandbox.translate("sulu.dropzone.error.title"),d="sulu.dropzone.error.message";c=c.replace("{{filename}}",this.sandbox.util.cropMiddle(b.name,20)),5007===a.code&&(d="sulu.dropzone.error.message.wrong-filetype"),this.sandbox.emit("sulu.labels.error.show",d,c)}.bind(this)),this.sandbox.on("husky.dropzone.error.file-to-big",function(a,b){var c=this.sandbox.translate("sulu.dropzone.error.file-to-big.title");c=c.replace("{{filename}}",this.sandbox.util.cropMiddle(b.name,20)),this.sandbox.emit("sulu.labels.error.show",a,c)}.bind(this)))})}}});