var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.type = "exp";
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.type = "inc";
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
            expID: 0,
            incID: 0
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }



    return {
        addItem: function (type, desc, val) {
            var newItem;
            if (type === "exp") {
                newItem = new Expense(data.allItems.expID, desc, val)
            } else if (type === 'inc') {
                newItem = new Income(data.allItems.incID, desc, val)
            }
            data.allItems[type].push(newItem);
            data.allItems[type + "ID"] += 1;
            data.totals[type] += val;

            return newItem;
        }

    }


})();

var UIController = (function () {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        btnAdd: ".add__btn",
        incomeList: ".income__list",
        expensesList: ".expenses__list"
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        getDOMstrings: function () {
            return DOMstrings
        },

        addItemToUI: function (item) {
            var html, listClass;

            if (item.type === 'exp') {
                html = `
                <div class="item clearfix" id="expense-%id%">
                    <div class="item__description">%desc%</div>
                    <div class="right clearfix">
                        <div class="item__value">- %val%</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;

                html = html.replace('%id%', item.id);
                html = html.replace('%desc%', item.description);
                html = html.replace('%val%', item.value);

                listClassDOM = document.querySelector(DOMstrings.expensesList);
                listClassDOM.insertAdjacentHTML('beforeend', html);

            }
            else {
                html = `
                <div class="item clearfix" id="income-%id%">
                    <div class="item__description">%desc%</div>
                    <div class="right clearfix">
                        <div class="item__value">+ %val%</div>
                            <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                     </div>
                </div>`

                html = html.replace('%id%', item.id);
                html = html.replace('%desc%', item.description);
                html = html.replace('%val%', item.value);

                listClassDOM = document.querySelector(DOMstrings.incomeList);
                listClassDOM.insertAdjacentHTML('beforeend', html);
            }
        },

        clearInputFields: function () {
            var inputFieldsNode, inputFieldsArray

            inputFieldsNode = document.querySelectorAll(DOMstrings.inputDescription + ","
                + DOMstrings.inputValue);

            inputFieldsArray = Array.prototype.slice.call(inputFieldsNode);

            inputFieldsArray.forEach(function (element) {
                element.value = "";
            });
        }
    }

})();

var appController = (function (budgetCtrlr, UIContrlr) {

    var initEventListners = function () {
        var DOMstrings = UIContrlr.getDOMstrings();

        document.querySelector(DOMstrings.btnAdd).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {

            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        })
    }

    var ctrlAddItem = function () {
        var inputs = UIContrlr.getInput();
        console.log(inputs);
        var newItem = budgetCtrlr.addItem(inputs.type, inputs.description, inputs.value);
        UIContrlr.addItemToUI(newItem);
        UIContrlr.clearInputFields();
    }

    return {
        init: initEventListners
    }



})(budgetController, UIController);

appController.init();

