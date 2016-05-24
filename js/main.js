$(document).ready(function () {

    all_companies = [];

    function Company(name, cost) {

        this.name = name;
        this.cost = cost;

        this.children = [];
        this.parent = {};

        this.total_cost;

        this._removeChildren = function () {    //done
            if (this.children) {
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].del();
                }

            }
        };

        this.del = function () { //done
            this._removeChildren();
            var k = all_companies.indexOf(this);
            all_companies.splice(k, 1);
            return all_companies;
        };

        this.set_parent = function (parent) { //done
            if (parent) {
                this.parent = parent;
                this.parent.children.push(this);
            }
            return parent;
        };

        this.total_cost_child = function () {
            if (this.children) {
                var total = 0;
                for (var i = 0; i < this.children.length; i++) {
                    total += this.children[i].cost;
                }
                return total;
            }
        };

        this.get_total_cost = function () { //done
            var sum = cost;
            var cost_child = parseInt(this.children);
            for (var i = 0; i < cost_child.length; i++) {
                sum += cost_child[i].cost;
                sum += cost_child[i].total_cost_child();
            }
            return this.total_cost = sum;

        };
        this.guid = (function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        })();

        all_companies.push(this);
    }

    microsoft = new Company('Microsoft', 3000);
    nike = new Company('Nike', 1220);
    skype = new Company('Skype', 2000);
    dada = new Company('dada', 200);
    apple = new Company('Apple', 500);
    skype.set_parent(microsoft);
    dada.set_parent(skype);
    apple.set_parent(microsoft);

    //вывод компаний первого уровня(родителей)
    function listParent() {
        all_companies.forEach(function (company) {
            var v = _.each(company.parent, function (num, key) {
                return (key + ":" + num);
            });
            var parent = _.chain(v)
                .sortBy(function (child) {
                    return child.name;
                })
                .map(function (child) {
                    return child.name
                })
                .value();
            if (parent.length == 0) {
                drawParentCompany(company);
            }
        })
    }

    listParent();

    //draw new companies
    function drawCompany() {
        all_companies.forEach(function (company) {
            var baseDiv = $('<div class="company_div"></div>');
            var remove_button = $('<div class="remButton">&#10006</div>');
            var f_set = $('<fieldset class="fset">');
            var input_name = $('<label>Name: <input type="text" class="companyName" value="' + company.name + '"></label>');
            var input_cost = $('<label>Cost: <input type="number" class="companyCost" value="' + company.cost + '"></label>');
            var input_total_cost = $('<label>Total Cost: <input type="number" class="companyTotalCost" value="' + company.get_total_cost() + '"></label>');
            $(f_set).append(input_name, input_cost, input_total_cost);
            $(baseDiv).append(remove_button, f_set);
            $(baseDiv).addClass(company.name); //для связывания с штмл, добавление класса по имени
            if (!!company.parent.name) {
                $(baseDiv).css('margin-left', '200px');
                //$(baseDiv).addClass('child');
            }
            //return baseDiv;
            $('body').append(baseDiv);
        });
    }

