define(["jquery","underscore","services/sulumedia/overlay-manager","services/sulumedia/user-settings-manager","text!sulumedia/components/collections/masonry-decorator/item.html","text!sulumedia/components/collections/masonry-decorator/empty-indicator.html"],function(a,b,c,d,e,f){"use strict";var g={unselectOnBackgroundClick:!0,selectable:!0,selectOnAction:!1,imageFormat:"260x",emptyListTranslation:"public.empty-list",fields:{image:"thumbnails",title:["title"],description:["mimeType","size"]},separators:{title:" ",description:", "},emptyIcon:"fa-coffee",hintIcon:"fa-pencil",noImgIcon:function(a){return"fa-file-o"}},h={masonryGridId:"masonry-grid",emptyIndicatorClass:"empty-list",selectedClass:"selected",loadingClass:"loading",iconClass:"image-icon",imageClass:"image",noImageClass:"no-image",actionNavigatorClass:"action-navigator",downloadNavigatorClass:"download-navigator",playVideoNavigatorClass:"play-video-navigator"},i=function(a,b,c){if(a&&b){var d=[];return b.forEach(function(b){a[b]&&d.push(a[b])}),d.join(c)}},j=function(a){var b=this.sandbox.util.extend(!1,{},a);return this.datagrid.matchings.forEach(function(a){var c=a.type===this.datagrid.types.THUMBNAILS?this.options.imageFormat:"";b[a.attribute]=this.datagrid.processContentFilter.call(this.datagrid,a.attribute,b[a.attribute],a.type,c)}.bind(this)),b},k=function(){return this.createEventName("masonry.refresh")};return function(){return{initialize:function(a,b){this.masonryGridId=h.masonryGridId+(new Date).getTime(),this.datagrid=a,this.sandbox=this.datagrid.sandbox,this.options=this.sandbox.util.extend(!0,{},g,b),this.setVariables(),this.sandbox.on(k.call(this.datagrid),function(){this.sandbox.masonry.refresh("#"+this.masonryGridId,!0)}.bind(this))},setVariables:function(){this.rendered=!1,this.$el=null,this.$items={}},render:function(a,b){this.renderMasonryContainer(b),this.initializeMasonryGrid(),this.bindGeneralDomEvents(),this.renderRecords(a.embedded,!0),this.rendered=!0},renderMasonryContainer:function(a){this.$el=this.sandbox.dom.createElement('<div class="masonry-container"/>');var b=this.sandbox.util.template(f,{text:this.sandbox.translate(this.options.emptyListTranslation),icon:this.options.emptyIcon});this.sandbox.dom.append(this.$el,b);var c=this.sandbox.dom.createElement('<div id="'+this.masonryGridId+'" class="masonry-grid"/>');this.sandbox.dom.append(this.$el,c),this.sandbox.dom.append(a,this.$el)},updateEmptyIndicatorVisibility:function(){this.datagrid.data&&this.datagrid.data.embedded&&this.datagrid.data.embedded.length>0?this.$el.find("."+h.emptyIndicatorClass).hide():this.$el.find("."+h.emptyIndicatorClass).show()},initializeMasonryGrid:function(){this.sandbox.masonry.initialize("#"+this.masonryGridId,{align:"left",direction:"left",itemWidth:260,offset:20,verticalOffset:20,possibleFilters:[h.selectedClass]})},bindGeneralDomEvents:function(){this.options.unselectOnBackgroundClick&&this.sandbox.dom.on("body","click.masonry",function(){this.deselectAllRecords()}.bind(this))},renderRecords:function(c,d){this.updateEmptyIndicatorVisibility();var e=[];c.forEach(function(a){var b,c=j.call(this,a),f=c[this.options.fields.image].url||"",g=i(c,this.options.fields.title,this.options.separators.title),h=i(c,this.options.fields.description,this.options.separators.description),k="video"===c.type;b=this.renderItem(c.id,f,g,c.locale!==this.options.locale?c.locale:null,h,k,d,this.options.noImgIcon(c)),e.push(b)}.bind(this)),a.when.apply(a,e).then(function(){b.delay(function(){this.$el.find(".masonry-item").removeClass(h.loadingClass)}.bind(this),0)}.bind(this))},renderItem:function(b,c,d,f,g,i,j,k){var l=this.getTitleTextWidth(!!f),m=a.Deferred();return this.$items[b]=this.sandbox.dom.createElement(this.sandbox.util.template(e,{image:c,title:this.sandbox.util.cropMiddle(String(d),l),fallbackLocale:f,description:this.sandbox.util.cropMiddle(String(g),35),isVideo:i,domain:window.location.protocol+"//"+window.location.host,selectable:this.options.selectable,placeholderIcon:k,hintIcon:this.options.hintIcon})),this.$items[b].addClass(h.loadingClass),this.datagrid.itemIsSelected.call(this.datagrid,b)&&this.selectRecord(b),j?this.sandbox.dom.append(this.sandbox.dom.find("#"+this.masonryGridId,this.$el),this.$items[b]):this.sandbox.dom.prepend(this.sandbox.dom.find("#"+this.masonryGridId,this.$el),this.$items[b]),c?this.bindItemLoadingEvents(b,m):this.itemLoadedHandler(this.$items[b],m),this.bindItemEvents(b),m},startDownloadDropdown:function(c){if(!this.$items[c].find("."+h.downloadNavigatorClass).children().length){var d=this.datagrid.getRecordById(c),e=[{id:"download",name:"sulu.media.download_original",url:window.location.protocol+"//"+window.location.host+d.url},{id:"divider",divider:!0},{id:window.location.protocol+"//"+window.location.host+d.url,name:"sulu.media.copy_original",info:"sulu.media.copy_url",clickedInfo:"sulu.media.copied_url"}].concat(b.map(d.thumbnails,function(a,b){return{id:window.location.protocol+"//"+window.location.host+a,name:b,info:"sulu.media.copy_url",clickedInfo:"sulu.media.copied_url"}})),f=a('<span class="fa-cloud-download"/>');this.$items[c].find("."+h.downloadNavigatorClass).append(f),this.sandbox.start([{name:"dropdown@husky",options:{el:f,instanceName:c,data:e}}]),this.sandbox.once("husky.dropdown."+d.id+".rendered",function(){this.clipboard=this.sandbox.clipboard.initialize("."+h.downloadNavigatorClass+" li",{text:function(a){return a.getAttribute("data-id")}})}.bind(this))}},stopDownloadDropdown:function(a){this.sandbox.stop(this.$items[a].find("."+h.downloadNavigatorClass+" *"))},getTitleTextWidth:function(a){var b=29;return a&&(b-=3),b},bindItemEvents:function(b){this.sandbox.dom.on(this.$items[b],"click",function(a){this.sandbox.dom.stopPropagation(a),this.datagrid.itemAction.call(this.datagrid,b),this.options.selectOnAction&&this.toggleItemSelected(b)}.bind(this),"."+h.actionNavigatorClass),this.sandbox.dom.on(this.$items[b],"click",function(a){this.sandbox.dom.stopPropagation(a),c.startPlayVideoOverlay.call(this,b,d.getMediaLocale())}.bind(this),"."+h.playVideoNavigatorClass),this.options.selectable&&this.sandbox.dom.on(this.$items[b],"click",function(c){a(c.target).hasClass("husky-dropdown-trigger")||a(c.target).parents().hasClass("husky-dropdown-trigger")||(this.sandbox.dom.stopPropagation(c),this.toggleItemSelected(b))}.bind(this)),this.$items[b].on("mouseenter",function(){this.startDownloadDropdown(b)}.bind(this)),this.$items[b].on("mouseleave",function(){this.stopDownloadDropdown(b)}.bind(this)),this.bindItemDownloadEvents(b)},bindItemDownloadEvents:function(a){this.sandbox.on("husky.dropdown."+a+".item.click",function(a){a.url&&(window.location.href=a.url)})},bindItemLoadingEvents:function(b,c){this.sandbox.dom.one(a(this.$items[b]).find("."+h.imageClass),"load",function(){this.sandbox.dom.remove(a(this.$items[b]).find("."+h.iconClass)),this.itemLoadedHandler(this.$items[b],c)}.bind(this)),this.sandbox.dom.one(a(this.$items[b]).find("."+h.imageClass),"error",function(){this.sandbox.dom.remove(a(this.$items[b]).find("."+h.imageClass)),this.itemLoadedHandler(this.$items[b],c)}.bind(this))},itemLoadedHandler:function(a,b){this.lockItemImageHeight(a),0!==a.find("."+h.iconClass).length&&a.addClass(h.noImageClass),this.sandbox.masonry.refresh("#"+this.masonryGridId,!0),b.resolve()},lockItemImageHeight:function(a){a.find(".masonry-image").height(a.find(".masonry-image").height())},toggleItemSelected:function(a){this.datagrid.itemIsSelected.call(this.datagrid,a)===!0?this.deselectRecord(a):this.selectRecord(a)},extendOptions:function(a){this.options=this.sandbox.util.extend(!0,{},this.options,a)},destroy:function(){this.sandbox.dom.off("body","click.masonry"),this.sandbox.masonry.destroy("#"+this.masonryGridId),this.sandbox.dom.remove(this.$el)},addRecord:function(a,b){this.renderRecords([a],b)},addRecords:function(a,b){this.renderRecords(a,b)},removeRecord:function(a){return this.$items[a]?(this.sandbox.dom.remove(this.$items[a]),this.sandbox.masonry.refresh("#"+this.masonryGridId,!0),this.datagrid.removeRecord.call(this.datagrid,a),this.updateEmptyIndicatorVisibility(),!0):!1},selectRecord:function(b){this.sandbox.dom.addClass(this.$items[b],h.selectedClass),a(this.$items[b]).attr("data-filter-class",JSON.stringify([h.selectedClass])),this.sandbox.dom.is(this.sandbox.dom.find('input[type="checkbox"]',this.$items[b]),":checked")||this.sandbox.dom.prop(this.sandbox.dom.find('input[type="checkbox"]',this.$items[b]),"checked",!0),this.datagrid.setItemSelected.call(this.datagrid,b)},deselectRecord:function(b){this.sandbox.dom.removeClass(this.$items[b],h.selectedClass),a(this.$items[b]).attr("data-filter-class",JSON.stringify([])),this.sandbox.dom.is(this.sandbox.dom.find('input[type="checkbox"]',this.$items[b]),":checked")&&this.sandbox.dom.prop(this.sandbox.dom.find('input[type="checkbox"]',this.$items[b]),"checked",!1),this.datagrid.setItemUnselected.call(this.datagrid,b)},deselectAllRecords:function(){this.sandbox.util.each(this.$items,function(a){this.deselectRecord(Number(a))}.bind(this))},showSelected:function(b){var c=[],d=a(".masonry-item:not(.selected)");b?(c.push(h.selectedClass),d.hide()):d.show(),this.sandbox.masonry.updateFilterClasses("#"+this.masonryGridId),this.sandbox.masonry.filter("#"+this.masonryGridId,c)}}}});