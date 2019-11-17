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
        },
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
        },

        deleteItem: function (type, id) {
            var itemIndex = -1;
            var itemsArray = data.allItems[type]

            for (var i = 0; i < itemsArray.length; i++) {
                if (itemsArray[i].id === id) {
                    itemIndex = i;
                    break;
                }
            }

            if (itemIndex !== -1) {
                item = itemsArray.splice(itemIndex, 1)[0];
                data.totals[type] -= item.value;
            }
        },

        getBudget: function () {
            var budget, percentage = -1;
            budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            }

            return {
                budget: budget,
                percentage: percentage,
                income: data.totals.inc,
                expenses: data.totals.exp
            };
        },

        getData: function () {
            console.log(data);
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
        expensesList: ".expenses__list",
        budgetValue: ".budget__value",
        budgetIncome: ".budget__income--value",
        budgetExpenses: ".budget__expenses--value",
        budgetPercentage: ".budget__expenses--percentage",
        btnDelete: ".item__delete--btn",
        container: ".container"
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        getDOMstrings: function () {
            return DOMstrings
        },

        addItemToUI: function (item) {
            var html, listClass;

            if (item.type === 'exp') {
                html = `
                <div class="item clearfix" id="exp-%id%">
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
                <div class="item clearfix" id="inc-%id%">
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

        deleteItemFromUI: function (elementID) {
            var element = document.getElementById(elementID);
            element.parentNode.removeChild(element);
        },

        clearInputFields: function () {
            var inputFieldsNode, inputFieldsArray

            inputFieldsNode = document.querySelectorAll(DOMstrings.inputDescription + ","
                + DOMstrings.inputValue);

            inputFieldsArray = Array.prototype.slice.call(inputFieldsNode);

            inputFieldsArray.forEach(function (element) {
                element.value = "";
            });
        },

        updateBudgetUI: function (obj) {
            document.querySelector(DOMstrings.budgetValue).textContent = obj.budget;
            document.querySelector(DOMstrings.budgetIncome).textContent = obj.income;
            document.querySelector(DOMstrings.budgetExpenses).textContent = obj.expenses;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.budgetPercentage).textContent = obj.percentage + "%";
            }
            else {
                document.querySelector(DOMstrings.budgetPercentage).textContent = "--";
            }

        }
    }

})();

var appController = (function (budgetCtrlr, UIContrlr) {

    var init = function () {
        var DOMstrings = UIContrlr.getDOMstrings();

        document.querySelector(DOMstrings.budgetValue).textContent = 0;
        document.querySelector(DOMstrings.budgetIncome).textContent = 0;
        document.querySelector(DOMstrings.budgetExpenses).textContent = 0;
        document.querySelector(DOMstrings.budgetPercentage).textContent = "--";

        document.querySelector(DOMstrings.btnAdd).addEventListener('click', ctrlAddItem);

        document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);

        document.addEventListener('keypress', function (e) {

            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });

    }

    var validateInputs = function (inputs) {
        if (inputs.description === "") {
            console.log("Description cannot be empty");
            return false;
        }
        if (isNaN(inputs.value)) {
            console.log("Invalid value. Should be a number");
            return false;
        }
        if (inputs.value <= 0) {
            console.log("Should be greater than 0");
            return false;
        }
        return true;
    }

    var updateBudget = function () {
        var budget = budgetCtrlr.getBudget();
        UIContrlr.updateBudgetUI(budget);
        return budget;
    }

    var ctrlAddItem = function () {
        var inputs = UIContrlr.getInput();

        if (validateInputs(inputs)) {
            console.log(inputs);
            var newItem = budgetCtrlr.addItem(inputs.type, inputs.description, inputs.value);
            UIContrlr.addItemToUI(newItem);
            UIContrlr.clearInputFields();
            updateBudget();
        }
    }

    var ctrlDeleteItem = function (event) {
        var itemDOMid = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemDOMid) {
            var splitID = itemDOMid.split('-');
            var type = splitID[0];
            var id = parseInt(splitID[1]);

            budgetCtrlr.deleteItem(type, id);
            UIContrlr.deleteItemFromUI(itemDOMid);
            updateBudget();
        }
    }

    return {
        init: init
    }

})(budgetController, UIController);

appController.init();

