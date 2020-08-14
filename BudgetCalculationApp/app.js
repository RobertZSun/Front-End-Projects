var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calPerc = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Number(((this.value / totalInc) * 100).toFixed(2));
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPerc = function () {
        return this.percentage;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentageSpent: -1
    };

    var calTotals = function (type) {
        var sum = 0;
        data.allItems[type].forEach(item => {
            sum += item.value;
        });
        data.totals[type] = sum;
    };


    return {
        addItem: function (type, desc, value) {

            var newItem, id;

            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            // console.log(data.allItems[type][data.allItems[type].length - 1].id);

            // Create new ID
            id = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;

            // Create new item based on 'inc' or 'exp' type
            if (type === 'inc') {
                newItem = new Income(id, desc, value);
            } else if (type === 'exp') {
                newItem = new Expense(id, desc, value);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        calBudget: function () {

            // calculate total income and expense
            calTotals('exp');
            calTotals('inc');

            // calculate the budget : in - out
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that spent
            if (data.totals.inc > 0 && data.totals.exp > 0) {
                data.percentageSpent = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentageSpent = -1;
            }

        },
        getBudget: function () {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentageSpent
            };
        },
        deletItem: function (type, id) {

            var idArr = data.allItems[type].map(function (current) {
                return current.id;
            });

            var index = idArr.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },
        calPercentage: function () {
            data.allItems.exp.forEach(item => {
                item.calPerc(data.totals.inc);
            });
        },
        getPerc: function () {
            var allPercentages = data.allItems.exp.map(item => item.getPerc());
            return allPercentages;
        },
        testing: function () {
            console.log(data);
        }
    };
})();


var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function (originalValue, type) {
        var processedNum, integerPart, decimalPart, sign;
        processedNum = Math.abs(originalValue).toFixed(2);
        integerPart = processedNum.split('.')[0];
        decimalPart = processedNum.split('.')[1];
        if (integerPart.length > 3 && integerPart.length <= 6) {
            integerPart = integerPart.substr(0, integerPart.length - 3) + ',' + integerPart.substr(integerPart.length - 3, 3);
        } else if (integerPart.length > 6 && integerPart.length < 9) {
            integerPart = integerPart.substr(0, integerPart.length - 6) + ',' + integerPart.substr(integerPart.length - 6, 3) + ',' + integerPart.substr(integerPart.length - 3, 3);
        }
        if (type === 'inc') {
            sign = '+';
        } else if (type === 'exp') {
            sign = '-';
        }
        return sign + ' ' + integerPart + '.' + decimalPart;
    };

    var nodeListForeach = function (nodelist, callback) {
        for (var i = 0; i < nodelist.length; i++) {
            callback(nodelist[i], i);
        };
    };

    return {
        getInput: function () {
            // var type = document.querySelector('.add__type').value; // inc or exp
            // var description = document.querySelector('.add__description').value;
            // var value = document.querySelector('.add__value').value;

            return {
                type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        clearInput: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields, );
            fieldsArr.forEach(element => {
                element.value = '';
            });
            fieldsArr[0].focus();
        },
        getDOMStrings: function () {
            return DOMStrings;
        },
        displayMonth: function () {
            var now, year, month, months;
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        updatePercentage: function () {
            // calculate the percentage
            budgetController.calPercentage();

            // get from budget controller
            var percentages = budgetController.getPerc();

            // update the tag percentage
            this.displayPercentages(percentages);
        },
        addListItem: function (obj, type) {

            var htmlString, newHtml, element;
            // create HTML string 
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                htmlString = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                htmlString = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // insert the coordinated data
            // Replace the placeholder text with some actual data
            newHtml = htmlString.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            // newHtml = newHtml.replace('%value%', obj.value);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // uodate the HTML to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            // update the percentage tag for expense
            this.updatePercentage();
        },
        delListItem: function (id) {
            var toBeDeleted = document.getElementById(id);
            toBeDeleted.parentNode.removeChild(toBeDeleted);
        },
        displayBudget: function (obj) {
            var type;
            obj.budget >= 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },
        displayPercentages: function (data) {
            var allTagFields = document.querySelectorAll(DOMStrings.expensesPercLabel);


            this.nodeListForeach(allTagFields, function (item, index) {
                if (data[index] > 0) {
                    item.textContent = data[index] + '%';
                } else {
                    item.textContent = '---';
                }
            });
        },
        changedType: function () {
            var elements = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            nodeListForeach(elements, function (item) {
                item.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        }

    };
})();


var controller = (function (budgetCtrl, UICtrl) {

    var DOMStr = UICtrl.getDOMStrings();

    var setupEventListeners = function () {
        var DOMStr = UICtrl.getDOMStrings();

        document.querySelector(DOMStr.inputBtn).addEventListener('click', controlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                controlAddItem();
            }
        });

        document.querySelector(DOMStr.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOMStr.inputType).addEventListener('change', UIController.changedType);
    };

    var ctrlDeleteItem = function (e) {
        var itemID, splitID, type, id;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            // delete the item in data
            budgetController.deletItem(type, id);

            // delete the item in UI
            UIController.delListItem(itemID);

            // Update the UI
            updateBudget();

            // Update the percentage tag
            UIController.updatePercentage();
        }
    }

    var updateBudget = function () {
        // calculate the budget
        budgetController.calBudget();

        // return the budget
        var budget = budgetController.getBudget();
        // display the budget in UI
        UIController.displayBudget(budget);
    };



    var controlAddItem = function () {

        var input, newItem;
        // get the user input data with a object formate
        input = UIController.getInput();

        if (input.description.trim().length > 0 && !isNaN(input.value) && input.value > 0) {
            // store the data into the data object
            newItem = budgetController.addItem(input.type, input.description, input.value);

            // update in the UI
            UIController.addListItem(newItem, input.type);

            // clear the two input fields
            UIController.clearInput();

            // update budget
            updateBudget();
        }
    };

    return {
        init: function () {
            UIController.displayMonth();
            UIController.displayBudget({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };


})(budgetController, UIController);


controller.init();