
/**
 * denoui-tree
 * author yc.tao
 * v0.10
 */
(function () {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global) ||
        this || {};

    var denouiTree = {

        render: function(options){
            return this.renderTree(options)
        },

        renderTree: function (options) {

            var defaultOptions = {
                iconfont: {
                    family: "denoui-icon",
                    icons: {
                        open: ['sami-select','add-select'],
                        checkbox: ['checkbox1','checkboxpartial','checkbox-checked'],
                        radio: ['radio','radioactive'],
                        empty: ['empty'],
                        file: ['file1','file2','icon_workfile_line']
                    },
                },
                theme: {
                    id: "denoui",
                    color: "rgba(242,143,0,1)",
                    data: {
                        "tree-node-selected":{ "background-color": true, "opacity": 0.3 },
                        "tree-node-hover":{ "background-color": true, "opacity": 0.08 }
                    },
                }
            }

            denouiTheme.render(defaultOptions.theme)

            var themeClassName = denouiTheme.getClassName()

            defaultOptions.themeClassName = themeClassName
            // options.defaultOptions = defaultOptions
            options.iconfont = defaultOptions.iconfont
            options.themeClassName = themeClassName

            var treeFactory = new TreeFactory(options);

            return treeFactory.render()
        }
    }


    function createGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function isArray(value) {
        return value && !!value.unshift
    }

    var DONT_ENUM =  "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
        hasOwn = ({}).hasOwnProperty;
    for (var i in {
        toString: 1
    }){
        DONT_ENUM = false;
    }


    Object.keys = Object.keys || function(obj){//ecma262v5 15.2.3.14
        var result = [];
        for(var key in obj ) if(hasOwn.call(obj,key)){
            result.push(key) ;
        }
        if(DONT_ENUM && obj){
            for(var i = 0 ;key = DONT_ENUM[i++]; ){
                if(hasOwn.call(obj,key)){
                    result.push(key);
                }
            }
        }
        return result;
    };

    if(!document.getElementsByClassName){
        document.getElementsByClassName = function (className) {
            var allNode = document.getElementsByTagName("*");
            var list = [];
            for (var i = 0; i < allNode.length; i++) {
                var classList=allNode[i].className.split(/\s+/);
                if ( classList.indexOf(className)>-1 ) {
                    list.push(allNode[i]);
                }
            }
            return list;
        }
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(ele) {
            // 获取数组长度
            var len = this.length;
            // 检查值为数字的第二个参数是否存在，默认值为0
            var fromIndex = Number(arguments[1]) || 0;
            // 当第二个参数小于0时，为倒序查找，相当于查找索引值为该索引加上数组长度后的值
            if(fromIndex < 0) {
                fromIndex += len;
            }
            // 从fromIndex起循环数组
            while(fromIndex < len) {
                // 检查fromIndex是否存在且对应的数组元素是否等于ele
                if(fromIndex in this && this[fromIndex] === ele) {
                    return fromIndex;
                }
                fromIndex++;
            }
            return -1;
        }
    }

    if (!Array.prototype.map) {
        Array.prototype.map = function(callback) {
            // 获取数组长度
            var len = this.length;
            if(typeof callback != "function") {
                throw new TypeError();
            }
            // 创建跟原数组相同长度的新数组，用于承载经回调函数修改后的数组元素
            var newArr = new Array(len);
            // thisArg为callback 函数的执行上下文环境
            var thisArg = arguments[1];
            for(var i = 0; i < len; i++) {
                if(i in this) {
                    newArr[i] = callback.call(thisArg, this[i], i, this);
                }
            }
            return newArr;
        }
    }

    if (!Array.prototype.filter) {
        Array.prototype.filter = function(callback) {
            // 获取数组长度
            var len = this.length;
            if(typeof callback != "function") {
                throw new TypeError();
            }
            // 创建新数组，用于承载经回调函数修改后的数组元素
            var newArr = new Array();
            // thisArg为callback 函数的执行上下文环境
            var thisArg = arguments[1];
            for(var i = 0; i < len; i++) {
                if(i in this) {
                    if(callback.call(thisArg, this[i], i, this)) {
                        newArr.push(this[i]);
                    }
                }
            }
            return newArr;
        }
    }

    function replaceClassName(dom, oldCls, newCls) {

        if(!dom || !dom.setAttribute){
            return;
        }

        var classList = dom.className.split(" ");

        if(isArray(classList)){
            classList = classList.map(function (name) {
                if(name.indexOf(oldCls) > -1 ){
                    name = name.replace(oldCls,newCls)
                }
                if(!name){
                    name = undefined
                }
                return name
            });

            var className = classList.join(" ");
            dom.setAttribute("class",className)
        }

    }

    function addClassName(dom,cls) {

        if(!dom || !dom.setAttribute){
            return;
        }

        var classList = dom.className.split(" ");

        if(isArray(classList)){
            classList = classList.filter(function (cls) {
                return cls
            })

            var index = classList.indexOf(cls);

            if(index === -1){
                classList.push(cls)
            }

            var className = classList.join(" ");
            dom.setAttribute("class",className)
        }
    }

    function removeClassName(dom,cls) {

        if(!dom){
            return;
        }

        // 只传了一个dom
        if(!dom.length&&dom.setAttribute){
            replaceClassName(dom,cls,"")
        }else{
            // 传的是dom数组
            for(var i = 0, len = dom.length; i<len; i++){
                var _dom = dom[i]
                replaceClassName(_dom,cls,"")
            }

        }

    }

    function hasClassName(dom,cls) {

    }

    function insertAfter(newNode,curNode){
        curNode.parentNode.insertBefore(newNode,getNextElementSibling(curNode));
    }

    function getNextElementSibling(ele) {
        if (typeof ele.nextElementSibling == 'object') {
            return ele.nextElementSibling;
        }
        var n = ele.nextSibling;
        while (n) {
            if (n.nodeType === 1) {
                return n;
            }
            n = n.nextSibling;
        }
        return n
    }

    /**
     * tree 工厂
     * @param options
     * @constructor
     */
    function TreeFactory(options) {

        options = options || {}

        var id = options.id

        if( !id ){
            console.log("options.id is must");
            return
        }

        var treeContainer = document.querySelector("#"+id);

        if(!treeContainer){
            console.log("id = " + id + " dom not found");
            return;
        }

        var treeId = id + "-" + createGuid();

        treeContainer.setAttribute("data-id", treeId);

        var treeTableObj = this.createTreeTableDom();

        var tableDom = treeTableObj.table, tbodyDom = treeTableObj.tbody;

        treeContainer.appendChild(tableDom)

        this.id = treeId;
        this.container = tbodyDom;
        this.options = options;
        // 所有节点数据
        this.nodes = {};
        // 当前点击选中的节点
        this.seleceted = {};
        //
        this.checked = {}

    }


    TreeFactory.prototype.getNodes = function(){
        return this.nodes;
    }


    /**
     * 设置树节点节点
     * @param node
     */
    TreeFactory.prototype.setTreeNode = function (node) {
        if(node && node.id){
            this.nodes[node.id] = node;
        }
    }

    /**
     * 获取指定id的树节点
     * @param id
     * @returns {*}
     */
    TreeFactory.prototype.getTreeNode = function (id) {
        return this.nodes[id];
    }

    TreeFactory.prototype.removeTreeNode = function(id){
        return delete this.nodes[id]
    }



    /**
     * 获取指定id的节点
     * @param id
     * @returns {*}
     */
    TreeFactory.prototype.getNode = function (id) {
        var treeNode = this.getTreeNode(id)
        return treeNode && treeNode.node;
    }


    /**
     * 获取当前树的参数信息
     * @returns {*}
     */
    TreeFactory.prototype.getOptions = function () {
        return this.options;
    }


    /**
     * 获取当前树的数据信息
     * @returns {*|options.setting|{checkType, callback}|{}}
     */
    TreeFactory.prototype.getData = function () {
        return (this.options && this.options.data)|| []
    }

    TreeFactory.prototype.setData = function (value) {
        return this.options.data = value
    }

    /**
     * 获取当前树的配置信息
     * @returns {*|options.setting|{checkType, callback}|{}}
     */
    TreeFactory.prototype.getSetting = function () {
        return (this.options && this.options.setting) || {}
    }

    /**
     * 获取当前树的参数信息
     * @returns {*}
     */
    TreeFactory.prototype.getContainer = function () {
        return this.container;
    }


    TreeFactory.prototype.getSelected = function(){
        return this.seleceted
    }

    TreeFactory.prototype.setSelected = function(value){
        this.seleceted = value
    }

    TreeFactory.prototype.removeSelected = function(){
        this.seleceted = {}
    }

    TreeFactory.prototype.getChecked = function(id){
        return this.checked[id] || this.checked;
    }

    TreeFactory.prototype.setChecked = function(id,value){
        this.checked[id] = value
    }

    TreeFactory.prototype.removeChecked = function(id){
        return delete this.checked[id]
    }



    TreeFactory.prototype.render = function () {

        var treeFactory = this,                             // 当前树的实例
            treeContainer = treeFactory.getContainer();     // 当前树容器

        // 处理节点数据
        treeFactory.parseNodes()
        // 当前树的节点数据
        var data = treeFactory.getData()

        var pNode = { level: -1 }
        treeFactory.createTreeNodes(treeContainer, data, pNode);

        return treeFactory
    }

    TreeFactory.prototype.parseNodes = function(){
        var treeFactory = this,                             // 当前树的实例
            options = treeFactory.getOptions(),             // 当前树的参数
            data = options.data || [];                      // 当前树的节点数据

        // 如果传的是对象，转数组
        if(Object.prototype.toString.call(data) === '[object Object]'){
            data = [data]
        }


        var treeId = options.id, treeIdCount = 0
        function fn(node,_pid) {
            var _id = treeId+"_"+(++treeIdCount)
            node["_id"] = _id
            node["_pid"] = _pid
            if(node.children&&node.children.length){
                for (var i=0,len=node.children.length;i<len;i++){
                    fn(node.children[i],_id)
                }
            }
        }
        for (var i=0,len=data.length;i<len;i++){
            fn(data[i],null)
        }

        treeFactory.setData(data)

        return treeFactory
    }


    TreeFactory.prototype.createTreeNodes = function(parentContainer,nodes, pNode){

        var level = pNode.level + 1;
        var treeFactory = this;
        var i = 0, len = nodes.length;
        for(; i < len; i++){
            var node = nodes[i];
            if(!node || !node.name){
                continue;
            }
            node.level = level
            node._pid = pNode._id
            treeFactory.createTreeNode(parentContainer,node);
        }

        return treeFactory;
    }


    TreeFactory.prototype.createTreeNode = function (parentContainer,node) {

        var treeFactory = this;

        function TreeNode(parentContainer,node) {

            this.id = node._id

            this.pid = node._pid

            this.node = node;

            this._parent = parentContainer;

            this.init(node);

            treeFactory.setTreeNode(this);
        }

        /* 初始化 */
        TreeNode.prototype.init = function () {

            var treeNode = this;

            treeNode.renderContainer();

            return treeNode;
        }

        TreeNode.prototype.renderContainer = function(){

            var treeNode = this, node = treeNode.node, parentContainer = treeNode._parent;

            var treeTableRowDom = treeFactory.createTreeTableRowDom();
            var treeTableCellDom = treeFactory.createTreeTableCellDom();
            treeTableRowDom.appendChild(treeTableCellDom)

            var containerDom = treeFactory.createNodeContainerDom();

            treeTableCellDom.appendChild(containerDom)

            parentContainer.appendChild(treeTableRowDom);

            this._container = containerDom;
            this._parent = treeTableRowDom
            this._row = treeTableRowDom

            // 渲染节点
            treeNode.renderNode()

            var open = node.open
            // 渲染孩子节点
            if(isArray(node.children) && open){
                treeNode.renderChildren();
            }

            return treeNode;

        }

        /* 渲染节点 */
        TreeNode.prototype.renderNode = function () {

            var treeNode = this,
                node = treeNode.node,
                options = treeFactory.getOptions(),
                setting = treeFactory.getSetting(),
                iconfont = options.iconfont,
                icons = iconfont.icons,
                themeClassName = options.themeClassName,
                rowDom = treeNode._row;

            var containerDom = treeNode._container;

            var selectdNodeClassName = themeClassName["tree-node-selected"],
                hoverNodeClassName = themeClassName["tree-node-hover"],
                textNodeClassName = themeClassName["theme-text"]

            var nodeDom = treeFactory.createNodeDom(function (event, type) {

                var callback = {
                    "click": function () {
                        var data = {
                            type: 'beforeClick',
                            data: {
                                treeNode: treeNode,
                                ele: nodeDom,
                                event: event
                            }
                        }

                        // 执行click之前回调
                        treeNode.executeCallback(data);

                        // 移除之前选中节点的样式
                        removeClassName(document.getElementsByClassName(selectdNodeClassName),selectdNodeClassName)
                        // 给当前选中节点移除hover样式
                        removeClassName(treeNode.selectedRowDom,hoverNodeClassName)
                        // 给当前选中节点加选中样式
                        addClassName(treeNode.selectedRowDom,selectdNodeClassName)


                        // 取到之前选中的节点，更新选中属性
                        var curSelected = treeFactory.getSelected()
                        if(Object.keys(curSelected).length){
                            curSelected.updateNode("selected", false)
                        }
                        // 更新当前选中节点的属性
                        treeNode.updateNode("selected", true)
                        // 更新当前选中节点
                        treeFactory.setSelected(treeNode)

                        data.type = "afterClick";
                        // 执行click之后回调
                        treeNode.executeCallback(data);

                    },
                    "mouseover": function () {

                        var data = {
                            type: 'beforeMouseover',
                            data: {
                                treeNode: treeNode,
                                ele: nodeDom,
                                event: event,
                                className: hoverNodeClassName
                            }
                        }

                        treeNode.executeCallback(data);

                        if(!node.selected){
                            addClassName(treeNode.selectedRowDom, data.data.className)
                        }

                        data.type = "afterMouseover"
                        treeNode.executeCallback(data);
                    },
                    "mouseleave": function () {
                        var data = {
                            type: 'beforeMouseleave',
                            data: {
                                treeNode: treeNode,
                                ele: nodeDom,
                                event: event,
                                className: hoverNodeClassName
                            }
                        }
                        treeNode.executeCallback(data);

                        replaceClassName(treeNode.selectedRowDom,data.data.className,"")

                        data.type = "afterMouseleave"
                        treeNode.executeCallback(data);
                    }
                }

                typeof callback[type] === 'function' && callback[type]()
            });

            if(treeNode._node){
                containerDom.replaceChild(nodeDom,treeNode._node);
            }else{
                containerDom.appendChild(nodeDom);
            }

            if(node.selected){
                addClassName(rowDom, selectdNodeClassName)
            }

            this._node = nodeDom;

            // 如果是tree-table，此值等于this._row
            this.selectedRowDom = nodeDom

            // 加占位
            if(node.level){
                var level = node.level
                while(level){
                    var indentDom = treeFactory.createIndentDom()
                    nodeDom.appendChild(indentDom)
                    level--
                }
            }

            // 渲染展开和收缩图标
            var open = node.open,
                hasChildren = node.isParent || (isArray(node.children)&&node.children.length) || false;

            var openOrCloseIconName = icons.empty[0], openOrCloseIconArr = icons.open, isEmptyIcon = true
            if(hasChildren){
                openOrCloseIconName = (open && openOrCloseIconArr[0]) || openOrCloseIconArr[1];
                isEmptyIcon = false
            }

            var openOrCloseIcon = treeFactory.createIcon(openOrCloseIconName,function (event) {

                // 空图标不允许执行回调
                if(isEmptyIcon){
                    return;
                }

                // 阻止冒泡
                if(document.all){
                    window.event.cancelBubble=true
                }else{
                    event.stopPropagation()
                }

                var node = treeNode.node, open = node.open;

                treeNode.updateNode("open", !open);
            });
            treeNode._openOrCloseIcon= openOrCloseIcon
            nodeDom.appendChild(openOrCloseIcon);


            // 渲染单/复选框
            var checkType = (setting.checkType || 'none').toLowerCase()
            var checked = node.checked

            if(checkType === 'checkbox'){

                var checkboxIconArr = icons.checkbox
                if(checkboxIconArr.length && checkboxIconArr.length >=3){

                    var checkboxIconName = checked === 'part' ? checkboxIconArr[1] : checked ?  checkboxIconArr[2] : checkboxIconArr[0];

                    var checkboxIcon = treeFactory.createIcon(checkboxIconName,function (event) {
                        // 阻止冒泡
                        if(document.all){
                            window.event.cancelBubble=true
                        }else{
                            event.stopPropagation()
                        }

                        var node = treeNode.node,
                            _checked = (node.checked === 'part') ? true : !node.checked;

                        var data = {
                            type: 'beforeChecked',
                            data: {
                                treeNode: treeNode,
                                ele: nodeDom,
                                checked: _checked
                            }
                        }
                        treeNode.executeCallback(data);

                        treeNode.updateNode('checked',data.data.checked)

                        data.type = 'afterChecked'

                        treeNode.executeCallback(data);

                    })

                    if(checked){
                        addClassName(checkboxIcon,textNodeClassName)
                    }
                    nodeDom.appendChild(checkboxIcon)

                    treeNode._checkboxIcon = checkboxIcon

                }
            }


            if(checkType === 'radio'){

            }



            // 渲染树形图标
            var fileIconArr = icons.file || []

            if(fileIconArr.length){

                var fileIconName = fileIconArr[1]

                if(hasChildren){
                    fileIconName = open ? fileIconArr[2] : fileIconArr[0]
                }

                var fileIcon = treeFactory.createIcon(fileIconName)
                nodeDom.appendChild(fileIcon)

                treeNode._fileIcon = fileIcon

            }


            // 渲染节点名称
            var name = document.createElement("span");

            var data = {
                type: 'drawNode',
                data: {
                    treeNode: treeNode,
                    ele: nodeDom,
                    html: node.name
                }
            }

            treeNode.executeCallback(data);

            name.innerHTML = data.data.html || node.name;

            nodeDom.appendChild(name);

            return treeNode;
        }

        TreeNode.prototype.renderChildren = function () {

            var treeNode = this, node = treeNode.node;

            var parentDom = treeNode._parent;

            var children = node.children;

            var treeTableRowsDom = treeFactory.createTreeTableRowsDom();
            var treeTableCellsDom = treeFactory.createTreeTableCellsDom();
            treeTableRowsDom.appendChild(treeTableCellsDom)

            var treeTableNodesDom = treeFactory.createNodesContainerDom()
            treeTableCellsDom.appendChild(treeTableNodesDom)

            var childrenTreeTableObj = treeFactory.createTreeTableDom()

            var tableDom = childrenTreeTableObj.table;
            treeTableNodesDom.appendChild(tableDom)

            var tbodyDom = childrenTreeTableObj.tbody
            tableDom.appendChild(tbodyDom)

            insertAfter(treeTableRowsDom,parentDom)

            this._children = treeTableRowsDom;

            treeFactory.createTreeNodes(tbodyDom,children,node);

            return treeNode;
        }

        // 执行回调
        TreeNode.prototype.executeCallback = function (data) {

            var treeNode = this

            var setting = treeFactory.getSetting();

            typeof setting.callback === 'function' && setting.callback(data);

            return treeNode;
        }

        // 更新节点数据
        TreeNode.prototype.updateNode = function(name,value){
            return this._updateNode(name,value)
        }


        /**
         * 更新节点数据（接口）
         * @param name
         * @param value
         * @returns {TreeNode}
         * @private
         */
        TreeNode.prototype._updateNode = function(name,value){

            var treeNode = this,
                node = treeNode.node,
                setting = treeFactory.getSetting(),
                options = treeFactory.getOptions(),
                iconfont = options.iconfont,
                icons = iconfont.icons;

            var openOrCloseIconArr = icons.open, fileIconArr = icons.file

            if( name === 'open' ){

                var oldOpenOrCloseCls = openOrCloseIconArr[0], newOpenOrCloseCls = openOrCloseIconArr[1],
                    oldFileCls = fileIconArr[2], newFileCls = fileIconArr[0];

                node[ name ] = value

                if(value){
                    oldOpenOrCloseCls = openOrCloseIconArr[1];
                    newOpenOrCloseCls = openOrCloseIconArr[0];

                    oldFileCls = fileIconArr[0];
                    newFileCls = fileIconArr[2]
                }else{
                    treeNode.removeChildren()
                }
                treeNode.updateChildren();

                replaceClassName(treeNode._openOrCloseIcon,oldOpenOrCloseCls,newOpenOrCloseCls);

                replaceClassName(treeNode._fileIcon,oldFileCls,newFileCls);
            }

            // 更新selected属性
            if( name === 'selected' ){
                node[ name ] = value
            }

            // 更新check属性
            if( name === 'checked' ){

                var checkType = setting.checkType;
                if( checkType === 'checkbox' ){

                    // 更新节点属性
                    node[name] = value;

                    if(value && value !=='part'){
                        treeFactory.setChecked(node._id, node)
                    }else{
                        treeFactory.removeChecked(node._id)
                    }

                    // 更新节点checked图标
                    treeNode.updateCheckedIcon()

                    // 更新所有子孙节点属性值
                    treeFactory.updateAllChildrenNode(node,name,value)
                    // 更新所有子孙节点样式
                    treeNode.updateChildren()

                    // 更新所有父节点属性值
                    treeFactory.updateAllParentNode(node,name,value)
                    // 更新所有父节点样式
                    treeNode.updateParent()



                }
            }

            // 更新节点属性
            node[name] = value;

            return treeNode
        }


        // 更新节点checked图标
        TreeNode.prototype.updateCheckedIcon = function(){
            return this._updateCheckedIcon()
        }

        /**
         * 更新节点checked图标（接口）
         * @returns {TreeNode}
         * @private
         */
        TreeNode.prototype._updateCheckedIcon = function(){

            var treeNode = this,
                node = treeNode.node,
                options = treeFactory.getOptions(),
                iconfont = options.iconfont,
                icons = iconfont.icons;

            var checkboxIconArr = icons.checkbox
            var checkboxIcon = treeNode._checkboxIcon;
            var checked = node.checked

            if(checkboxIcon) {
                var checkboxCls = treeFactory.getIconName('checkbox',checkboxIconArr[0])

                if (checked === 'part') {
                    checkboxCls = treeFactory.getIconName('checkbox',checkboxIconArr[1])
                } else if (checked) {
                    checkboxCls = treeFactory.getIconName('checkbox',checkboxIconArr[2])
                }

                removeClassName(checkboxIcon, treeFactory.getIconName('checkbox',checkboxIconArr[0]))
                removeClassName(checkboxIcon, treeFactory.getIconName('checkbox',checkboxIconArr[1]))
                removeClassName(checkboxIcon, treeFactory.getIconName('checkbox',checkboxIconArr[2]))

                removeClassName(checkboxIcon, 'denoui-theme-text', '')

                addClassName(checkboxIcon, checkboxCls)
                if (checked) {
                    addClassName(checkboxIcon, 'denoui-theme-text')
                }

            }
            return treeNode
        }

        // 删除孩子节点
        TreeNode.prototype.removeChildren = function(){
            return this._removeChildren();
        }

        /**
         * 删除孩子节点（接口）
         * @returns {TreeNode}
         * @private
         */
        TreeNode.prototype._removeChildren = function(){

            var treeNode = this, node = treeNode.node

            if(!treeNode._children){
                return treeNode
            }

            function fn(node) {
                if(node.children&&node.children.length){
                    for(var i=0,len=node.children.length;i<len;i++){
                        treeFactory.removeTreeNode(node.children[i]._id)
                        treeFactory.removeChecked(node.children[i]._id)
                        delete node.children[i]._children
                        fn(node.children[i])
                    }
                }
            }

            if(node.children&&node.children.length){
                fn(node);
                treeNode._parent.parentNode.removeChild(treeNode._children)
            }
            return TreeNode
        }

        // 更新孩子节点
        TreeNode.prototype.updateChildren = function () {
            return this._updateChildren()
        }

        /**
         * 更新孩子节点（接口）
         * @returns {TreeNode}
         * @private
         */
        TreeNode.prototype._updateChildren = function(){

            var treeNode = this, node = treeNode.node, open = node.open
            if(node&&node.children && node.children.length){

                var firstChildrenNode =  node.children[0]
                var firstChildrenTreeNode = treeFactory.getTreeNode(firstChildrenNode._id)

                // 此节点是否渲染
                if(firstChildrenTreeNode){
                    for(var i =0 ,len=node.children.length;i<len;i++){
                        var _treeNode = treeFactory.getTreeNode(node.children[i]._id)
                        if(_treeNode){
                            // 更新节点checked图标
                            _treeNode.updateCheckedIcon()
                            // 更新孩子节点
                            _treeNode.updateChildren()
                        }
                    }
                }else if(open){
                    treeNode.renderChildren();
                }
            }
            return treeNode
        }

        // 更新父节点
        TreeNode.prototype.updateParent = function () {
            return this._updateParent()
        }

        /**
         * 更新父节点（接口）
         * @returns {TreeNode}
         * @private
         */
        TreeNode.prototype._updateParent = function () {

            var treeNode = this,
                node = treeNode.node;
            var pid = node._pid, pNode = treeFactory.getTreeNode(pid)
            if(pNode){
                // 更新节点checked图标
                pNode.updateCheckedIcon()
                // 更新父节点
                pNode.updateParent()
            }
            return treeNode
        }


        return new TreeNode(parentContainer,node)
    }

    /**
     *  创建根树的容器或者孩子节点的根容器
     *  class => denoui-tree-table
     * @returns {{tbody, table}}
     */
    TreeFactory.prototype.createTreeTableDom = function(){

        function createTreeTableDom() {
            var table = document.createElement("table");
            table.setAttribute("class","denoui-tree-table")

            var tbody = document.createElement("tbody")

            table.appendChild(tbody)

            return { table: table, tbody: tbody };
        }
        return createTreeTableDom()
    }

    /**
     *  创建节点tr容器 - tr
     *  class => denoui-tree-table-node-row
     * @returns {HTMLTableRowElement}
     */
    TreeFactory.prototype.createTreeTableRowDom = function () {
        function createTreeTableRowDom() {
            var tr = document.createElement("tr");
            tr.setAttribute("class","denoui-tree-table-node-row")
            return tr;
        }
        return createTreeTableRowDom();
    }

    /**
     *  创建节点td容器 - td
     *  class => denoui-tree-table-node-cell
     * @returns {HTMLTableDataCellElement}
     */
    TreeFactory.prototype.createTreeTableCellDom = function () {
        function createTreeTableCellDom() {
            var td = document.createElement("td");
            td.setAttribute("class","denoui-tree-table-node-cell")
            return td;
        }
        return createTreeTableCellDom();
    }

    /**
     *  创建孩子节点tr容器
     *  class => denoui-tree-table-nodes-row
     * @returns {HTMLTableRowElement}
     */
    TreeFactory.prototype.createTreeTableRowsDom = function () {
        function createTreeTableRowsDom() {
            var tr = document.createElement("tr");
            tr.setAttribute("class","denoui-tree-table-nodes-row")
            return tr;
        }
        return createTreeTableRowsDom();
    }

    /**
     *  创建孩子节点td容器
     *  class => denoui-tree-table-nodes-cell
     * @returns {HTMLTableDataCellElement}
     */
    TreeFactory.prototype.createTreeTableCellsDom = function () {
        function createTreeTableCellsDom() {
            var td = document.createElement("td");
            td.setAttribute("class","denoui-tree-table-nodes-cell")
            return td;
        }
        return createTreeTableCellsDom();
    }

    /**
     *  创建孩子节点直接容器
     *  class => denoui-tree-nodes-container
     * @returns {HTMLDivElement}
     */
    TreeFactory.prototype.createNodesContainerDom = function () {
        function createNodesContainerDom() {
            var dom = document.createElement("div");
            dom.setAttribute("class","denoui-tree-nodes-container")
            return dom;
        }
        return createNodesContainerDom();
    }

    /**
     *  创建树节点容器
     *  class => denoui-tree-node-container
     * @returns {HTMLDivElement}
     */
    TreeFactory.prototype.createNodeContainerDom = function () {
        function createNodeContainerDom() {
            var dom = document.createElement("div");
            dom.setAttribute("class","denoui-tree-node-container")
            return dom;
        }
        return createNodeContainerDom();
    }

    /**
     *  创建树节点dom
     *  class => denoui-tree-node
     * @param callback => 事件回调
     * @returns {HTMLSpanElement}
     */
    TreeFactory.prototype.createNodeDom = function (callback) {

        function createNodeDom(callback) {
            var span = document.createElement("span");
            span.setAttribute("class","denoui-tree-node");
            span.onclick = function (event) {
                typeof callback === 'function' && callback(event, "click");
            }
            span.onmouseenter = function (event) {
                typeof callback === 'function' && callback(event, "mouseover");
            }
            span.onmouseleave = function (event) {
                typeof callback === 'function' && callback(event, "mouseleave");
            }

            return span;
        }
        return createNodeDom(callback);
    }

    /**
     *  创建占位符dom
     *  class => denoui-tree-indent
     * @returns {HTMLSpanElement}
     */
    TreeFactory.prototype.createIndentDom = function () {
        function createIndentDom() {
            var span = document.createElement("span");
            span.setAttribute("class","denoui-tree-indent")
            return span;
        }
        return createIndentDom();
    }

    /**
     *  创建图标dom
     *  class => denoui-icon  + iconName
     * @param name  => 图标名称
     * @param callback => 事件回调
     * @param flag    => 是否直接赋值name
     * @returns {HTMLSpanElement}
     */
    TreeFactory.prototype.createIcon = function (name,callback,flag) {

        var treeFactory = this, options = treeFactory.getOptions(), iconfont = options.iconfont;

        var mainIcon = iconfont.family;

        var span = document.createElement("span");

        var className = ""

        if(typeof name !== 'string' ){
            return span
        }else{
            // 返回指定图标
            className = mainIcon + " " + mainIcon + "-" + name;
        }

        // flag为true，返回指定name
        if(flag){
            className = name;
        }

        span.setAttribute("class",className);

        span.onclick = function (event) {
            typeof callback === 'function' && callback(event);
        }

        return span;
    }

    /**
     *  获取指定图标的完成className
     * @param name => 定义的icons中的key
     * @param value => 值
     * @returns {string}
     */
    TreeFactory.prototype.getIconName = function (name,value) {
        var treeFactory = this,
            options = treeFactory.getOptions(),
            setting = treeFactory.getSetting(),
            iconfont = options.iconfont,
            iconFontFamily = iconfont.family,
            icons = iconfont.icons,
            themeClassName = options.themeClassName;

        var icon = icons[name], iconName = ""
        if(icon){
            var index = icon.indexOf(value)
            if(index>-1){
                iconName = iconFontFamily + "-" + icon[index]
            }
        }
        return iconName
    }

    /**
     *  更新所有的子孙节点的属性值
     * @param node => 节点
     * @param name => 属性
     * @param value => 值
     * @returns {TreeFactory}
     */
    TreeFactory.prototype.updateAllChildrenNode = function (node,name,value){

        var treeFactory = this;
        function fn(node) {
            if(node.children && node.children.unshift){
                for(var i = 0, len = node.children.length; i<len; i++){
                    var _node = node.children[i];
                    _node[name] = value
                    if(name ==='checked' && value && value !=='part'){
                        if(value && value !=='part'){
                            treeFactory.setChecked(_node._id, _node)
                        }else{
                            treeFactory.removeChecked(_node._id)
                        }

                    }
                    fn(_node);
                }
            }
        }
        fn(node)
        return treeFactory
    }

    /**
     *  更新所有的父节点的属性值
     * @param node => 节点
     * @param name => 属性
     * @param value => 值
     * @returns {TreeFactory}
     */
    TreeFactory.prototype.updateAllParentNode = function (node,name,value) {

        var treeFactory = this;
        var pTreeNode = treeFactory.getTreeNode(node._pid)
        while(pTreeNode){
            var pNode = pTreeNode.node

            pNode[name] = value;
            if(name === 'checked'){

                var pNodeChildren = pNode && pNode.children

                if(pNodeChildren && pNodeChildren.length){

                    var isAllChecked=value, hasChecked, hasUnChecked;
                    for(var i = 0, len = pNodeChildren.length; i<len;i++){
                        if(pNodeChildren[i].checked==='part'){
                            hasUnChecked = true
                        }else if(pNodeChildren[i].checked){
                            hasChecked = true
                        }else{
                            hasUnChecked = true
                        }
                    }
                    isAllChecked = ( hasChecked && hasUnChecked )? 'part':( hasChecked && !hasUnChecked );
                    pNode[name] = isAllChecked

                    if(isAllChecked && isAllChecked !== 'part'){
                        treeFactory.setChecked(pNode._id, pNode)
                    }else{
                        treeFactory.removeChecked(pNode._id)
                    }

                }

            }

            pTreeNode = treeFactory.getTreeNode(pNode._pid)
        }
        return treeFactory
    }


    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = denouiTree;
        }
        exports.denouiTree = denouiTree;
    } else {
        root.denouiTree = denouiTree;
    }

}())