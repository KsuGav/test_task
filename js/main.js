$(document).ready(function () {

    all_companies = [];

    function Company(name, cost) {
        this.new_state = true;
        this.name = name;
        this.cost = cost;

        this.children = [];
        this.parent = {};

        this.total_cost = 0;

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
            var cost_child = this.children;
            for (var i = 0; i < cost_child.length; i++) {
                sum += cost_child[i].cost;
                sum += cost_child[i].total_cost_child();
            }
            return this.total_cost = sum;

        };
        all_companies.push(this);
    }

    microsoft = new Company('Microsoft', 3000);
    skype = new Company('Skype', 2000);
    apple = new Company('Apple', 500);
    dada = new Company('dada', 200);
    nike = new Company('Nike', 1220);
    skype.set_parent(microsoft);
    dada.set_parent(skype);
    apple.set_parent(dada);

    //draw companies from database
    function drawCompany() {
        all_companies.forEach(function (company) {
            var baseDiv = $('<div class="company_div"></div>');
            var remove_button = $('<div class="remButton">&#10006</div>');
            var f_set = $('<fieldset class="fset">');

            var input_name = $('<label>Name: <input type="text" class="companyName" value="' + company.name + '"></label>');
            var input_cost = $('<label>Cost: <input type="number" class="companyName" value="' + company.cost + '"></label>');
            var input_total_cost = $('<label>Total Cost: <input type="number" class="companyName" value="' + company.get_total_cost() + '"></label>');
            $('input').prop('disabled', true);
            $(f_set).append(input_name, input_cost, input_total_cost);
            $(baseDiv).append(remove_button, f_set);
            $(baseDiv).addClass(company.name); //для связывания с штмл, добавление класса по имени
            if (!!company.parent.name) {
                $(baseDiv).addClass('child');
            }
            $('body').append(baseDiv);
        });
    }
    drawCompany();

//draw new company
    function drawNewCompany(company) {
        var baseDiv = $('<div class="company_div"></div>');
        var remove_new_button = $('<div class="remButton">&#10006</div>');
        var f_set = $('<fieldset class="fset">');
        var input_name = $('<label>Name: <input type="text" class="companyName" value="' + company.name + '"></label>');
        var input_cost = $('<label>Cost: <input type="number" class="companyCost" value="' + company.cost + '"></label>');
        var input_total_cost = $('<label>Total Cost: <input type="number" class="companyTotalCost" value="' + company.get_total_cost() + '"></label>');
        $('input').prop('disabled', true);
        $(f_set).append(input_name, input_cost, input_total_cost);
        $(baseDiv).append(remove_new_button, f_set);
        $(baseDiv).addClass(company.name);
        if (!!company.parent.name) {
            $(baseDiv).addClass('child');
        }
        $('body').append(baseDiv);
    }

    //create_company
    $('#addCompany').click(function () {
        var createDiv = $('<div class="create_div"></div>');
        var f_set_create = $('<fieldset class="fset">');
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
        drawNewCompany(newComp);
    });

    //delete company
    //дивы детей чтоб удалялись
    var button_del = $('.remButton');
    button_del.click(function (e) {
        $(e.target).parent().remove();
        var delCompany = $(e.target).parent().find('.companyName').val();
        all_companies.forEach(function (company) {
            if (company.name == delCompany) {
                company.del();
                $('.company_div').remove();  //delete all divs
            }
        });
        drawCompany();  //draw оставшиеся дивы
        console.log(all_companies);
    });

    //redact company
    //$('.company_div').dblclick(function (e) {
    //    var redact = e.target;
    //    //console.log(redact.parent()); //сделать, чтоб сохраняло в объект
    //    $(redact).attr("disabled", false);
    //    $(redact).focusout(function () {
    //        var newInfo = $(this).val();
    //    });
    //});

    //redact company
    $('.company_div').dblclick(function (e) {
        var redact = e.target;
        var oldValue = e.target.value;
        var fset = redact.closest('fieldset');
        console.log(fset);
        $(redact).attr("disabled", false);
        $('.companyTotalCost').hide();
        $(redact).focusout(function (e) {
            var newValue = e.target.value;
            $('.companyTotalCost').hide();
            var inp1 = $(fset[0]).find('input').value;
            var inp2 = $(fset[1]).find('input').value;
            var inp3 = $(fset[3]).find('input').value;
            all_companies[2].name = inp1;
            all_companies[2].name = inp2;
            all_companies[2].name = inp3;

// var all_fields$(redact).parents('.company_div').find('input')

        });
    });

    $(document).on('change', '#save_create', function (e) {
        //при добавлении новой компании, чтобы пересчитывался тотал кост
        // (при любом изменении - обновлялась вся инфа)

    });
// созданные компании не редактируются
    //рисовать иерархическое дерево elem.parents().скок родителей, такой и отступ
    //как называть каждую новую создавшуюся компанию

});
