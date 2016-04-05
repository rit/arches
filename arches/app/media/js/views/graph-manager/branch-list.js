define([
    'views/list',
    'views/graph-manager/graph-base',
    'models/graph',
    'knockout'
], function(ListView, GraphBase, GraphModel , ko) {
    var BranchList = ListView.extend({
        initialize: function(options) {
            ListView.prototype.initialize.apply(this, arguments);

            this.editNode = options.editNode;
            this.graphModel = options.graphModel;
            this.items = options.branches;
            this.items().forEach(function (branch) {
                branch.graph.nodes.forEach(function (node) {
                    node.editing = ko.observable(false);
                    node.name = ko.observable(node.name);
                });
            });
            this.selectedItem = ko.observable(null);
        },

        selectItem: function(item, evt){
            if(item.selected()){
                this.selectedItem(null)
            }else{
                this.selectedItem(item);
                this.graph = new GraphBase({
                    el: $('#branch-preview'),
                    nodes: ko.observableArray(item.graph.nodes),
                    edges: ko.observableArray(item.graph.edges)
                });
            }
            ListView.prototype.selectItem.apply(this, arguments);
        },

        appendBranch: function(){
            if(this.editNode()){
                this.graphModel.appendBranch(this.editNode().nodeid, 'P1', this.selectedItem().branchmetadataid, function(response){
                    console.log(response)
                }, this)

            }
        },

        closeForm: function(){
            this.clearSelection();
            this.selectedItem(null);
        }

    });
    return BranchList;
});
