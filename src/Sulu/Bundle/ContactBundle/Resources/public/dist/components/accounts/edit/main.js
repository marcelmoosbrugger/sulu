define(["services/sulucontact/account-manager","services/sulucontact/account-router","services/sulucontact/account-delete-dialog"],function(a,b,c){"use strict";return{header:function(){var a={title:function(){return this.data.name}.bind(this),tabs:{url:"/admin/content-navigations?alias=account",options:{data:function(){return this.sandbox.util.extend(!1,{},this.data)}.bind(this)},componentOptions:{values:this.data}},toolbar:{buttons:{save:{parent:"saveWithOptions"}}}};return this.options.id&&(a.toolbar.buttons["delete"]={}),a},title:function(){return this.data.name},loadComponentData:function(){var b=this.sandbox.data.deferred();return a.loadOrNew(this.options.id).then(function(a){b.resolve(a)}),b},initialize:function(){this.bindCustomEvents()},bindCustomEvents:function(){this.sandbox.on("sulu.header.back",this.toList.bind(this)),this.sandbox.on("sulu.tab.dirty",this.enableSave.bind(this)),this.sandbox.on("sulu.router.navigate",this.disableSave.bind(this)),this.sandbox.on("sulu.toolbar.save",this.save.bind(this)),this.sandbox.on("sulu.tab.saving",this.loadingSave.bind(this)),this.sandbox.on("sulu.tab.data-changed",this.changeData.bind(this)),this.sandbox.on("sulu.toolbar.delete",this.deleteAccount.bind(this))},toList:function(){b.toList()},deleteAccount:function(){c.showDialog([this.options.id],function(c){a["delete"](this.options.id,c).then(function(){b.toList()}.bind(this))}.bind(this))},save:function(a){this.saveTab().then(function(b){this.afterSave(a,b)}.bind(this))},changeData:function(a){this.data=a},saveTab:function(){var a=$.Deferred();return this.sandbox.once("sulu.tab.saved",function(b,c){c&&this.changeData(b),a.resolve(b)}.bind(this)),this.sandbox.emit("sulu.tab.save"),a},enableSave:function(){this.sandbox.emit("sulu.header.toolbar.item.enable","save",!1)},disableSave:function(){this.sandbox.emit("sulu.header.toolbar.item.disable","save",!1)},loadingSave:function(){this.sandbox.emit("sulu.header.toolbar.item.loading","save")},afterSave:function(a,c){this.sandbox.emit("sulu.header.toolbar.item.disable","save",!0),this.sandbox.emit("sulu.header.saved",c),"back"===a?b.toList():"new"===a?b.toAdd(c):this.options.id||b.toEdit(c.id)}}});