//draw main company
    function drawParentCompany(company) {
        var baseDiv = $('<div class="company_div"></div>');
        var remove_new_button = $('<div class="remButton">&#10006</div>');
        var f_set = $('<fieldset class="fset">');
        var input_name = $('<label>Name: <input type="text" class="companyName" value="' + company.name + '"></label>');
        var input_cost = $('<label>Cost: <input type="number" class="companyCost" value="' + company.cost + '"></label>');
        var input_total_cost = $('<label>Total Cost: <input type="number" class="companyTotalCost" value="' + company.get_total_cost() + '"></label>');
        $(f_set).append(input_name, input_cost, input_total_cost);
        $(baseDiv).append(remove_new_button, f_set);
        $(baseDiv).addClass(company.name);
        $(baseDiv).attr('id', company.guid);
        //if (!!company.parent.name) {
        //    $(baseDiv).addClass('child');
        //}
        //return baseDiv;
        $('body').append(baseDiv);
    }

    //draw child company
    function drawChildCompany(company) {
        var baseDiv = $('<div class="company_div"></div>');
        var remove_new_button = $('<div class="remButton">&#10006</div>');
        var f_set = $('<fieldset class="fset">');
        var input_name = $('<label>Name: <input type="text" class="companyName" value="' + company.name + '"></label>');
        var input_cost = $('<label>Cost: <input type="number" class="companyCost" value="' + company.cost + '"></label>');
        var input_total_cost = $('<label>Total Cost: <input type="number" class="companyTotalCost" value="' + company.get_total_cost() + '"></label>');
        $(f_set).append(input_name, input_cost, input_total_cost);
        $(baseDiv).append(remove_new_button, f_set);
        $(baseDiv).addClass(company.name);
        $(baseDiv).attr('id', company.guid);
        var classParent = company.parent.name;
        //var parent = $('div').find('".'+classParent+'"');
        //var parent = $('div').hasClass(classParent);
        //if (parent) {
        //    $(parent).append(baseDiv);
            //$(baseDiv).addClass(company.parent.name);
        //}
        //return baseDiv;
        $('body').append(baseDiv);
    }

    //create_company
    $('#addCompany').click(function () {
        var createDiv = $('<div class="create_div"></div>');
        var f_set_create = $('<fieldset class="fsetCreate">');
        var create_name = $('<label>Name: <input type="text" class="companyName" value=""></label>');
        var create_cost = $('<label>Cost: <input type="number" class="companyCost" value=""></label>');
        var cr_parent = $('<label>Parent: </label>');
        var create_parent = '<select id="parents">';
        create_parent += "<option id='no_parent' value='no parent'>no parent</option>";
        for (var i = 0; i < all_companies.length; i++) {
            create_parent += "<option id= \'" + i + "\' value=\'" + all_companies[i].name +
                "\'>" + all_companies[i].name + "</option>";
        }
        create_parent += '</select>';
        var save_but = $('<button id="save_create">Save</button>');
        var popupDiv = $('<div class="pop_div"></div>');
        var docHeight = $(document).height();
        $(popupDiv).height(docHeight);
        $(cr_parent).append(create_parent);
        $(f_set_create).append(create_name, create_cost, cr_parent, save_but);
        $(createDiv).append(f_set_create);
        $('body').append(createDiv, popupDiv);
    });

    //save created company
    $(document).on('click', '#save_create', function (e) {
        var name = $(e.target).parent().find('.companyName').val();
        var cost = $(e.target).parent().find('.companyCost').val();
        var parent = $(e.target).parent().find('option:selected').attr('id');
        var newComp = new Company(name, cost);
        newComp.set_parent(all_companies[parent]);
//        all_companies.forEach(function (company) {
//$('.companyTotalCost').val(company.get_total_cost())
//        });
        $('.create_div').remove();
        $('.pop_div').remove();
    });

    //delete company
    $(document).on('click', '.remButton', function (e) {
        $(e.target).parent().remove();
        var delCompany = $(e.target).parent().find('.companyName').val();
        all_companies.forEach(function (company) {
            if (company.name == delCompany) {
                company.del();
                for (var t = 0; t < company.parent.children.length; t++) {
                    if (company.parent.children[t].name == company.name) {
                        company.parent.children.splice(t, 1)
                    }
                }
                $('.company_div').remove();
            }
        });
        drawCompany();
    });

    //redact company
    $(document).on('dblclick', '.company_div', function (e) {
        var redact = e.target;
        var fset = $(redact).children('fieldset');
        $(fset).css({
            "background-color": "yellow",
                "pointer-events": "all"
            });
        fset.find('.companyTotalCost').parent().hide();
        var div_id = $(e.target).attr('id');
        $('.company_div').focusout(function () {
            $(fset).css({
                "background-color": "bisque",
                "pointer-events": "all"
            });
            for (var n = 0; n < all_companies.length; n++) {
                if (all_companies[n].guid == div_id)
                    var redact_company = all_companies[n]
            }
            var inp1 = fset.find('.companyName').val();
            var inp2 = fset.find('.companyCost').val();
            redact_company.name = inp1;
            redact_company.cost = parseInt(inp2);
            redact_company.total_cost = redact_company.get_total_cost();
            fset.find('.companyTotalCost').parent().show();
        });
    });

    //вывод детей при клике на родителя
    $(document).on('click', '.company_div', function (e) {
        var parent = $(e.target).attr('class').split(' ')[1];
        for (var m = 0; m < all_companies.length; m++) {
            if (all_companies[m].name == parent) {
                listChildrens(all_companies[m])
            }
        }

    });

    //show list name of childrens
    function listChildrens(company) {
        var v = _.each(company.children, function (num, key) {
            return (key + ":" + num);
        });
        for (var f = 0; f < v.length; f++) {
            drawChildCompany(v[f]);
        }
    }


    //$( ".inner" ).after( "<p>Test</p>" );

    //1 (при любом изменении - обновлялась вся инфа):
    //-при добавлении новой компании или редактировании, чтобы пересчитывался тотал кост
    //-у родителей и детей перезаписывал измененные имена
    //2рисовать иерархическое дерево c отступами отступ

    //find company for redact
    //function findCompany(some_name) {
    //    for (var i = 0; i < all_companies.length; i++) {
    //        if (some_name == all_companies[i].name) {
    //            return all_companies[i]
    //        }
    //    }
    //}

});
