$(document).ready(function () {

    var all_companies = [];

    function Company(name, cost) {
        this.new_state = true;
        this.name = name;
        this.cost = cost;

        this.children = {};
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
                //this.parent.children.push(this) //пуш пищет не функция
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
            return sum;

        };
        all_companies.push(this);
    }

    var microsoft = new Company('Microsoft', 3000);
    var skype = new Company('Skype', 2000);
    var apple = new Company('Apple', 500);
    var dada = new Company('dada', 200);
    var nike = new Company('Nike', 1220);
    skype.set_parent(microsoft);
    dada.set_parent(skype);
    apple.set_parent(dada);

//for choose company tree
//    for(var i=0;i<all_companies.length;i++){
//        drawCompany(all_companies[i])
//        if(!all_companies[i].parent.name){
//           $('.company_div').addClass('first')
//            //$('body').append(drawCompany(all_companies[i]));
//            console.log(all_companies[i].name)
//        }
//    }

    //draw companies from database
    function drawCompany() {
        all_companies.forEach(function (company) {
            var baseDiv = $('<div class="company_div"></div>');
            var f_set = $('<fieldset class="fset">');
            var input_name = $('<label>Name: <input type="text" disabled class="companyName" value="' + company.name + '"></label>');
            var input_cost = $('<label>Cost: <input type="number" disabled class="companyName" value="' + company.cost + '"></label>');
            var input_total_cost = $('<label>Total Cost: <input type="number" disabled class="companyName" value="' + company.total_cost + '"></label>');
            $(f_set).append(input_name, input_cost, input_total_cost);
            $(baseDiv).append(f_set);
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
        var f_set = $('<fieldset class="fset">');
        var input_name = $('<label>Name: <input type="text" disabled class="companyName" value="' + company.name + '"></label>');
        var input_cost = $('<label>Cost: <input type="number" disabled class="companyName" value="' + company.cost + '"></label>');
        var input_total_cost = $('<label>Total Cost: <input type="number" disabled class="companyName" value="' + company.total_cost + '"></label>');
        $(f_set).append(input_name, input_cost, input_total_cost);
        $(baseDiv).append(f_set);
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
        var popupDiv = $('<div class="pop_div"></div>');  //не вставляется
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
        console.log(all_companies);
        all_companies[parent].children = newComp;
        console.log(all_companies[parent]);
        $('.create_div').remove();
        drawNewCompany(newComp); //не видит див
    });

    //delete company
    //функция дел() тут не работает, отдельно работает
    $('.fset').contextmenu(function (e) {
        var del = e.target;
        $(del).remove();
        var delCompany = $(del).find('.companyName').val().toLowerCase();
        //$(delCompany).del();
        //all_companies[delCompany].del();
        //for(var l=0;l<all_companies.length;l++){
        if (skype.name === delCompany) {
            skype.del();
            //all_companies[l].del()
            //}
        }
        //console.log(delCompany)
        console.log(all_companies);
    });

    //redact company
    $('.company_div').dblclick(function (e) {
        var redact = e.target;
        console.log(redact.parent());
        $(redact).attr("disabled", false);
        $(redact).focusout(function () {
            var newInfo = $(this).val();
        });
    });


    //перестал работать тотал кост
    //рисовать иерархическое дерево
    //как называть каждую новую создавшуюся компанию
});