var  controllData = (
  function () {

    var Expense = function (id , description , value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
    var Income = function (id , description , value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
    var calculateTotal = function (type) {
      var sum = 0;
      data.allItems[type].forEach(function (cur) {
        sum += cur.value;
        data.total[type] = sum;
      })
    }
    var data = {
      allItems : {
        exp : [],
        inc : []
      },
      total : {
        exp : 0,
        inc : 0
      },
      budget : 0,
      percentage : -1
    }

    return {
      addItems : function (type ,des , val) {
        var ID , newItem;

        if (data.allItems[type].length > 0) {
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
          ID = 0;
        }
  
        if (type === 'exp') {
          newItem = new Expense (ID , des , val);
        } else if (type === 'inc') {
          newItem = new Income (ID , des , val);
        }
        data.allItems[type].push(newItem);
  
        return newItem;
        },
      deleteItem (type , id) {
        var ids , index;

        ids = data.allItems[type].map(function (cur) {
          return cur.id;
        })

        index = ids.indexOf(id);

        if (index !== -1) {
          data.allItems[type].splice(index , 1);
        }
      },
      calculateBudget : function () {
        calculateTotal("inc");
        calculateTotal("exp");

        data.budget = data.total.inc - data.total.exp;

        if (data.total.inc > 0) {
          data.percentage = Math.round(data.total.exp / data.budget * 100); 
        } else {
          data.percentage = -1;
        }
      },
      getBudget : function () {
        return {
          budget : data.budget,
          totalInc : data.total.inc,
          totalExp : data.total.exp,
          percentage : data.percentage
        }
      },
      testing : function () {
        console.log(data);
      }

    } 
    

  }
) ();



var controllUI =(
  function () {

    var DOMstrings = {
      inputType : '.add__type',
      inputDescription : '.add__description',
      inputValue : '.add__value',
      inputBtn : '.add__btn',
      incomeContainer : '.income__list',
      expensesContainer : '.expenses__list',
      budgetLabel : '.budget__value',
      incomeLabel : '.budget__income--value',
      expensesLabel : '.budget__expenses--value',
      percentageLabel : '.budget__expenses--percentage',
      container : '.container'
    }

    return {
      getDOMstrings : function () {
        return DOMstrings;
      },
      addListItem : function (obj , type) {
        var html , newHtml , element;

        if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
          element = DOMstrings.expensesContainer;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        newHtml = html.replace('%id%' , obj.id);
        newHtml = newHtml.replace('%description%' , obj.description);
        newHtml = newHtml.replace('%value%' , obj.value);

        document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);
      },
      cleaeFields : function () {
        var fields

        fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach( function (cur , i , arr) {
          cur.value = ''
        })
        fieldsArr[0].focus();
      },
      displayBudget : function (obj) {
        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        
        if (obj.percentage > 0) {
          document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
          document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }

      },
      getInput : function () {
        return {
          type : document.querySelector(DOMstrings.inputType).value,
          description : document.querySelector(DOMstrings.inputDescription).value,
          value : parseFloat(document.querySelector(DOMstrings.inputValue).value) 
        }
      }
    }


  }
) ();



var controller =(
  function (ctrlData , ctrlUI) {

    var setupEventListner = function () {
      var DOM = ctrlUI.getDOMstrings();
      document.querySelector(DOM.inputBtn).addEventListener('click' , addItems);
      document.addEventListener('keypress' , function (event) {
        if (event.keyCode === 13 || event.which ===13) {
          addItems();
        }
      })
      document.querySelector(DOM.container).addEventListener('click' , ctrlDelete)
    }

    var updateBudget = function () {
      ctrlData.calculateBudget();

      var budget = ctrlData.getBudget();

      ctrlUI.displayBudget(budget);
    }


    var addItems = function () {
      var input , newItem;

      input = ctrlUI.getInput();

      if (input.description !== '' && input.value > 0 && !isNaN(input.value)) {
        newItem = ctrlData.addItems(input.type , input.description , input.value);
  
        ctrlUI.addListItem(newItem , input.type);
  
        ctrlUI.cleaeFields();
  
        updateBudget();
      }
      
      
    }
    
    var ctrlDelete = function (event) {
      var itemID , splitID , type , ID;

      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

      if (itemID) {
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]) ;

        ctrlData.deleteItem(type , ID);
      }
    }

    return {
      init : function () {
        ctrlUI.displayBudget({
          budget : 0,
          totalInc : 0,
          totalExp : 0,
          percentage : -1
        });
        
        setupEventListner();
      }
    }

  }
) (controllData , controllUI);

controller.init();